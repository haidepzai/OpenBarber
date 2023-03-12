package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.BackendApplication;
import com.hdmstuttgart.mi.backend.mapper.AppointmentMapper;
import com.hdmstuttgart.mi.backend.model.Appointment;
import com.hdmstuttgart.mi.backend.model.dto.AppointmentDto;
import com.hdmstuttgart.mi.backend.service.AppointmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

/**
 * Controller for appointments
 */
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final AppointmentMapper appointmentMapper;
    private static final Logger log = LoggerFactory.getLogger(AppointmentController.class);

    /**
     * Instantiates a new Appointment controller.
     *
     * @param appointmentService the appointment service
     * @param appointmentMapper  the appointment mapper
     */
    public AppointmentController(AppointmentService appointmentService, AppointmentMapper appointmentMapper) {
        this.appointmentService = appointmentService;
        this.appointmentMapper = appointmentMapper;
    }

    /**
     * Create appointment response entity.
     *
     * @param appointmentDto the appointment dto
     * @param enterpriseId   the enterprise id
     * @return the response entity
     */
    @PostMapping
    public ResponseEntity<AppointmentDto> createAppointment(@Valid @RequestBody AppointmentDto appointmentDto, @RequestParam long enterpriseId) {
        log.info(appointmentDto.toString());
        Appointment appointment = appointmentMapper.dtoToAppointment(appointmentDto);
        Appointment createdAppointment = appointmentService.createAppointment(appointment, enterpriseId);
        AppointmentDto createdAppointmentDto = appointmentMapper.appointmentToDto(createdAppointment);
        return new ResponseEntity<>(createdAppointmentDto, HttpStatus.CREATED);
    }

    /**
     * Confirm appointment response entity.
     *
     * @param id               the id
     * @param confirmationCode the confirmation code
     * @return the response entity
     */
    @PutMapping("/confirmation/{id}")
    public ResponseEntity<AppointmentDto> confirmAppointment(@PathVariable long id, @RequestParam String confirmationCode) {
        Appointment appointment = appointmentService.confirmAppointment(id, confirmationCode);
        AppointmentDto appointmentDto = appointmentMapper.appointmentToDto(appointment);
        return new ResponseEntity<>(appointmentDto, HttpStatus.ACCEPTED);
    }

    /**
     * Gets appointments by enterprise id.
     *
     * @param enterpriseId the enterprise id
     * @return the appointments by enterprise id
     */
    @GetMapping
    public ResponseEntity<List<AppointmentDto>> getAppointmentsByEnterpriseId(@RequestParam Long enterpriseId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByEnterpriseId(enterpriseId);
        List<AppointmentDto> appointmentDtos = appointmentMapper.appointmentToDtos(appointments);
        return new ResponseEntity<>(appointmentDtos, HttpStatus.OK);
    }

    /**
     * Gets appointment by id.
     *
     * @param id the id
     * @return the appointment by id
     */
    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDto> getAppointmentById(@PathVariable long id) {
        Appointment appointment = appointmentService.getAppointmentById(id);
        AppointmentDto appointmentDto = appointmentMapper.appointmentToDto(appointment);
        return new ResponseEntity<>(appointmentDto, HttpStatus.OK);
    }

    /**
     * Update appointment response entity.
     *
     * @param id                the id
     * @param newAppointmentDto the new appointment dto
     * @return the response entity
     */
    @PutMapping("/{id}")
    public ResponseEntity<AppointmentDto> updateAppointment(@PathVariable long id, @Valid @RequestBody AppointmentDto newAppointmentDto) {
        Appointment newAppointment = appointmentMapper.dtoToAppointment(newAppointmentDto);
        Appointment updatedAppointment = appointmentService.updateAppointment(id, newAppointment);
        AppointmentDto updatedAppointmentDto = appointmentMapper.appointmentToDto(updatedAppointment);
        return new ResponseEntity<>(updatedAppointmentDto, HttpStatus.OK);
    }

    /**
     * Patch appointment response entity.
     *
     * @param id                the id
     * @param newAppointmentDto the new appointment dto
     * @return the response entity
     */
    @PatchMapping("/{id}")
    public ResponseEntity<AppointmentDto> patchAppointment(@PathVariable long id, @RequestBody AppointmentDto newAppointmentDto) {
        Appointment newAppointment = appointmentMapper.dtoToAppointment(newAppointmentDto);
        Appointment updatedAppointment = appointmentService.patchAppointment(id, newAppointment);
        AppointmentDto updatedAppointmentDto = appointmentMapper.appointmentToDto(updatedAppointment);
        return new ResponseEntity<>(updatedAppointmentDto, HttpStatus.OK);
    }

    /**
     * Delete appointment response entity.
     *
     * @param id               the id
     * @param confirmationCode the confirmation code
     * @return the response entity
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAppointment(@PathVariable long id, @RequestParam String confirmationCode) {
        appointmentService.deleteAppointment(id, confirmationCode);
        return new ResponseEntity<>("Appointment deleted with id = " + id, HttpStatus.NO_CONTENT);
    }
}
