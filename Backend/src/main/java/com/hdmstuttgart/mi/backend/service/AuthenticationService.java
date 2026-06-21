package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.BackendApplication;
import com.hdmstuttgart.mi.backend.exception.UserAlreadyExistsException;
import com.hdmstuttgart.mi.backend.exception.UserNotFoundException;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.model.dto.*;
import com.hdmstuttgart.mi.backend.model.enums.UserRole;
import com.hdmstuttgart.mi.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.mail.MessagingException;
import java.io.IOException;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

/**
 * The type Authentication service.
 */
@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailSenderService emailSenderService;

    /**
     * Register authentication response.
     *
     * @param request the request
     * @return the authentication response
     */
    public AuthenticationResponse register(RegisterRequest request) {
        if(userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException(request.getEmail());
        }

        var user = User.builder()
//                .firstname(request.getFirstname())
//                .lastname(request.getLastname())
//                .name(request.getName())
                .email(request.getEmail())
                .confirmationCode(UUID.randomUUID().toString().substring(0, 6).toUpperCase())
                .confirmationCodeExpiry(Date.from(Instant.now().plusSeconds(15 * 60)))
                .verificationAttempts(0)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.UNVERIFIED)
                .build();
        userRepository.save(user);
        var jwtToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        try {
            emailSenderService.sendEmailWithTemplate(user.getEmail(), "verification");
        } catch (MessagingException | IOException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);
        }

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    /**
     * Authenticate authentication response.
     *
     * @param request the request
     * @return the authentication response
     */
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException(request.getEmail()));

        String jwtToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .verified(user.getRole() != UserRole.UNVERIFIED)
                .hasEnterprise(user.getEnterprise() != null)
                .userId(user.getId())
                .build();
    }

    /**
     * Verify authentication response.
     *
     * @param request the request
     * @param token   the token
     * @return the authentication response
     */
    public AuthenticationResponse verify(VerificationRequest request, String token) {
        String username = jwtService.extractUsername(token.substring(7));

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        if (user.getRole() != UserRole.UNVERIFIED) {
            log.error("Email already verified!");
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-Mail already verified");
        }
        if (user.getConfirmationCodeExpiry() == null || user.getConfirmationCodeExpiry().before(new Date())) {
            throw new ResponseStatusException(HttpStatus.GONE, "Verification code expired. Please request a new one.");
        }
        if (user.getVerificationAttempts() >= 5) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many failed attempts. Please request a new verification code.");
        }
        if (!request.getConfirmationCode().equals(user.getConfirmationCode())) {
            user.setVerificationAttempts(user.getVerificationAttempts() + 1);
            userRepository.save(user);
            log.error("wrong confirmation code! attempt {}", user.getVerificationAttempts());
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Wrong confirmation code");
        }
        user.setRole(UserRole.VERIFIED);
        user.setConfirmationCode(null);
        user.setConfirmationCodeExpiry(null);
        user.setVerificationAttempts(0);
        userRepository.save(user);

        return AuthenticationResponse.builder()
                .userId(user.getId())
                .build();
    }

    /**
     * Refresh authentication response.
     *
     * @param request the request
     * @return the authentication response
     */
    public AuthenticationResponse refresh(RefreshTokenRequest request) {
        // Get the username from the refresh token
        String username = jwtService.extractUsername(request.getRefreshToken());

        // Load the user from the database
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Validate the refresh token
        jwtService.isRefreshTokenValid(request.getRefreshToken(), user);

        // Authenticate the user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Generate new access and refresh tokens
        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(user);

        // Return the new tokens in the response
       return AuthenticationResponse.builder()
               .token(accessToken)
               .refreshToken(refreshToken)
               .build();
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        // Silently succeed even if email not found — prevents user enumeration
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setPasswordResetToken(token);
            user.setPasswordResetTokenExpiry(Date.from(Instant.now().plusSeconds(3600))); // 1 hour
            userRepository.save(user);
            try {
                emailSenderService.sendPasswordResetEmail(user.getEmail(), token);
            } catch (Exception e) {
                log.error("Failed to send password reset email to {}: {}", user.getEmail(), e.getMessage());
            }
        });
    }

    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByPasswordResetToken(request.getToken())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired reset token"));

        if (user.getPasswordResetTokenExpiry() == null || user.getPasswordResetTokenExpiry().before(new Date())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        userRepository.save(user);
    }

    public void resendVerification(String token) {
        String username = jwtService.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        if (user.getRole() != UserRole.UNVERIFIED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-Mail already verified");
        }

        user.setConfirmationCode(UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        user.setConfirmationCodeExpiry(Date.from(Instant.now().plusSeconds(15 * 60)));
        user.setVerificationAttempts(0);
        userRepository.save(user);

        try {
            emailSenderService.sendEmailWithTemplate(user.getEmail(), "verification");
        } catch (MessagingException | IOException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Failed to send verification email");
        }
    }
}
