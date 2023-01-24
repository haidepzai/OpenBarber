package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.Service;
import com.hdmstuttgart.mi.backend.repository.EnterpriseRepository;
import com.hdmstuttgart.mi.backend.repository.ServiceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@org.springframework.stereotype.Service
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final EnterpriseRepository enterpriseRepository;

    public ServiceService(ServiceRepository serviceRepository, EnterpriseRepository enterpriseRepository) {
        this.serviceRepository = serviceRepository;
        this.enterpriseRepository = enterpriseRepository;
    }

    public Service createService(Service service, Long enterpriseId) {
        Enterprise enterprise = enterpriseRepository.findById(enterpriseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with id = " + enterpriseId));
        service.setEnterprise(enterprise);
        return serviceRepository.save(service);
    }

    public List<Service> getAllServices(Long enterpriseId) {
        return serviceRepository.findAllByEnterpriseId(enterpriseId);
    }

    public Service getServiceById(long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found with id = " + id));
    }

    public Service updateService(long id, Service newService) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found with id = " + id));

        if (newService.getPrice() > 0) {
            service.setPrice(newService.getPrice());
        }
        if (newService.getTitle() != null && !newService.getTitle().isBlank()) {
            service.setTitle(newService.getTitle());
        }
        if (newService.getDescription() != null) {
            service.setDescription(newService.getDescription());
        }
        if (newService.getDurationInMin() > 0) {
            service.setDurationInMin(newService.getDurationInMin());
        }
        if (newService.getTargetAudience() != null) {
            service.setTargetAudience(newService.getTargetAudience());
        }
        return serviceRepository.save(service);
    }

    public boolean deleteService(long id) {
        boolean wasDeleted = serviceRepository.existsById(id);
        if (wasDeleted) {
            serviceRepository.deleteById(id);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found with id = " + id);
        }
        return wasDeleted;
    }
}
