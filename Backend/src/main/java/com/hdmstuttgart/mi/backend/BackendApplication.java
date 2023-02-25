package com.hdmstuttgart.mi.backend;

import com.hdmstuttgart.mi.backend.service.EmailSenderService;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.slf4j.Logger;


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
        System.out.println("tested");
    }

}
