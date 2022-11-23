package com.hdmstuttgart.mi.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue
    private long id;

    @NotBlank(message = "Start time is mandatory")
    private LocalDateTime startTime;

    @NotBlank(message = "End time is mandatory")
    private LocalDateTime endTime;

    @OneToOne
    @NotBlank(message = "Employee is mandatory")
    private Employee employee;

    @OneToMany
    @NotBlank(message = "Service(s) is mandatory")
    private List<Service> services;

    @Min(1)
    @Max(5)
    private int rating;

    private String ratingText;
}
