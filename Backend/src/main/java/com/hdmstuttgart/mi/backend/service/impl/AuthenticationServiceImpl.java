package com.hdmstuttgart.mi.backend.service.impl;

import com.hdmstuttgart.mi.backend.BackendApplication;
import com.hdmstuttgart.mi.backend.exception.UserAlreadyExistsException;
import com.hdmstuttgart.mi.backend.exception.UserNotFoundException;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.model.dto.*;
import com.hdmstuttgart.mi.backend.model.enums.UserRole;
import com.hdmstuttgart.mi.backend.repository.UserRepository;
import com.hdmstuttgart.mi.backend.service.IAuthenticationService;
import com.hdmstuttgart.mi.backend.service.IEmailSenderService;
import com.hdmstuttgart.mi.backend.service.IJwtService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;


import java.io.IOException;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * The type Authentication service.
 */
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements IAuthenticationService {
    private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final IJwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final IEmailSenderService emailSenderService;

    @Value("${google.client-id}")
    private String googleClientId;

    /**
     * Register authentication response.
     *
     * @param request the request
     * @return the authentication response
     */
    public AuthenticationResponse register(final RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException(request.getEmail());
        }

        final var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .confirmationCode(UUID.randomUUID().toString().substring(0, 6).toUpperCase())
                .confirmationCodeExpiry(Date.from(Instant.now().plusSeconds(15 * 60)))
                .verificationAttempts(0)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.UNVERIFIED)
                .build();
        userRepository.save(user);
        final var jwtToken = jwtService.generateAccessToken(user);
        final String refreshToken = jwtService.generateRefreshToken(user);

        try {
            emailSenderService.sendEmailWithTemplate(user.getEmail(), "verification");
        } catch (final IOException e) {
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
    public AuthenticationResponse authenticate(final AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        final User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException(request.getEmail()));

        final String jwtToken = jwtService.generateAccessToken(user);
        final String refreshToken = jwtService.generateRefreshToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .verified(user.getRole() != UserRole.UNVERIFIED)
                .hasShop(user.getShop() != null)
                .userId(user.getId())
                .build();
    }

    public AuthenticationResponse googleLogin(final String idToken) {
        final Map<String, Object> googlePayload = verifyGoogleToken(idToken);

        final String email = (String) googlePayload.get("email");
        final String googleId = (String) googlePayload.get("sub");
        final String firstName = (String) googlePayload.getOrDefault("given_name", "");
        final String lastName = (String) googlePayload.getOrDefault("family_name", "");

        if (email == null || email.isBlank() || googleId == null || googleId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google token");
        }

        final Optional<User> existingByGoogleId = userRepository.findByGoogleId(googleId);
        final Optional<User> existingByEmail = userRepository.findByEmail(email);

        User user;
        if (existingByGoogleId.isPresent()) {
            user = existingByGoogleId.get();
        } else if (existingByEmail.isPresent()) {
            user = existingByEmail.get();
            user.setGoogleId(googleId);
        } else {
            user = User.builder()
                    .email(email)
                    .firstName(firstName)
                    .lastName(lastName)
                    .googleId(googleId)
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .role(UserRole.VERIFIED)
                    .build();
        }

        if (user.getRole() == UserRole.UNVERIFIED) {
            user.setRole(user.getShop() != null ? UserRole.OPERATOR : UserRole.VERIFIED);
            user.setConfirmationCode(null);
            user.setConfirmationCodeExpiry(null);
            user.setVerificationAttempts(0);
        }

        if ((user.getFirstName() == null || user.getFirstName().isBlank()) && !firstName.isBlank()) {
            user.setFirstName(firstName);
        }
        if ((user.getLastName() == null || user.getLastName().isBlank()) && !lastName.isBlank()) {
            user.setLastName(lastName);
        }

        user = userRepository.save(user);

        final String accessToken = jwtService.generateAccessToken(user);
        final String refreshToken = jwtService.generateRefreshToken(user);

        return AuthenticationResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .verified(true)
                .hasShop(user.getShop() != null)
                .build();
    }

    private Map<String, Object> verifyGoogleToken(final String idToken) {
        try {
            final RestTemplate restTemplate = new RestTemplate();
            final String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
            final ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            final Map<String, Object> payload = response.getBody();

            if (payload == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google token");
            }

            final String aud = (String) payload.get("aud");
            if (googleClientId == null || googleClientId.isBlank() || !googleClientId.equals(aud)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token not issued for this app");
            }

            final Object emailVerified = payload.get("email_verified");
            if (emailVerified != null && !Boolean.parseBoolean(String.valueOf(emailVerified))) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google email is not verified");
            }

            return payload;
        } catch (final HttpClientErrorException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google token");
        }
    }

    /**
     * Verify authentication response.
     *
     * @param request the request
     * @param token   the token
     * @return the authentication response
     */
    public AuthenticationResponse verify(final VerificationRequest request, final String token) {
        final String username = jwtService.extractUsername(token.substring(7));

        final User user = userRepository.findByEmail(username)
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
        final UserRole newRole = (user.getShop() != null) ? UserRole.OPERATOR : UserRole.VERIFIED;
        user.setRole(newRole);
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
    public AuthenticationResponse refresh(final RefreshTokenRequest request) {
        try {
            final String username = jwtService.extractUsername(request.getRefreshToken());
            final User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

            if (!jwtService.isRefreshTokenValid(request.getRefreshToken(), user)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token invalid or expired");
            }

            // Token is valid — no need to re-authenticate with username/password
            final String accessToken = jwtService.generateAccessToken(user);
            final String refreshToken = jwtService.generateRefreshToken(user);

            return AuthenticationResponse.builder()
                    .token(accessToken)
                    .refreshToken(refreshToken)
                    .build();
        } catch (final io.jsonwebtoken.JwtException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token invalid or expired");
        }
    }

    public void forgotPassword(final ForgotPasswordRequest request) {
        // Silently succeed even if email not found — prevents user enumeration
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            final String token = UUID.randomUUID().toString();
            user.setPasswordResetToken(token);
            user.setPasswordResetTokenExpiry(Date.from(Instant.now().plusSeconds(3600))); // 1 hour
            userRepository.save(user);
            try {
                emailSenderService.sendPasswordResetEmail(user.getEmail(), token);
            } catch (final Exception e) {
                log.error("Failed to send password reset email to {}: {}", user.getEmail(), e.getMessage());
            }
        });
    }

    public void resetPassword(final ResetPasswordRequest request) {
        final User user = userRepository.findByPasswordResetToken(request.getToken())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired reset token"));

        if (user.getPasswordResetTokenExpiry() == null || user.getPasswordResetTokenExpiry().before(new Date())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        userRepository.save(user);
    }

    public void resendVerification(final String token) {
        final String username = jwtService.extractUsername(token.substring(7));
        final User user = userRepository.findByEmail(username)
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
        } catch (final IOException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Failed to send verification email");
        }
    }
}
