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

/**
 * The type Appointment mapper.
 */
@Component
public class AppointmentMapper {

    private final ModelMapper modelMapper;

    /**
     * Instantiates a new Appointment mapper.
     *
     * @param modelMapper the model mapper
     */
    @Autowired
    public AppointmentMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    /**
     * Appointment to dto appointment dto.
     *
     * @param appointment the appointment
     * @return the appointment dto
     */
    public AppointmentDto appointmentToDto(Appointment appointment) {
        AppointmentDto dto = modelMapper.map(appointment, AppointmentDto.class);
        if (appointment.getEmployee() != null) {
            dto.setEmployeeId(appointment.getEmployee().getId());
        }
        if (appointment.getEnterprise() != null) {
            dto.setEnterpriseId(appointment.getEnterprise().getId());
        }
        return dto;
    }

    /**
     * Appointment to dtos list.
     *
     * @param appointments the appointments
     * @return the list
     */
    public List<AppointmentDto> appointmentToDtos(List<Appointment> appointments) {
        return appointments.stream()
                .map(this::appointmentToDto)
                .collect(Collectors.toList());
    }

    /**
     * Dto to appointment appointment.
     *
     * @param appointmentDTO the appointment dto
     * @return the appointment
     */
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