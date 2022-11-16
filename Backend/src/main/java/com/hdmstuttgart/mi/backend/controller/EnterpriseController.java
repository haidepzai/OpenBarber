package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.repository.EnterpriseRepository;
import org.springframework.web.bind.annotation.*;

@RestController
public class EnterpriseController {

    private final EnterpriseRepository enterpriseRepository;

    public EnterpriseController(EnterpriseRepository enterpriseRepository) {
        this.enterpriseRepository = enterpriseRepository;
    }
}
