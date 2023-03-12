package com.hdmstuttgart.mi.backend.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.enums.ServiceTargetAudience;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * The type Service dto.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDto {

    private double price;
    private String title;
    private String description;
    private int durationInMin;
    private ServiceTargetAudience targetAudience;
    private Long enterpriseId;

    /*@ManyToOne
    @JsonIgnore
    @JoinColumn(name = "enterprise_id")
    private Enterprise enterprise;*/
}
