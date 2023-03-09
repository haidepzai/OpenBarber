package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.BackendApplication;
import com.hdmstuttgart.mi.backend.model.Appointment;
import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.repository.EmployeeRepository;
import com.hdmstuttgart.mi.backend.repository.EnterpriseRepository;
import com.hdmstuttgart.mi.backend.repository.UserRepository;
import io.camassia.mjml.MJMLClient;
import io.camassia.mjml.model.request.RenderRequest;
import io.camassia.mjml.model.response.RenderResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.UUID;

/**
 * Description:
 * Overall, this class provides a useful abstraction for sending emails with MJML templates, which can help to standardize
 * the appearance of emails and make them more visually appealing. The use of Spring's dependency injection and the MJMLClient
 * library make this class easy to use and extend.
 */
@Service
public class EmailSenderService {
    private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);
    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    UserRepository userRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    EnterpriseRepository enterpriseRepository;

    private MJMLClient mjmlClient;

    @Value("${mjmlSecrets.appId}")
    String appId;

    @Value("${mailCredentials.username}")
    String mailUsername;

    @Value("${mjmlSecrets.appKey}")
    String appKey;

    HashMap<String, String> mjmlTemplateTexts = new HashMap<String, String>();

    public void readMJMLTemplatesIntoMap() throws IOException {
        File folder = new File("src/main/java/com/hdmstuttgart/mi/backend/templates");
        File[] listOfFiles = folder.listFiles();

        for (int i = 0; i < listOfFiles.length; i++) {
            if (listOfFiles[i].isFile()) {
                mjmlTemplateTexts.put(listOfFiles[i].getName().replaceAll(".mjml", ""), Files.readString(Path.of(listOfFiles[i].getAbsolutePath()), StandardCharsets.UTF_8));
            }
        }
    }

    public void insertDataIntoTemplate(String templateName, String emailAddress) throws IOException {
        readMJMLTemplatesIntoMap();
        User user = userRepository.findByEmail(emailAddress).orElseThrow();
        String preparedText = mjmlTemplateTexts.get(templateName).replace("blank_verificationCode", user.getConfirmationCode())
                .replace("blank_ratingURL", "http://localhost:3000/rating/" + user.getConfirmationCode());
        mjmlTemplateTexts.put(templateName, preparedText);
    }

    public void sendEmailWithTemplate(String email, String templateName) throws MessagingException, IOException {

        //MJML API setup
        this.mjmlClient = MJMLClient.newDefaultClient()
                .withApplicationID(appId)
                .withApplicationKey(appKey);
        log.info("Found MJML client");
        //MJML string preparation for the request and send out
        insertDataIntoTemplate(templateName, email);
        RenderRequest request = new RenderRequest(mjmlTemplateTexts.get(templateName));
        RenderResponse response = mjmlClient.render(request);
        String plainHTML = response.getHTML();
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
        helper.setText(plainHTML, true);
        helper.setTo(email);

        //template specific email subjects
        if(templateName.equals("verification")) {
            helper.setSubject("OpenBarber - Your verification code is here!");
        } else {
            helper.setSubject("OpenBarber - Did you miss us?");
        }
        helper.setFrom(mailUsername);

        mailSender.send(mimeMessage);
        log.debug("Mail sent successfully ... ");
    }

    public void insertDataIntoTemplate(String templateName, Appointment appointment) throws IOException {
        readMJMLTemplatesIntoMap();
        String appointmentDate = appointment.getAppointmentDateTime().format(DateTimeFormatter.ofPattern("dd.MM.yy HH:mm"));
        String customerName = appointment.getCustomerName();
        Employee employee = employeeRepository.findById(appointment.getEmployee().getId()).orElseThrow();
        String employeeName = employee.getName();
        Enterprise enterprise = enterpriseRepository.findById(appointment.getEnterprise().getId()).orElseThrow();
        String enterpriseName = enterprise.getName();
        String confirmationCode = appointment.getConfirmationCode().toString();


        String preparedText = mjmlTemplateTexts.get(templateName)
                .replace("blank_enterpriseName", enterpriseName)
                .replace("blank_username", customerName)
                .replace("blank_stylist", employeeName)
                .replace("blank_appointmentDate", appointmentDate)
                .replace("blank_confirmUrl", "http://localhost:3000/appointment/" + appointment.getId() + "?confirmationCode=" + confirmationCode)
                .replace("blank_cancelUrl", "http://localhost:3000/cancel-appointment/" + appointment.getId() + "?confirmationCode=" + confirmationCode);

        mjmlTemplateTexts.put(templateName, preparedText);
    }

    public void sendEmailWithTemplate(Appointment appointment, String templateName, String email) throws MessagingException, IOException {

                //MJML API setup
        this.mjmlClient = MJMLClient.newDefaultClient()
                .withApplicationID(appId)
                .withApplicationKey(appKey);
        log.info("Found MJML client");
        //MJML string preparation for the request and send out
        insertDataIntoTemplate(templateName, appointment);
        RenderRequest request = new RenderRequest(mjmlTemplateTexts.get(templateName));
        RenderResponse response = mjmlClient.render(request);
        String plainHTML = response.getHTML();
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
        helper.setText(plainHTML, true);
        helper.setTo(email);

        //template specific email subjects
        if(templateName.equals("appointment")) {
            helper.setSubject("OpenBarber - Your appointment!");
        } else {
            helper.setSubject("OpenBarber - Did you miss us?");
        }
        helper.setFrom(mailUsername);

        mailSender.send(mimeMessage);
        log.debug("Mail sent successfully ... ");
    }
}
