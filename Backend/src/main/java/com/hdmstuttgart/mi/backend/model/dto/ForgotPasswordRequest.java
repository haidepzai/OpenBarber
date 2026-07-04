package com.hdmstuttgart.mi.backend.model.dto;

import lombok.Data;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Data
public class ForgotPasswordRequest {

    @NotBlank
    @Email
    private String email;
}
