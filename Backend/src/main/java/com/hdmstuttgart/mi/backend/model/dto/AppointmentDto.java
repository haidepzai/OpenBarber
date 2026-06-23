package com.hdmstuttgart.mi.backend.model.dto;

import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.Service;
import com.hdmstuttgart.mi.backend.model.enums.AppointmentType;
import com.hdmstuttgart.mi.backend.model.enums.PaymentMethod;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * The type Appointment dto.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDto {
    private Long id;
    private boolean reviewed;
    private AppointmentType appointmentType;
    private String customerName;
    private String customerPhoneNumber;
    private String customerEmail;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private LocalDateTime appointmentDateTime;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private LocalDateTime endDateTime;
    private Set<PaymentMethod> paymentMethods;
    private UUID confirmationCode;

    private boolean confirmed;

    private Long enterpriseId;
    private Long employeeId;
    private List<Service> services;

    @Override
    public String toString() {
        return "AppointmentDto{" +
                "id=" + id +
                ", reviewed=" + reviewed +
                ", customerName='" + customerName + '\'' +
                ", customerPhoneNumber='" + customerPhoneNumber + '\'' +
                ", customerEmail='" + customerEmail + '\'' +
                ", appointmentDateTime=" + appointmentDateTime +
                ", confirmed=" + confirmed +
                ", enterpriseId=" + enterpriseId +
                ", employeeId=" + employeeId +
                ", services=" + services +
                '}';
    }
}