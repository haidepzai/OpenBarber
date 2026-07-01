package com.hdmstuttgart.mi.backend.service.impl;

import com.hdmstuttgart.mi.backend.service.IRecaptchaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class RecaptchaServiceImpl implements IRecaptchaService {

    private static final Logger log = LoggerFactory.getLogger(RecaptchaServiceImpl.class);
    private static final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
    private final RestTemplate restTemplate = new RestTemplate();
    @Value("${recaptcha.secret}")
    private String secretKey;

    public boolean verify(final String token) {
        if (token == null || token.isBlank()) {
            return false;
        }
        try {
            final String url = VERIFY_URL + "?secret=" + secretKey + "&response=" + token;
            final Map<?, ?> response = restTemplate.postForObject(url, null, Map.class);
            return response != null && Boolean.TRUE.equals(response.get("success"));
        } catch (final Exception e) {
            log.error("reCAPTCHA verification failed", e);
            return false;
        }
    }
}
