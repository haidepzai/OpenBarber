package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.repository.EnterpriseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EnterpriseService {

    private final EnterpriseRepository enterpriseRepository;

    public EnterpriseService(EnterpriseRepository enterpriseRepository) {
        this.enterpriseRepository = enterpriseRepository;
    }

    public Enterprise createEnterprise(Enterprise enterprise) {
        return enterpriseRepository.save(enterprise);
    }

    public List<Enterprise> getAllEnterprises() {
        return enterpriseRepository.findAll();
    }

    public Enterprise getEnterpriseById(long id) {
        return enterpriseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found"));
    }

    public Enterprise updateEnterprise(long id, Enterprise newEnterprise) {
        return enterpriseRepository.findById(id)
                .map(enterprise -> {
                    enterprise.setName(newEnterprise.getName());
                    enterprise.setAddress(newEnterprise.getAddress());
                    enterprise.setAddressLongitude(newEnterprise.getAddressLongitude());
                    enterprise.setAddressAltitude(newEnterprise.getAddressAltitude());
                    enterprise.setEMail(newEnterprise.getEMail());
                    enterprise.setServices(newEnterprise.getServices());
                    enterprise.setEmployees(newEnterprise.getEmployees());
                    enterprise.setLogo(newEnterprise.getLogo());
                    enterprise.setPictures(newEnterprise.getPictures());
                    enterprise.setWebsite(newEnterprise.getWebsite());
                    enterprise.setPhoneNumber(newEnterprise.getPhoneNumber());
                    enterprise.setApporoved(newEnterprise.isApporoved());
                    return enterpriseRepository.save(enterprise);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found"));
    }

    public boolean deleteEnterprise(long id) {
        boolean wasDeleted = enterpriseRepository.existsById(id);
        if (wasDeleted) {
            enterpriseRepository.deleteById(id);
        }
        return wasDeleted;
    }
}
