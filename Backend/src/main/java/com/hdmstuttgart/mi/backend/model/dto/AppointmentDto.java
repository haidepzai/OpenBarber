package com.hdmstuttgart.mi.backend.model.dto;

import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.Service;
import com.hdmstuttgart.mi.backend.model.enums.PaymentMethod;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class AppointmentDto {
    private Long id;
    private boolean reviewed;
    private String customerName;
    private String customerPhoneNumber;
    private String customerEmail;
    private LocalDateTime appointmentDateTime;
    private Set<PaymentMethod> paymentMethods;

    private boolean confirmed;

    private Long enterpriseId;
    private Employee employee;
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
                ", employee=" + employee +
                ", services=" + services +
                '}';
    }
}