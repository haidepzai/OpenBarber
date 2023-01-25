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
        List<Enterprise> enterprises = enterpriseRepository.findAll();
        if (enterprises.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "No enterprises found");
        }
        return enterprises;
    }

    public Enterprise getEnterpriseById(long id) {
        return enterpriseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with id = " + id));
    }

    public Enterprise updateEnterprise(long id, Enterprise newEnterprise) {
        return enterpriseRepository.findById(id)
                .map(enterprise -> {
                    enterprise.setName(newEnterprise.getName());
                    enterprise.setAddress(newEnterprise.getAddress());
                    enterprise.setAddressLongitude(newEnterprise.getAddressLongitude());
                    enterprise.setAddressAltitude(newEnterprise.getAddressAltitude());
                    enterprise.setEMail(newEnterprise.getEMail());
                    enterprise.setLogo(newEnterprise.getLogo());
                    enterprise.setPictures(newEnterprise.getPictures());
                    enterprise.setWebsite(newEnterprise.getWebsite());
                    enterprise.setPhoneNumber(newEnterprise.getPhoneNumber());
                    enterprise.setApproved(newEnterprise.isApproved());
                    return enterpriseRepository.save(enterprise);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with id = " + id));
    }

    public void deleteEnterprise(long id) {
        if (!enterpriseRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with id = " + id);
        }
        enterpriseRepository.deleteById(id);
    }
}
