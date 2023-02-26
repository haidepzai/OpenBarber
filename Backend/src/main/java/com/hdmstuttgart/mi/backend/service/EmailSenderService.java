package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.repository.UserRepository;
import io.camassia.mjml.MJMLClient;
import io.camassia.mjml.model.request.RenderRequest;
import io.camassia.mjml.model.response.RenderResponse;
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
import java.util.HashMap;
import java.util.Optional;

@Service
public class EmailSenderService {
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    UserRepository userRepository;

    private MJMLClient mjmlClient;

    @Value("${mjmlSecrets.appId}")
    String appId;

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
        String preparedText = mjmlTemplateTexts.get(templateName).replace("blank_verificationCode", user.getConfirmationCode());
        mjmlTemplateTexts.put(templateName, preparedText);
    }

    public void sendEmailWithTemplate(String email, String username, String templateName) throws MessagingException, IOException {

        //MJML API setup
        this.mjmlClient = MJMLClient.newDefaultClient()
                .withApplicationID(appId)
                .withApplicationKey(appKey);

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
            helper.setSubject("OpenBarber - Verification");
        }
        helper.setFrom("openbarber@outlook.de");

        mailSender.send(mimeMessage);
        System.out.println("Mail sent successfully ... ");
    }
}
