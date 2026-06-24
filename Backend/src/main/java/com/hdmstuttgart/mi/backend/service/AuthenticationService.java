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

import javax.mail.MessagingException;
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
public class AuthenticationService {
    private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailSenderService emailSenderService;

    @Value("${google.client-id}")
    private String googleClientId;

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
                .hasShop(user.getShop() != null)
                .userId(user.getId())
                .build();
    }

    public AuthenticationResponse googleLogin(String idToken) {
        Map<String, Object> googlePayload = verifyGoogleToken(idToken);

        String email = (String) googlePayload.get("email");
        String googleId = (String) googlePayload.get("sub");
        String firstName = (String) googlePayload.getOrDefault("given_name", "");
        String lastName = (String) googlePayload.getOrDefault("family_name", "");

        if (email == null || email.isBlank() || googleId == null || googleId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google token");
        }

        Optional<User> existingByGoogleId = userRepository.findByGoogleId(googleId);
        Optional<User> existingByEmail = userRepository.findByEmail(email);

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

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthenticationResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .verified(true)
                .hasShop(user.getShop() != null)
                .build();
    }

    private Map<String, Object> verifyGoogleToken(String idToken) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            Map<String, Object> payload = response.getBody();

            if (payload == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google token");
            }

            String aud = (String) payload.get("aud");
            if (googleClientId == null || googleClientId.isBlank() || !googleClientId.equals(aud)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token not issued for this app");
            }

            Object emailVerified = payload.get("email_verified");
            if (emailVerified != null && !Boolean.parseBoolean(String.valueOf(emailVerified))) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google email is not verified");
            }

            return payload;
        } catch (HttpClientErrorException e) {
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
        UserRole newRole = (user.getShop() != null) ? UserRole.OPERATOR : UserRole.VERIFIED;
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
    public AuthenticationResponse refresh(RefreshTokenRequest request) {
        try {
            String username = jwtService.extractUsername(request.getRefreshToken());
            User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

            if (!jwtService.isRefreshTokenValid(request.getRefreshToken(), user)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token invalid or expired");
            }

            // Token is valid — no need to re-authenticate with username/password
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            return AuthenticationResponse.builder()
                    .token(accessToken)
                    .refreshToken(refreshToken)
                    .build();
        } catch (io.jsonwebtoken.JwtException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token invalid or expired");
        }
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
