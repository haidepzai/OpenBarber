package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.BackendApplication;
import com.hdmstuttgart.mi.backend.exception.UserNotFoundException;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.model.dto.AuthenticationRequest;
import com.hdmstuttgart.mi.backend.model.dto.AuthenticationResponse;
import com.hdmstuttgart.mi.backend.model.dto.RegisterRequest;
import com.hdmstuttgart.mi.backend.model.dto.VerificationRequest;
import com.hdmstuttgart.mi.backend.model.enums.UserRole;
import com.hdmstuttgart.mi.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.mail.MessagingException;
import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailSenderService emailSenderService;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
//                .firstname(request.getFirstname())
//                .lastname(request.getLastname())
                .name(request.getName())
                .email(request.getEmail())
                .confirmationCode(UUID.randomUUID().toString().substring(0,6).toUpperCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.UNVERIFIED)
                .build();
        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);

        try {
            emailSenderService.sendEmailWithTemplate(user.getEmail(), "verification");
        } catch (MessagingException | IOException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);
        }

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException(request.getEmail()));

        String jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .verified(user.getRole() != UserRole.UNVERIFIED)
                .hasEnterprise(user.getEnterprise() != null)
                .build();
    }

    public void verify(VerificationRequest request, String token) {
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
    }
}
