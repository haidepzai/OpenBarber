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
                .confirmationCode(UUID.randomUUID().toString().substring(0,6).toUpperCase())
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
        if (!request.getConfirmationCode().equals(user.getConfirmationCode())) {
            log.error("wrong confirmation code!");
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Wrong confirmation code");
        }
        user.setRole(UserRole.VERIFIED);
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
}
