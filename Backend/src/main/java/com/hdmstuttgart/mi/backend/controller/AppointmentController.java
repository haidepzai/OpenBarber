package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.model.Appointment;
import com.hdmstuttgart.mi.backend.service.AppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment, @RequestParam long enterpriseId, @RequestParam long employeeId, @RequestParam List<Long> servicesId) {
        Appointment createdAppointment = appointmentService.createAppointment(appointment, enterpriseId, employeeId, servicesId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAppointment);
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        if (appointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(appointments);
        }
    }

    @GetMapping("/{id}")
    public Appointment getAppointmentById(@PathVariable long id) {
        return appointmentService.getAppointmentById(id);
    }

    @PutMapping("/{id}")
    public Appointment updateAppointment(@PathVariable long id, @RequestBody Appointment newAppointment) {
        return appointmentService.updateAppointment(id, newAppointment);
    }

    @DeleteMapping("/{id}")
    public void deleteAppointment(@PathVariable long id) {
        appointmentService.deleteAppointment(id);
    }
}
