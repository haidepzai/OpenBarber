package com.hdmstuttgart.mi.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {

    private String token;
    private String refreshToken;
    private boolean verified;
    private boolean hasEnterprise;
    private long userId;

    public AuthenticationResponse(String token, String refreshToken) {
    }
}