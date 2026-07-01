package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.Appointment;

import javax.mail.MessagingException;
import java.io.IOException;

public interface IEmailSenderService {
    void readMJMLTemplatesIntoMap() throws IOException;

    void insertDataIntoTemplate(String templateName, String emailAddress) throws IOException;

    void sendEmailWithTemplate(String email, String templateName) throws MessagingException, IOException;

    void insertDataIntoTemplate(String templateName, Appointment appointment) throws IOException;

    void sendEmailWithTemplate(Appointment appointment, String templateName, String email) throws MessagingException, IOException;

    void sendPasswordResetEmail(String email, String token) throws MessagingException, IOException;
}
