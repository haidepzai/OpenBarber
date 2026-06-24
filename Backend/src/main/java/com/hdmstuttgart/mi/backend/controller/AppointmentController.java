package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.BackendApplication;
import com.hdmstuttgart.mi.backend.mapper.AppointmentMapper;
import com.hdmstuttgart.mi.backend.model.Appointment;
import com.hdmstuttgart.mi.backend.model.dto.AppointmentDto;
import com.hdmstuttgart.mi.backend.service.AppointmentService;
import com.hdmstuttgart.mi.backend.service.RecaptchaService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

/**
 * Controller for appointments
 */
@Api(value = "Appointment Controller", description = "Operations related to Appointments", tags = "Appointment")
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final AppointmentMapper appointmentMapper;
    private final RecaptchaService recaptchaService;
    private static final Logger log = LoggerFactory.getLogger(AppointmentController.class);

    public AppointmentController(AppointmentService appointmentService, AppointmentMapper appointmentMapper, RecaptchaService recaptchaService) {
        this.appointmentService = appointmentService;
        this.appointmentMapper = appointmentMapper;
        this.recaptchaService = recaptchaService;
    }

    /**
     * Create appointment response entity.
     *
     * @param appointmentDto the appointment dto
     * @param shopId   the shop id
     * @return the response entity
     */
    @ApiOperation(value = "Create Appointment", notes = "Creates a new appointment for the given shop ID")
    @PostMapping
    public ResponseEntity<AppointmentDto> createAppointment(@Valid @RequestBody AppointmentDto appointmentDto, @RequestParam long shopId,
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestHeader(value = "X-Recaptcha-Token", required = false) String captchaToken) {
        // For guest bookings (no auth token), require a valid reCAPTCHA
        if (token == null || token.isBlank()) {
            if (!recaptchaService.verify(captchaToken)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "reCAPTCHA verification failed");
            }
        }
        log.info(appointmentDto.toString());
        Appointment appointment = appointmentMapper.dtoToAppointment(appointmentDto);
        Appointment createdAppointment = appointmentService.createAppointment(appointment, shopId, token);
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
    @ApiOperation(value = "Confirm Appointment", notes = "Confirms an appointment by its ID and confirmation code")
    @PutMapping("/confirmation/{id}")
    public ResponseEntity<AppointmentDto> confirmAppointment(@PathVariable long id, @RequestParam String confirmationCode) {
        Appointment appointment = appointmentService.confirmAppointment(id, confirmationCode);
        AppointmentDto appointmentDto = appointmentMapper.appointmentToDto(appointment);
        return new ResponseEntity<>(appointmentDto, HttpStatus.ACCEPTED);
    }

    /**
     * Gets appointments by shop id.
     *
     * @param shopId the shop id
     * @return the appointments by shop id
     */
    @ApiOperation(value = "Get Appointments by Shop ID", notes = "Fetches all appointments for the given shop ID")
    @GetMapping
    public ResponseEntity<Page<AppointmentDto>> getAppointmentsByShopId(
            @RequestParam Long shopId,
            @PageableDefault(size = 500) Pageable pageable) {
        Page<Appointment> page = appointmentService.getAppointmentsByShopId(shopId, pageable);
        return ResponseEntity.ok(page.map(appointmentMapper::appointmentToDto));
    }

    @ApiOperation(value = "Get My Appointments", notes = "Fetches all appointments for the currently authenticated customer")
    @GetMapping("/my")
    public ResponseEntity<Page<AppointmentDto>> getMyAppointments(
            @RequestHeader("Authorization") String token,
            @PageableDefault(size = 50) Pageable pageable) {
        Page<Appointment> page = appointmentService.getMyAppointments(token, pageable);
        return ResponseEntity.ok(page.map(appointmentMapper::appointmentToDto));
    }

    /**
     * Gets appointment by id.
     *
     * @param id the id
     * @return the appointment by id
     */
    @ApiOperation(value = "Get Appointment by ID", notes = "Fetches an appointment by its ID")
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
    @ApiOperation(value = "Get Appointment by ID", notes = "Fetches an appointment by its ID")
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
    @ApiOperation(value = "Patch Appointment", notes = "Partially updates an existing appointment by its ID")
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
     * @param confirmationCode the confirmation code (optional, for customer deletion)
     * @return the response entity
     */
    @ApiOperation(value = "Delete Appointment", notes = "Deletes an appointment by its ID. Confirmation code is optional for internal use.")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAppointment(@PathVariable long id, @RequestParam(required = false) String confirmationCode) {
        appointmentService.deleteAppointment(id, confirmationCode);
        return new ResponseEntity<>("Appointment deleted with id = " + id, HttpStatus.NO_CONTENT);
    }
}
