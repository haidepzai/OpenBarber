package com.hdmstuttgart.mi.backend;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.slf4j.Logger;



import org.springframework.scheduling.annotation.EnableScheduling;

//@RestController
//@EnableJpaAuditing
@SpringBootApplication
@EnableScheduling
public class BackendApplication {

    private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
        log.debug("Backend application started");
    }

}
