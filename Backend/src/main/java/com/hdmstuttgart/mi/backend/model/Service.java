package com.hdmstuttgart.mi.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hdmstuttgart.mi.backend.model.enums.ServiceTargetAudience;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull(message = "Price is mandatory")
    private double price;

    @NotBlank(message = "Title is mandatory")
    @Column(nullable = false)
    private String title;

    @NotNull(message = "Duration is mandatory")
    private int durationInMin;

    private ServiceTargetAudience targetAudience;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "enterprise_id")
    private Enterprise enterprise;

    @ManyToMany(mappedBy = "services")
    @JsonIgnore
    private List<Appointment> appointments;
}
