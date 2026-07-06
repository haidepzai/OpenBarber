package com.hdmstuttgart.mi.backend.service.impl;

import com.hdmstuttgart.mi.backend.BackendApplication;
import com.hdmstuttgart.mi.backend.model.Appointment;
import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.Shop;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.repository.EmployeeRepository;
import com.hdmstuttgart.mi.backend.repository.ShopRepository;
import com.hdmstuttgart.mi.backend.repository.UserRepository;
import com.hdmstuttgart.mi.backend.service.IEmailSenderService;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import io.camassia.mjml.MJMLClient;
import io.camassia.mjml.model.request.RenderRequest;
import io.camassia.mjml.model.response.RenderResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;

@Service
public class EmailSenderServiceImpl implements IEmailSenderService {
    private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final ShopRepository shopRepository;
    private final String appId;
    private final String mailFrom;
    private final String appKey;
    private final String frontendUrl;
    private final String resendApiKey;
    private final HashMap<String, String> mjmlTemplateTexts = new HashMap<>();
    private MJMLClient mjmlClient;

    public EmailSenderServiceImpl(final UserRepository userRepository,
                                  final EmployeeRepository employeeRepository,
                                  final ShopRepository shopRepository,
                                  final MJMLClient mjmlClient,
                                  @Value("${mjmlSecrets.appId}") final String appId,
                                  @Value("${mailCredentials.username}") final String mailFrom,
                                  @Value("${mjmlSecrets.appKey}") final String appKey,
                                  @Value("${app.frontend-url}") final String frontendUrl,
                                  @Value("${resend.api-key:}") final String resendApiKey) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.shopRepository = shopRepository;
        this.mjmlClient = mjmlClient;
        this.appId = appId;
        this.mailFrom = mailFrom;
        this.appKey = appKey;
        this.frontendUrl = frontendUrl;
        this.resendApiKey = resendApiKey;
    }

    public void readMJMLTemplatesIntoMap() throws IOException {
        mjmlTemplateTexts.clear();

        final PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        final Resource[] resources = resolver.getResources("classpath:/templates/*.mjml");

        for (final Resource resource : resources) {
            if (resource.isReadable()) {
                final String fileName = resource.getFilename();
                if (fileName != null) {
                    final String templateName = fileName.replace(".mjml", "");
                    mjmlTemplateTexts.put(templateName, new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8));
                }
            }
        }

        if (mjmlTemplateTexts.isEmpty()) {
            final File folder = new File("src/main/java/com/hdmstuttgart/mi/backend/templates");
            final File[] listOfFiles = folder.listFiles();
            if (listOfFiles == null) {
                throw new IOException("No MJML templates found");
            }
            for (final File listOfFile : listOfFiles) {
                if (listOfFile.isFile()) {
                    mjmlTemplateTexts.put(listOfFile.getName().replaceAll(".mjml", ""), Files.readString(Path.of(listOfFile.getAbsolutePath()), StandardCharsets.UTF_8));
                }
            }
        }
    }

    private String renderMjml(final String templateName) throws IOException {
        this.mjmlClient = MJMLClient.newDefaultClient()
                .withApplicationID(appId)
                .withApplicationKey(appKey);
        final RenderRequest request = new RenderRequest(mjmlTemplateTexts.get(templateName));
        final RenderResponse response = mjmlClient.render(request);
        return response.getHTML();
    }

    private void sendViaResend(final String to, final String subject, final String html) throws IOException {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            log.warn("RESEND_API_KEY not set — skipping email to {}", to);
            return;
        }
        try {
            final Resend resend = new Resend(resendApiKey);
            final CreateEmailOptions params = CreateEmailOptions.builder()
                    .from(mailFrom)
                    .to(to)
                    .subject(subject)
                    .html(html)
                    .build();
            resend.emails().send(params);
            log.debug("Email sent via Resend to {}", to);
        } catch (ResendException e) {
            throw new IOException("Failed to send email via Resend: " + e.getMessage(), e);
        }
    }

    public void insertDataIntoTemplate(final String templateName, final String emailAddress) throws IOException {
        readMJMLTemplatesIntoMap();
        final User user = userRepository.findByEmail(emailAddress).orElseThrow();
        final String template = mjmlTemplateTexts.get(templateName);
        if (template == null) throw new IOException("MJML template not found: " + templateName);
        final String preparedText = template
                .replace("blank_verificationCode", user.getConfirmationCode())
                .replace("blank_ratingURL", frontendUrl + "/rating/" + user.getConfirmationCode());
        mjmlTemplateTexts.put(templateName, preparedText);
    }

    public void sendEmailWithTemplate(final String email, final String templateName) throws IOException {
        insertDataIntoTemplate(templateName, email);
        final String html = renderMjml(templateName);
        final String subject = templateName.equals("verification")
                ? "OpenBarber - Your verification code is here!"
                : "OpenBarber - Did you miss us?";
        sendViaResend(email, subject, html);
    }

    public void insertDataIntoTemplate(final String templateName, final Appointment appointment) throws IOException {
        readMJMLTemplatesIntoMap();
        final String appointmentDate = appointment.getAppointmentDateTime().format(DateTimeFormatter.ofPattern("dd.MM.yy HH:mm"));
        final String customerName = appointment.getCustomerName();
        final Employee employee = employeeRepository.findById(appointment.getEmployee().getId()).orElseThrow();
        final Shop shop = shopRepository.findById(appointment.getShop().getId()).orElseThrow();
        final String confirmationCode = appointment.getConfirmationCode().toString();

        final String template = mjmlTemplateTexts.get(templateName);
        if (template == null) throw new IOException("MJML template not found: " + templateName);
        final String preparedText = template
                .replace("blank_shopName", shop.getName())
                .replace("blank_username", customerName)
                .replace("blank_stylist", employee.getName())
                .replace("blank_appointmentDate", appointmentDate)
                .replace("blank_confirmUrl", frontendUrl + "/appointment/" + appointment.getId() + "?confirmationCode=" + confirmationCode)
                .replace("blank_cancelUrl", frontendUrl + "/cancel-appointment/" + appointment.getId() + "?confirmationCode=" + confirmationCode);
        mjmlTemplateTexts.put(templateName, preparedText);
    }

    public void sendEmailWithTemplate(final Appointment appointment, final String templateName, final String email) throws IOException {
        insertDataIntoTemplate(templateName, appointment);
        final String html = renderMjml(templateName);
        final String subject = templateName.equals("appointment")
                ? "OpenBarber - Your appointment!"
                : "OpenBarber - Did you miss us?";
        sendViaResend(email, subject, html);
    }

    public void sendPasswordResetEmail(final String email, final String token) throws IOException {
        readMJMLTemplatesIntoMap();
        final String resetUrl = frontendUrl + "/reset-password?token=" + token;
        final String template = mjmlTemplateTexts.get("password-reset");
        if (template == null) throw new IOException("MJML template not found: password-reset");
        final String preparedText = template.replace("blank_resetUrl", resetUrl);
        mjmlTemplateTexts.put("password-reset", preparedText);

        final String html = renderMjml("password-reset");
        sendViaResend(email, "OpenBarber - Passwort zurücksetzen", html);
    }
}
