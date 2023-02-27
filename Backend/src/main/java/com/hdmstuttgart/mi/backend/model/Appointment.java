package com.hdmstuttgart.mi.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import javax.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue
    private Long id;


    @NotBlank(message = "Customer name is mandatory")
    private String customerName;

    @NotBlank(message = "Customer phone number is mandatory")
    private String customerPhoneNumber;

    @NotBlank(message = "Customer email is mandatory")
    @Email
    private String customerEmail;

    @NotNull(message = "Appointment date-time is mandatory")
    private LocalDateTime appointmentDateTime;

    private boolean confirmed;

/*    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private int rating;

    @Size(max = 500, message = "Rating Text should not exceed 500 characters")
    private String ratingText;*/

    @ManyToMany
    private List<Service> services;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "enterprise_id")
    private Enterprise enterprise;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "employee_id")
    private Employee employee;
/*    public int getTotalDuration(){
        int totalDuration = 0;
        for(Service service : services)
            totalDuration += service.getDurationInMin();
        return totalDuration;
    }*/
}
