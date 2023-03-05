package com.hdmstuttgart.mi.backend.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.enums.ServiceTargetAudience;
import lombok.Data;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class ServiceDto {

    private double price;
    private String title;
    private String description;
    private int durationInMin;
    private String targetAudience;

    /*@ManyToOne
    @JsonIgnore
    @JoinColumn(name = "enterprise_id")
    private Enterprise enterprise;*/
}
