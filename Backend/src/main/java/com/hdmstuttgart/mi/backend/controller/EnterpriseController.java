package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.exception.UnauthorizedException;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.model.dto.EnterpriseDto;
import com.hdmstuttgart.mi.backend.service.EnterpriseService;
import com.hdmstuttgart.mi.backend.service.JwtService;
import com.hdmstuttgart.mi.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enterprises")
public class EnterpriseController {

    private final EnterpriseService enterpriseService;
    private final UserService userService;
    private final JwtService jwtService;

    public EnterpriseController(EnterpriseService enterpriseService, UserService userService, JwtService jwtService) {
        this.enterpriseService = enterpriseService;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    /* @ModelAttribute: arguments fields == request parameters */

    @PostMapping
    public ResponseEntity<Enterprise> createEnterprise(@ModelAttribute EnterpriseDto enterpriseDto, @RequestHeader("Authorization") String token) {
        Enterprise createdEnterprise = enterpriseService.createEnterprise(enterpriseDto, token);
        return new ResponseEntity<>(createdEnterprise, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Enterprise>> getAllEnterprises() {
        List<Enterprise> enterprises = enterpriseService.getAllEnterprises();
        return new ResponseEntity<>(enterprises, HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<Enterprise> getEnterpriseByUser(@RequestHeader("Authorization") String token) {
        Enterprise enterprise = enterpriseService.getEnterpriseByUser(token);
        return new ResponseEntity<>(enterprise, HttpStatus.OK);
    }

    @GetMapping("/email")
    public ResponseEntity<Enterprise> getEnterpriseByEmail(@RequestParam String email) {
        Enterprise enterprise = enterpriseService.getEnterpriseByEmail(email);
        return new ResponseEntity<>(enterprise, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enterprise> getEnterpriseById(@PathVariable long id) {
        Enterprise enterprise = enterpriseService.getEnterpriseById(id);
        return new ResponseEntity<>(enterprise, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Enterprise> updateEnterprise(
            @PathVariable long id,
            @RequestBody EnterpriseDto newEnterprise,
            @RequestHeader("Authorization") String token
    ) {
        // Validate the JWT token and extract the user information
        String email = jwtService.extractUsername(token.substring(7));
        User user = userService.getUserByEmail(email);

        // Check if the user is authorized to perform the operation based on their email
        if (!user.getEmail().equals(newEnterprise.getEmail())) {
            throw new UnauthorizedException("User is not authorized to perform this operation");
        }

        Enterprise updatedEnterprise = enterpriseService.updateEnterprise(id, newEnterprise);
        return new ResponseEntity<>(updatedEnterprise, HttpStatus.OK);
    }

    @PatchMapping("/user")
    public ResponseEntity<Enterprise> patchEnterprise(@RequestBody Enterprise newEnterprise, @RequestHeader("Authorization") String token) {
        Enterprise updatedEnterprise = enterpriseService.patchEnterprise(newEnterprise, token);
        return new ResponseEntity<>(updatedEnterprise, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEnterprise(@PathVariable long id, @RequestHeader("Authorization") String token) {
        // Validate the JWT token and extract the user information
        String email = jwtService.extractUsername(token.substring(7));
        User user = userService.getUserByEmail(email);
        Enterprise enterprise = enterpriseService.getEnterpriseById(id);

        // Check if the user is authorized to perform the operation based on their email
        if (!user.getEmail().equals(enterprise.getEmail())) {
            throw new UnauthorizedException("User is not authorized to perform this operation");
        }

        enterpriseService.deleteEnterprise(id);
        return new ResponseEntity<>("Enterprise deleted with id = " + id, HttpStatus.NO_CONTENT);
    }
}
