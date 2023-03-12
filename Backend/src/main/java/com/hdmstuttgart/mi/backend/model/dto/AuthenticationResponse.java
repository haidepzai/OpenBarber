package com.hdmstuttgart.mi.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * The type Authentication response.
 */
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

    /**
     * Instantiates a new Authentication response.
     *
     * @param token        the token
     * @param refreshToken the refresh token
     */
    public AuthenticationResponse(String token, String refreshToken) {
    }
}