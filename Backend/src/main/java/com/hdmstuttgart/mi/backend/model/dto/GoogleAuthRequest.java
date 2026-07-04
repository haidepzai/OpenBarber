package com.hdmstuttgart.mi.backend.model.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class GoogleAuthRequest {
    @NotBlank
    private String idToken;
}
