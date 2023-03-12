package com.hdmstuttgart.mi.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * The type Verification request.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class VerificationRequest {

    private String confirmationCode;
}
