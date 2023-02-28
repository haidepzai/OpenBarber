package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.model.Appointment;
import com.hdmstuttgart.mi.backend.service.AppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

/**
 * Controller for appointments
 */
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@Valid @RequestBody Appointment appointment, @RequestParam long enterpriseId, @RequestParam long employeeId, @RequestParam List<Long> serviceIds) {
        Appointment createdAppointment = appointmentService.createAppointment(appointment, enterpriseId, employeeId, serviceIds);
        return new ResponseEntity<>(createdAppointment, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAppointmentsByEnterpriseId(@RequestParam Long enterpriseId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByEnterpriseId(enterpriseId);
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable long id) {
        Appointment appointment = appointmentService.getAppointmentById(id);
        return new ResponseEntity<>(appointment, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable long id, @Valid @RequestBody Appointment newAppointment) {
        Appointment updatedAppointment = appointmentService.updateAppointment(id, newAppointment);
        return new ResponseEntity<>(updatedAppointment, HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Appointment> patchAppointment(@PathVariable long id, @RequestBody Appointment newAppointment) {
        Appointment updatedAppointment = appointmentService.patchAppointment(id, newAppointment);
        return new ResponseEntity<>(updatedAppointment, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAppointment(@PathVariable long id) {
        appointmentService.deleteAppointment(id);
        return new ResponseEntity<>("Employee deleted with id = " + id, HttpStatus.NO_CONTENT);
    }
}
