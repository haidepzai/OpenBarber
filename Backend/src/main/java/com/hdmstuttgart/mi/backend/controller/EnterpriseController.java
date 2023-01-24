package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.service.EnterpriseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enterprises")
public class EnterpriseController {

    private final EnterpriseService enterpriseService;

    public EnterpriseController(EnterpriseService enterpriseService) {
        this.enterpriseService = enterpriseService;
    }

    @PostMapping
    public Enterprise createEnterprise(@RequestBody Enterprise enterprise) {
        return enterpriseService.createEnterprise(enterprise);
    }

    @GetMapping
    public List<Enterprise> getAllEnterprises() {
        return enterpriseService.getAllEnterprises();
    }

    @GetMapping("/{id}")
    public Enterprise getEnterpriseById(@PathVariable long id) {
        return enterpriseService.getEnterpriseById(id);
    }

    @PutMapping("/{id}")
    public Enterprise updateEnterprise(@PathVariable long id, @RequestBody Enterprise newEnterprise) {
        return enterpriseService.updateEnterprise(id, newEnterprise);
    }

    @DeleteMapping("/{id}")
    public void deleteEnterprise(@PathVariable long id) {
        enterpriseService.deleteEnterprise(id);
    }
}