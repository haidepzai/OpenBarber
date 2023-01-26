package com.hdmstuttgart.mi.backend.service;

import io.camassia.mjml.MJMLClient;
import io.camassia.mjml.model.request.RenderRequest;
import io.camassia.mjml.model.response.RenderResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
public class EmailSenderService {
    @Autowired
    private JavaMailSender mailSender;
    private MJMLClient mjmlClient;

    @Value("${mjmlSecrets.appId}")
    String appId;

    @Value("${mjmlSecrets.appKey}")
    String appKey;


    //mjmlText will be read from mjml file in the future - its just pasted here right now
    public String mjmlText = "<mjml> <mj-head> <mj-title>Discount Light</mj-title> <mj-preview>Pre-header Text</mj-preview> <mj-attributes> <mj-all font-family=\"'Helvetica Neue', Helvetica, Arial, sans-serif\"></mj-all> <mj-text font-weight=\"400\" font-size=\"16px\" color=\"#000000\" line-height=\"24px\" font-family=\"'Helvetica Neue', Helvetica, Arial, sans-serif\"></mj-text> </mj-attributes> <mj-style inline=\"inline\"> .body-section { -webkit-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); -moz-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); } </mj-style> <mj-style inline=\"inline\"> .text-link { color: #5e6ebf } </mj-style> <mj-style inline=\"inline\"> .footer-link { color: #888888 } </mj-style> </mj-head> <mj-body background-color=\"#E7E7E7\" width=\"600px\"> <mj-section full-width=\"full-width\" background-color=\"#3B2D24\" padding-bottom=\"0\"> <mj-column width=\"100%\"> <mj-image src=\"http://i.epvpimg.com/91j3gab.png\" alt=\"\" align=\"center\" width=\"80px\" /> <mj-text color=\"#ffffff\" font-weight=\"bold\" align=\"center\" font-size=\"16px\" letter-spacing=\"1px\" padding-top=\"30px\"> Activate your business account now! </mj-text> <mj-text color=\"#3CBAAD\" align=\"center\" font-size=\"13px\" padding-top=\"0\" font-weight=\"bold\" text-transform=\"uppercase\" letter-spacing=\"1px\" line-height=\"20px\"> </mj-text> </mj-column> </mj-section> <mj-section full-width=\"full-width\" background-color=\"#3B2D24\" padding-bottom=\"0\"> <mj-column width=\"100%\" background-color=\"#FFF\"> <mj-text>&nbsp</mj-text> </mj-column> </mj-section> <mj-wrapper padding-top=\"0\" padding-bottom=\"0\" css-class=\"body-section\"> <mj-section background-color=\"#ffffff\" padding-left=\"15px\" padding-right=\"15px\"> <mj-column width=\"100%\"> <mj-text color=\"#212b35\" font-weight=\"bold\" font-size=\"20px\"> Find your verification code down here! </mj-text> <mj-text color=\"#637381\" font-size=\"16px\"> Dear Son Hai Vu, </mj-text> <mj-text color=\"#637381\" font-size=\"16px\"> thank you for signing up at OpenBarber! You just need to go through a short verification process in order to activate your business account. </mj-text> <mj-text color=\"#637381\" font-size=\"16px\"> Just login at our website and copy pasta the following code: </mj-text> <mj-text color=\"#212b35\" font-weight=\"bold\" font-size=\"18px\"> 69420 </mj-text> <mj-button background-color=\"#3CBAAD\" align=\"center\" color=\"#ffffff\" font-size=\"17px\" font-weight=\"bold\" href=\"https://google.com\" width=\"300px\"> Visit OpenBarber </mj-button> <mj-text color=\"#637381\" font-size=\"16px\"> <br/> <br/> Do you need further help with our verification process?<br/> Don't worry we've got your back! Here is a rather small instruction which will guide you through the next steps: </mj-text> <mj-text color=\"#637381\" font-size=\"16px\"> <ol> <li style=\"padding-bottom: 20px\"><strong>Copy & Pasta:</strong> Paste the verification code at our website.</li> <li style=\"padding-bottom: 20px\"><strong>Register your first shop:</strong> Fill out the inital registry form for business cases.</li> <li><strong>Wait for our response:</strong> We will personally check your entries and verificate your shop.</li> </ol> </mj-text> </mj-column> </mj-section> <mj-section background-color=\"#ffffff\" padding-left=\"15px\" padding-right=\"15px\" padding-top=\"0\"> <mj-column width=\"100%\"> <mj-divider border-color=\"#DFE3E8\" border-width=\"1px\" /> </mj-column> </mj-section> <mj-section background-color=\"#ffffff\" padding=\"0 15px 0 15px\"> <mj-column width=\"100%\"> <mj-text color=\"#212b35\" font-weight=\"bold\" font-size=\"20px\" padding-bottom=\"0\"> More support needed? </mj-text> <mj-text color=\"#637381\" font-size=\"16px\"> We're looking forward to meeting you. </mj-text> </mj-column> </mj-section> <mj-section background-color=\"#ffffff\" padding-left=\"15px\" padding-right=\"15px\"> <mj-column width=\"50%\"> <mj-text color=\"#212b35\" font-size=\"12px\" text-transform=\"uppercase\" font-weight=\"bold\" padding-bottom=\"0\"> e-mail address </mj-text> <mj-text color=\"#637381\" font-size=\"14px\" padding-top=\"0\"> support@openbarber.com </mj-text> </mj-column> <mj-column width=\"50%\"> <mj-text color=\"#212b35\" font-size=\"12px\" text-transform=\"uppercase\" font-weight=\"bold\" padding-bottom=\"0\"> Hours of Operation </mj-text> <mj-text color=\"#637381\" font-size=\"14px\" padding-top=\"0\"> Monday - Friday: <br />8:00AM - 5:00PM <br /> <br /> Saturday & Sunday:<br />8:00AM - 5:00PM </mj-text> </mj-column> </mj-section> <mj-section background-color=\"#ffffff\" padding-left=\"15px\" padding-right=\"15px\"> </mj-section> </mj-wrapper> <mj-wrapper full-width=\"full-width\"> <mj-section> <mj-column width=\"100%\" padding=\"0\"> <mj-social font-size=\"15px\" icon-size=\"30px\" mode=\"horizontal\" padding=\"0\" align=\"center\"> <mj-social-element name=\"facebook\" href=\"OpenBarber\" background-color=\"#3CBAAD\"> </mj-social-element> <mj-social-element name=\"google\" href=\"OpenBarber\" background-color=\"#3CBAAD\"> </mj-social-element> <mj-social-element name=\"twitter\" href=\"OpenBarber\" background-color=\"#3CBAAD\"> </mj-social-element> <mj-social-element name=\"linkedin\" href=\"OpenBarber\" background-color=\"#3CBAAD\"> </mj-social-element> </mj-social> <mj-text color=\"#445566\" font-size=\"11px\" font-weight=\"bold\" align=\"center\"> View this email in your browser </mj-text> <mj-text color=\"#445566\" font-size=\"11px\" align=\"center\" line-height=\"16px\"> You are receiving this email advertisement because you registered with <br />OpenBarber AG. (Stuttgarter Straße 5, Leinfelden, DE 70771)<br /> and agreed to receive emails from us regarding new features, events and special offers. </mj-text> <mj-text color=\"#445566\" font-size=\"11px\" align=\"center\" line-height=\"16px\"> &copy; OpenBarber AG, All Rights Reserved. </mj-text> </mj-column> </mj-section> <mj-section padding-top=\"0\"> <mj-group> <mj-column width=\"100%\" padding-right=\"0\"> <mj-text color=\"#445566\" font-size=\"11px\" align=\"center\" line-height=\"16px\" font-weight=\"bold\"> <a class=\"footer-link\" href=\"https://www.google.com\">Privacy</a>&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;<a class=\"footer-link\" href=\"https://www.google.com\">Unsubscribe</a> </mj-text> </mj-column> </mj-group> </mj-section> </mj-wrapper> </mj-body> </mjml>";

    //need to insert variables here too
    public void sendVerificationEmail() throws MessagingException {
        this.mjmlClient = MJMLClient.newDefaultClient()
                .withApplicationID(appId)
                .withApplicationKey(appKey);
        RenderRequest request = new RenderRequest(mjmlText);
        RenderResponse response = mjmlClient.render(request);
        String plainHTML = response.getHTML();
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
        helper.setText(plainHTML, true);
        helper.setTo("dr080@hdm-stuttgart.de");
        helper.setSubject("OpenBarber - Your verification code is here!");
        helper.setFrom("openbarber@outlook.de");

        mailSender.send(mimeMessage);
        System.out.println("Mail sent successfully ... ");
    }
}
