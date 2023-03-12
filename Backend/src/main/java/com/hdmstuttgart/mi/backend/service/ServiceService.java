package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.BackendApplication;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.Service;
import com.hdmstuttgart.mi.backend.repository.EnterpriseRepository;
import com.hdmstuttgart.mi.backend.repository.ServiceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * The type Service service.
 */
@org.springframework.stereotype.Service
public class ServiceService {

    private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);
    private final ServiceRepository serviceRepository;
    private final EnterpriseRepository enterpriseRepository;

    /**
     * Instantiates a new Service service.
     *
     * @param serviceRepository    the service repository
     * @param enterpriseRepository the enterprise repository
     */
    public ServiceService(ServiceRepository serviceRepository, EnterpriseRepository enterpriseRepository) {
        this.serviceRepository = serviceRepository;
        this.enterpriseRepository = enterpriseRepository;
    }

    /**
     * Create service service.
     *
     * @param service      the service
     * @param enterpriseId the enterprise id
     * @return the service
     */
    public Service createService(Service service, Long enterpriseId) {
        Enterprise enterprise = enterpriseRepository.findById(enterpriseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with id = " + enterpriseId));
        service.setEnterprise(enterprise);
        return serviceRepository.save(service);
    }

    /**
     * Gets services by enterprise id.
     *
     * @param enterpriseId the enterprise id
     * @return the services by enterprise id
     */
    public List<Service> getServicesByEnterpriseId(Long enterpriseId) {
        if (!enterpriseRepository.existsById(enterpriseId)) {
            log.warn("Enterprise not foundM");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with id = " + enterpriseId);
        }

        return serviceRepository.findAllByEnterpriseId(enterpriseId);
    }

    /**
     * Gets service by id.
     *
     * @param id the id
     * @return the service by id
     */
    public Service getServiceById(long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found with id = " + id));
    }

    /**
     * Update service service.
     *
     * @param id         the id
     * @param newService the new service
     * @return the service
     */
    public Service updateService(long id, Service newService) {
        return serviceRepository.findById(id)
                .map(service -> {
                    service.setPrice(newService.getPrice());
                    service.setTitle(newService.getTitle());
                    service.setDurationInMin(newService.getDurationInMin());
                    service.setTargetAudience(newService.getTargetAudience());

                    return serviceRepository.save(service);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found with id = " + id));
    }

    /**
     * Delete service.
     *
     * @param id the id
     */
    public void deleteService(long id) {
        if (!serviceRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found with id = " + id);
        }
        serviceRepository.deleteById(id);
    }

    /**
     * Delete service from enterprise.
     *
     * @param id           the id
     * @param enterpriseId the enterprise id
     */
    public void deleteServiceFromEnterprise(long id, long enterpriseId) {
        if (!serviceRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found with id = " + id);
        }
        List<Service> services = getServicesByEnterpriseId(enterpriseId);
        services.stream().filter(service -> id == service.getId()).findAny().ifPresent(serviceToDelete -> serviceRepository.deleteById(serviceToDelete.getId()));
    }
}
