package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.dto.EnterpriseRequest;
import com.hdmstuttgart.mi.backend.repository.EnterpriseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@Service
public class EnterpriseService {

    private final EnterpriseRepository enterpriseRepository;

    public EnterpriseService(EnterpriseRepository enterpriseRepository) {
        this.enterpriseRepository = enterpriseRepository;
    }

    /*public Enterprise createEnterprise(EnterpriseRequest request, MultipartFile file){
        try {
            var enterprise = Enterprise.builder()
                    .name(request.getName())
                    .eMail(request.getEMail())
                    .address(request.getAddress())
                    .file(file.getBytes())
                    .build();
            return enterpriseRepository.save(enterprise);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }*/

    public Enterprise createEnterprise(EnterpriseRequest request) {
        try {
            var enterprise = Enterprise.builder()
                .name(request.getName())
                .eMail(request.getEMail())
                .address(request.getAddress())
                .file(request.getFile().getBytes())
                .build();
            return enterpriseRepository.save(enterprise);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);
        }
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
