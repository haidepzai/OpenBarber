package com.hdmstuttgart.mi.backend.mapper;

import com.hdmstuttgart.mi.backend.model.Appointment;
import com.hdmstuttgart.mi.backend.model.dto.AppointmentDto;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

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
        return modelMapper.map(appointment, AppointmentDto.class);
    }

    public List<AppointmentDto> appointmentToDtos(List<Appointment> appointments) {
        return appointments.stream()
                .map(this::appointmentToDto)
                .collect(Collectors.toList());
    }

    public Appointment dtoToAppointment(AppointmentDto appointmentDTO) {
        return modelMapper.map(appointmentDTO, Appointment.class);
    }
}