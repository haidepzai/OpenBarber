package com.hdmstuttgart.mi.backend.mapper;

import com.hdmstuttgart.mi.backend.model.Appointment;
import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.Service;
import com.hdmstuttgart.mi.backend.model.dto.AppointmentDto;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class AppointmentMapper {

    private final ModelMapper modelMapper;

    @Autowired
    public AppointmentMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public AppointmentDto appointmentToDto(Appointment appointment) {
        AppointmentDto dto = new AppointmentDto();
        dto.setId(appointment.getId());
        dto.setReviewed(appointment.isReviewed());
        dto.setAppointmentType(appointment.getAppointmentType());
        dto.setCustomerName(appointment.getCustomerName());
        dto.setCustomerPhoneNumber(appointment.getCustomerPhoneNumber());
        dto.setCustomerEmail(appointment.getCustomerEmail());
        dto.setAppointmentDateTime(appointment.getAppointmentDateTime());
        dto.setEndDateTime(appointment.getEndDateTime());
        dto.setPaymentMethods(appointment.getPaymentMethods());
        dto.setConfirmationCode(appointment.getConfirmationCode());
        dto.setConfirmed(appointment.isConfirmed());
        dto.setServices(appointment.getServices());
        if (appointment.getEmployee() != null) {
            dto.setEmployeeId(appointment.getEmployee().getId());
            dto.setEmployeeName(appointment.getEmployee().getName());
        }
        if (appointment.getEnterprise() != null) {
            dto.setEnterpriseId(appointment.getEnterprise().getId());
            dto.setEnterpriseName(appointment.getEnterprise().getName());
        }
        if (appointment.getCustomer() != null) {
            dto.setCustomerId(appointment.getCustomer().getId());
        }
        return dto;
    }

    public List<AppointmentDto> appointmentToDtos(List<Appointment> appointments) {
        return appointments.stream()
                .map(this::appointmentToDto)
                .collect(Collectors.toList());
    }

    public Appointment dtoToAppointment(AppointmentDto appointmentDTO) {
        Appointment appointment = modelMapper.map(appointmentDTO, Appointment.class);

        if (appointmentDTO.getEmployeeId() != null) {
            Employee employee = new Employee();
            employee.setId(appointmentDTO.getEmployeeId());
            appointment.setEmployee(employee);
        }

        if (appointmentDTO.getEnterpriseId() != null) {
            Enterprise enterprise = new Enterprise();
            enterprise.setId(appointmentDTO.getEnterpriseId());
            appointment.setEnterprise(enterprise);
        }

        if (appointmentDTO.getServices() != null) {
            List<Service> services = new ArrayList<>();
            for (Service serviceDto : appointmentDTO.getServices()) {
                Service service = new Service();
                service.setId(serviceDto.getId());
                services.add(service);
            }
            appointment.setServices(services);
        }

        return appointment;
    }
}
