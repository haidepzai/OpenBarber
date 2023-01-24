package com.hdmstuttgart.mi.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotBlank;

@Data
@Entity
@NoArgsConstructor
public class Service {

    @Id
    @GeneratedValue
    private long id;

    @NotBlank(message = "Price is mandatory")
    private double price;

    @NotBlank(message = "Title is mandatory")
    private String title;

    private String description;

    @NotBlank(message = "Duration is mandatory")
    private int durationInMin;

    private ServiceTargetAudience targetAudience;

    @JsonIgnore
    @ManyToOne
    private Enterprise enterprise;
}
