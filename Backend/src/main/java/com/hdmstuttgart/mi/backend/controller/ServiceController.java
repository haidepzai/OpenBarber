package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.exception.UnauthorizedException;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.Service;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.service.EnterpriseService;
import com.hdmstuttgart.mi.backend.service.JwtService;
import com.hdmstuttgart.mi.backend.service.ServiceService;
import com.hdmstuttgart.mi.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceService serviceService;
    private final UserService userService;
    private final EnterpriseService enterpriseService;

    public ServiceController(ServiceService serviceService, UserService userService, EnterpriseService enterpriseService) {
        this.serviceService = serviceService;
        this.userService = userService;
        this.enterpriseService = enterpriseService;
    }

    @PostMapping
    public ResponseEntity<Service> createService(
            @Valid
            @RequestBody Service service,
            @RequestParam Long enterpriseId,
            @RequestHeader("Authorization") String token
    ) {

        // Validate the JWT token and extract the user information
        String email = JwtService.verifyTokenAndGetEmail(token);
        User user = userService.getUserByEmail(email);
        Enterprise enterprise = enterpriseService.getEnterpriseById(enterpriseId);

        // Check if the user is authorized to perform the operation based on their email
        if (!user.getEmail().equals(enterprise.getEmail())) {
            throw new UnauthorizedException("User is not authorized to perform this operation");
        }

        Service createdService = serviceService.createService(service, enterpriseId);
        return new ResponseEntity<>(createdService, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Service>> getServicesByEnterpriseId(@RequestParam Long enterpriseId) {
        List<Service> services = serviceService.getServicesByEnterpriseId(enterpriseId);
        return new ResponseEntity<>(services, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable long id) {
        Service service = serviceService.getServiceById(id);
        return new ResponseEntity<>(service, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(@PathVariable long id, @Valid @RequestBody Service newService) {
        Service updatedService = serviceService.updateService(id, newService);
        return new ResponseEntity<>(updatedService, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteService(@PathVariable long id) {
        serviceService.deleteService(id);
        return new ResponseEntity<>("Service deleted with id = " + id, HttpStatus.NO_CONTENT);
    }
}
