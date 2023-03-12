package com.hdmstuttgart.mi.backend.mapper;

import com.hdmstuttgart.mi.backend.model.Appointment;
import com.hdmstuttgart.mi.backend.model.dto.AppointmentDto;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

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
        return modelMapper.map(appointment, AppointmentDto.class);
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
        return modelMapper.map(appointmentDTO, Appointment.class);
    }
}