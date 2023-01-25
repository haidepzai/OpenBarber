package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.model.Service;
import com.hdmstuttgart.mi.backend.service.ServiceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Service> createService(@RequestBody Service service, @PathVariable Long enterpriseId) {
        Service createdService = serviceService.createService(service, enterpriseId);
        return new ResponseEntity<>(createdService, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Service>> getAllServices(@PathVariable Long enterpriseId) {
        List<Service> services = serviceService.getAllServices(enterpriseId);
        return new ResponseEntity<>(services, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable long id) {
        Service service = serviceService.getServiceById(id);
        return new ResponseEntity<>(service, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(@PathVariable long id, @RequestBody Service newService) {
        Service updatedService = serviceService.updateService(id, newService);
        return new ResponseEntity<>(updatedService, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteService(@PathVariable long id) {
        serviceService.deleteService(id);
        return new ResponseEntity<>("Service deleted with id = " + id, HttpStatus.NO_CONTENT);
    }
}
