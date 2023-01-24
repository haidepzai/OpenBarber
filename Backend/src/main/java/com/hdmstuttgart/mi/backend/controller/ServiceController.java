package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.model.Service;
import com.hdmstuttgart.mi.backend.service.ServiceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enterprises/{enterpriseId}/services")
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @PostMapping
    public Service createService(@RequestBody Service service, @PathVariable Long enterpriseId) {
        return serviceService.createService(service, enterpriseId);
    }

    @GetMapping
    public List<Service> getAllServices(@PathVariable Long enterpriseId) {
        return serviceService.getAllServices(enterpriseId);
    }

    @GetMapping("/{id}")
    public Service getServiceById(@PathVariable long id) {
        return serviceService.getServiceById(id);
    }

    @PutMapping("/{id}")
    public Service updateService(@PathVariable long id, @RequestBody Service newService) {
        return serviceService.updateService(id, newService);
    }

    @DeleteMapping("/{id}")
    public void deleteService(@PathVariable long id) {
        serviceService.deleteService(id);
    }
}
