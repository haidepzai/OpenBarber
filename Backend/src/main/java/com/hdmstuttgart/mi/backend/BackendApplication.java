package com.hdmstuttgart.mi.backend;

import com.hdmstuttgart.mi.backend.service.EmailSenderService;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import org.slf4j.Logger;

import javax.mail.MessagingException;

//@RestController
//@EnableAutoConfiguration
//@EnableJpaAuditing
@SpringBootApplication
public class BackendApplication {

    private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);

    @Autowired
    private EmailSenderService emailSenderService;



    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }


/*
    //Uncomment to send a mail after boot up - configure in service class
    @EventListener(ApplicationReadyEvent.class)
    public void sendMail() throws MessagingException {
        emailSenderService.sendVerificationEmail();
    }
*/


}
