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

import javax.validation.Valid;

@Api(value = "Authentication Controller", description = "Operations related to Authentication", tags = "Authentication")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @ApiOperation(value = "Register User", notes = "Registers a new user with the provided details")
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @ApiOperation(value = "Authenticate User", notes = "Authenticates a user and returns a JWT token")
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@Valid @RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @ApiOperation(value = "Authenticate User With Google", notes = "Authenticates a user with Google Identity Services and returns a JWT token")
    @PostMapping("/google")
    public ResponseEntity<AuthenticationResponse> googleLogin(@Valid @RequestBody GoogleAuthRequest request) {
        return ResponseEntity.ok(authenticationService.googleLogin(request.getIdToken()));
    }

    @ApiOperation(value = "Verify User", notes = "Verifies a user's token")
    @PostMapping("/verify")
    public ResponseEntity<AuthenticationResponse> verify(@Valid @RequestBody VerificationRequest request, @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(authenticationService.verify(request, token));
    }

    @ApiOperation(value = "Refresh Token", notes = "Refreshes the user's token")
    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authenticationService.refresh(request));
    }

    @ApiOperation(value = "Forgot Password", notes = "Sends a password reset email")
    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authenticationService.forgotPassword(request);
        return ResponseEntity.ok().build();
    }

    @ApiOperation(value = "Reset Password", notes = "Resets the user's password using a valid token")
    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authenticationService.resetPassword(request);
        return ResponseEntity.ok().build();
    }

    @ApiOperation(value = "Resend Verification Code", notes = "Issues a new verification code and sends it via email")
    @PostMapping("/resend-verification")
    public ResponseEntity<Void> resendVerification(@RequestHeader("Authorization") String token) {
        authenticationService.resendVerification(token);
        return ResponseEntity.ok().build();
    }

    @ApiOperation(value = "Handle User Not Found", notes = "Handles the UserNotFoundException and returns an error DTO")
    @ExceptionHandler(value = UserNotFoundException.class)
    @ResponseStatus(code = HttpStatus.NOT_FOUND)
    public ErrorDto handleNotFoundException(UserNotFoundException ex) {
        return new ErrorDto(ex.getMessage());
    }
}
