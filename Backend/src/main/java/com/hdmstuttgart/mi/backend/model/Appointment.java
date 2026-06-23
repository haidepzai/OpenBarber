package com.hdmstuttgart.mi.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hdmstuttgart.mi.backend.model.enums.AppointmentType;
import com.hdmstuttgart.mi.backend.model.enums.PaymentMethod;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * The type Appointment.
 */
@Data
@Entity
@NoArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /*
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;
    */

    private boolean reviewed;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(255) default 'APPOINTMENT'")
    private AppointmentType appointmentType = AppointmentType.APPOINTMENT;

    private String customerName;

    private String customerPhoneNumber;

    private String customerEmail;

    @NotNull(message = "Appointment date-time is mandatory")
    private LocalDateTime appointmentDateTime;

    private LocalDateTime endDateTime;

    private boolean confirmed;

    @Column(unique = true)
    private UUID confirmationCode;

    @ElementCollection(targetClass = PaymentMethod.class)
    @CollectionTable(name = "appointment_payment_methods", joinColumns = @JoinColumn(name = "appointment_id"))
    @Enumerated(EnumType.STRING)
    @BatchSize(size = 50)
    private Set<PaymentMethod> paymentMethods;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "enterprise_id")
    private Enterprise enterprise;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToMany
    @JoinTable(
            name = "appointment_service",
            joinColumns = @JoinColumn(name = "appointment_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id"))
    @BatchSize(size = 50)
    private List<Service> services = new ArrayList<>();

    /**
     * Gets services.
     *
     * @return the services
     */
    public List<Service> getServices() {
        return services;
    }

    /**
     * Sets services.
     *
     * @param services the services
     */
    public void setServices(List<Service> services) {
        this.services = services;
    }

}
