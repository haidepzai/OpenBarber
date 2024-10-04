package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.exception.UserNotFoundException;
import com.hdmstuttgart.mi.backend.model.dto.*;
import com.hdmstuttgart.mi.backend.service.AuthenticationService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for authentication - mostly post mapping.
 */
@Api(value = "Authentication Controller", description = "Operations related to Authentication", tags = "Authentication")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    /**
     * Register response entity.
     *
     * @param request the request
     * @return the response entity
     */
    @ApiOperation(value = "Register User", notes = "Registers a new user with the provided details")
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    /**
     * Authenticate response entity.
     *
     * @param request the request
     * @return the response entity
     */
    @ApiOperation(value = "Authenticate User", notes = "Authenticates a user and returns a JWT token")
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    /**
     * Verify response entity.
     *
     * @param request the request
     * @param token   the token
     * @return the response entity
     */
    @ApiOperation(value = "Verify User", notes = "Verifies a user's token")
    @PostMapping("/verify")
    public ResponseEntity<AuthenticationResponse> verify(@RequestBody VerificationRequest request, @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(authenticationService.verify(request, token));
    }

    /**
     * Refresh response entity.
     *
     * @param request the request
     * @return the response entity
     */
    @ApiOperation(value = "Refresh Token", notes = "Refreshes the user's token")
    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refresh(@RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authenticationService.refresh(request));
    }

    /**
     * Handle not found exception error dto.
     *
     * @param ex the ex
     * @return the error dto
     */
    @ApiOperation(value = "Handle User Not Found", notes = "Handles the UserNotFoundException and returns an error DTO")
    @ExceptionHandler(value = UserNotFoundException.class)
    @ResponseStatus(code = HttpStatus.NOT_FOUND)
    public ErrorDto handleNotFoundException(UserNotFoundException ex) {
        return new ErrorDto(ex.getMessage());
    }
}
