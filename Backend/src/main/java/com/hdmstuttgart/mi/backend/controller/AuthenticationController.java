package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.model.dto.AuthenticationRequest;
import com.hdmstuttgart.mi.backend.model.dto.AuthenticationResponse;
import com.hdmstuttgart.mi.backend.model.dto.RegisterRequest;
import com.hdmstuttgart.mi.backend.model.dto.VerificationRequest;
import com.hdmstuttgart.mi.backend.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for authentication - mostly post mapping.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @PostMapping("/verify")
    public ResponseEntity verify(@RequestBody VerificationRequest request, @RequestHeader("Authorization") String token) {
        authenticationService.verify(request, token);
        return ResponseEntity.ok().body("E-mail verified successfully");
    }
}
