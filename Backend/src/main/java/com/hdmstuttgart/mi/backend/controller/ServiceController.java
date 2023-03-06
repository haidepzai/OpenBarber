package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.exception.UnauthorizedException;
import com.hdmstuttgart.mi.backend.mapper.ServiceMapper;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.Service;
import com.hdmstuttgart.mi.backend.model.dto.ServiceDto;
import com.hdmstuttgart.mi.backend.service.EnterpriseService;
import com.hdmstuttgart.mi.backend.service.JwtService;
import com.hdmstuttgart.mi.backend.service.ServiceService;
import com.hdmstuttgart.mi.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceService serviceService;
    private final UserService userService;
    private final EnterpriseService enterpriseService;
    private final ServiceMapper serviceMapper;
    private final JwtService jwtService;

    public ServiceController(ServiceService serviceService, UserService userService, EnterpriseService enterpriseService, ServiceMapper serviceMapper, JwtService jwtService) {
        this.serviceService = serviceService;
        this.userService = userService;
        this.enterpriseService = enterpriseService;
        this.serviceMapper = serviceMapper;
        this.jwtService = jwtService;
    }

    @PostMapping
    public ResponseEntity<ServiceDto> createService(
            @Valid @RequestBody ServiceDto serviceDto,
            @RequestParam Long enterpriseId,
            @RequestHeader("Authorization") String token
    ) {
        // Validate the JWT token and extract the user information
        String email = jwtService.extractUsername(token.substring(7));
        userService.getUserByEmail(email);
        // Check if the user is authorized to perform the operation based on their email
        Enterprise enterprise = enterpriseService.getEnterpriseById(enterpriseId);
        if (!email.equals(enterprise.getEmail())) {
            throw new UnauthorizedException("User is not authorized to perform this operation");
        }

        // Convert the DTO to the entity
        Service service = serviceMapper.toEntity(serviceDto);
        Service createdService = serviceService.createService(service, enterpriseId);

        // Convert the created entity to DTO and return it in the response
        ServiceDto createdServiceDto = serviceMapper.toDto(createdService);
        return new ResponseEntity<>(createdServiceDto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ServiceDto>> getServicesByEnterpriseId(@RequestParam Long enterpriseId) {
        List<ServiceDto> serviceDtos = serviceService.getServicesByEnterpriseId(enterpriseId)
                .stream()
                .map(serviceMapper::toDto)
                .collect(Collectors.toList());

        return new ResponseEntity<>(serviceDtos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceDto> getServiceById(@PathVariable long id) {
        Service service = serviceService.getServiceById(id);

        // Convert the entity to DTO and return it in the response
        ServiceDto serviceDto = serviceMapper.toDto(service);
        return new ResponseEntity<>(serviceDto, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceDto> updateService(@PathVariable long id, @Valid @RequestBody ServiceDto newServiceDto) {
        // Convert the DTO to the entity
        Service newService = serviceMapper.toEntity(newServiceDto);
        Service updatedService = serviceService.updateService(id, newService);

        // Convert the updated entity to DTO and return it in the response
        ServiceDto updatedServiceDto = serviceMapper.toDto(updatedService);
        return new ResponseEntity<>(updatedServiceDto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteService(@PathVariable long id, @RequestHeader("Authorization") String token) {
        serviceService.deleteService(id);
        return new ResponseEntity<>("Service deleted with id = " + id, HttpStatus.NO_CONTENT);
    }
}
