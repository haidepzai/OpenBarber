package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.dto.AuthenticationRequest;
import com.hdmstuttgart.mi.backend.model.dto.AuthenticationResponse;
import com.hdmstuttgart.mi.backend.model.dto.ForgotPasswordRequest;
import com.hdmstuttgart.mi.backend.model.dto.RefreshTokenRequest;
import com.hdmstuttgart.mi.backend.model.dto.RegisterRequest;
import com.hdmstuttgart.mi.backend.model.dto.ResetPasswordRequest;
import com.hdmstuttgart.mi.backend.model.dto.VerificationRequest;

public interface IAuthenticationService {
    AuthenticationResponse register(RegisterRequest request);

    AuthenticationResponse authenticate(AuthenticationRequest request);

    AuthenticationResponse googleLogin(String idToken);

    AuthenticationResponse verify(VerificationRequest request, String token);

    AuthenticationResponse refresh(RefreshTokenRequest request);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    void resendVerification(String token);
}
