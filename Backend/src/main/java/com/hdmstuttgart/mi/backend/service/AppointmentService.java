package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.BackendApplication;
import com.hdmstuttgart.mi.backend.model.Appointment;
import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.Service;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.model.dto.SlotDto;
import com.hdmstuttgart.mi.backend.model.enums.AppointmentType;
import com.hdmstuttgart.mi.backend.repository.AppointmentRepository;
import com.hdmstuttgart.mi.backend.repository.EmployeeRepository;
import com.hdmstuttgart.mi.backend.repository.EnterpriseRepository;
import com.hdmstuttgart.mi.backend.repository.ServiceRepository;
import com.hdmstuttgart.mi.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

import javax.mail.MessagingException;
import java.io.IOException;

import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * The type Appointment service.
 */
@org.springframework.stereotype.Service
public class AppointmentService {

    private static final Logger log = LoggerFactory.getLogger(AppointmentService.class);

    private final AppointmentRepository appointmentRepository;
    private final EnterpriseRepository enterpriseRepository;
    private final EmployeeRepository employeeRepository;
    private final ServiceRepository serviceRepository;
    private final EmailSenderService emailSenderService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AppointmentService(AppointmentRepository appointmentRepository, EnterpriseRepository enterpriseRepository, EmployeeRepository employeeRepository, ServiceRepository serviceRepository, EmailSenderService emailSenderService, JwtService jwtService, UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.enterpriseRepository = enterpriseRepository;
        this.employeeRepository = employeeRepository;
        this.serviceRepository = serviceRepository;
        this.emailSenderService = emailSenderService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    /**
     * Create appointment appointment.
     *
     * @param appointment  the appointment
     * @param enterpriseId the enterprise id
     * @return the appointment
     */
    public Appointment createAppointment(Appointment appointment, long enterpriseId, String token) {
        Enterprise enterprise = enterpriseRepository.findById(enterpriseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found enterprise with id = " + enterpriseId));

        boolean isVacation = AppointmentType.VACATION.equals(appointment.getAppointmentType());

        List<Service> services;
        Employee employee;

        if (isVacation) {
            services = List.of();
            // For vacation, employee is optional; if specified, assign it
            if (appointment.getEmployee() != null && appointment.getEmployee().getId() != null) {
                employee = employeeRepository.findById(appointment.getEmployee().getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));
            } else {
                employee = null;
            }
            appointment.setConfirmed(true); // vacations are auto-confirmed
        } else {
            services = resolveServices(appointment.getServices(), enterprise);
            if (services.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one service is mandatory");
            }
            if (appointment.getEmployee() == null || appointment.getEmployee().getId() == null) {
                employee = findAvailableEmployee(enterprise, appointment.getAppointmentDateTime(), services);
            } else {
                long employeeId = appointment.getEmployee().getId();
                employee = employeeRepository.findById(employeeId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found employee with id = " + employeeId));
                checkTimeCollision(employeeId, appointment.getAppointmentDateTime(), services);
            }
        }

        appointment.setEnterprise(enterprise);
        appointment.setEmployee(employee);
        appointment.setServices(services);
        appointment.setConfirmationCode(UUID.randomUUID());

        // Link to customer account only for non-operator users
        if (token != null && token.startsWith("Bearer ")) {
            try {
                String username = jwtService.extractUsername(token.substring(7));
                Appointment finalAppointment = appointment;
                userRepository.findByEmail(username).ifPresent(user -> {
                    if (user.getEnterprise() == null) { // only link if not an enterprise operator
                        finalAppointment.setCustomer(user);
                        finalAppointment.setConfirmed(true); // customer email verified at signup → auto-confirm
                    }
                });
            } catch (Exception ignored) {
                // Not a valid token – proceed without linking
            }
        }

        // Calculate and persist endDateTime if not explicitly set
        if (appointment.getEndDateTime() == null && appointment.getAppointmentDateTime() != null) {
            int totalDuration = services.stream().mapToInt(Service::getDurationInMin).sum();
            if (totalDuration == 0) totalDuration = 60; // default 1h for vacation/no services
            appointment.setEndDateTime(appointment.getAppointmentDateTime().plusMinutes(totalDuration));
        }

        appointment = appointmentRepository.save(appointment);

        if (!isVacation && appointment.getCustomerEmail() != null) {
            try {
                emailSenderService.sendEmailWithTemplate(appointment, "appointment", appointment.getCustomerEmail());
            } catch (MessagingException | IOException e) {
                log.error("Failed to send appointment confirmation email for appointment {}", appointment.getId(), e);
            }
        }
        return appointment;
    }

    private Employee findAvailableEmployee(Enterprise enterprise, LocalDateTime startTime, List<Service> services) {
        List<Employee> employees = enterprise.getEmployees();
        if (employees == null || employees.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No employees available for this enterprise");
        }
        int totalDuration = services.stream().mapToInt(Service::getDurationInMin).sum();
        for (Employee emp : employees) {
            try {
                checkTimeCollision(emp.getId(), startTime, services);
                return emp;
            } catch (ResponseStatusException ignored) {
                // Employee not available, try next
            }
        }
        throw new ResponseStatusException(HttpStatus.CONFLICT, "No employee is available at the selected time");
    }

    @Transactional(readOnly = true)
    public List<SlotDto> getAvailableSlots(Long enterpriseId, Long employeeId, LocalDate date, int serviceDurationMin) {
        Enterprise enterprise = enterpriseRepository.findById(enterpriseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found"));

        int openMinutes = parseTimeToMinutes(enterprise.getOpeningTime(), 8 * 60);
        int closeMinutes = parseTimeToMinutes(enterprise.getClosingTime(), 20 * 60);

        List<String> allSlots = new ArrayList<>();
        int cur = openMinutes;
        while (cur + serviceDurationMin <= closeMinutes) {
            allSlots.add(String.format("%02d:%02d", cur / 60, cur % 60));
            cur += 15;
        }

        List<Employee> employees;
        if (employeeId != null && employeeId > 0) {
            employees = List.of(employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found")));
        } else {
            employees = employeeRepository.findAllByEnterpriseId(enterpriseId);
        }

        if (employees.isEmpty()) return allSlots.stream()
                .map(t -> new SlotDto(t, null, null, null))
                .collect(Collectors.toList());

        LocalDateTime dayStart = date.atStartOfDay();
        LocalDateTime dayEnd = date.atTime(23, 59, 59);

        Map<Long, List<Appointment>> appointmentsByEmployee = employees.stream()
                .collect(Collectors.toMap(
                        Employee::getId,
                        emp -> appointmentRepository.findByEmployeeIdAndAppointmentDateTimeBetween(emp.getId(), dayStart, dayEnd)
                ));

        List<SlotDto> result = new ArrayList<>();
        for (String slot : allSlots) {
            String[] parts = slot.split(":");
            LocalDateTime slotStart = LocalDateTime.of(date, LocalTime.of(Integer.parseInt(parts[0]), Integer.parseInt(parts[1])));
            LocalDateTime slotEnd = slotStart.plusMinutes(serviceDurationMin);

            for (Employee emp : employees) {
                List<Appointment> dayAppointments = appointmentsByEmployee.get(emp.getId());
                boolean hasConflict = dayAppointments.stream().anyMatch(existing -> {
                    LocalDateTime existingEnd;
                    if (existing.getEndDateTime() != null) {
                        existingEnd = existing.getEndDateTime();
                    } else {
                        int dur = existing.getServices().stream().mapToInt(Service::getDurationInMin).sum();
                        if (dur == 0) dur = 60;
                        existingEnd = existing.getAppointmentDateTime().plusMinutes(dur);
                    }
                    return slotStart.isBefore(existingEnd) && slotEnd.isAfter(existing.getAppointmentDateTime());
                });
                if (!hasConflict) {
                    result.add(new SlotDto(slot, emp.getId(), emp.getName(), emp.getPicture()));
                    break; // first available employee per slot
                }
            }
        }
        return result;
    }

    private int parseTimeToMinutes(String timeStr, int defaultMinutes) {
        if (timeStr == null || timeStr.isBlank()) return defaultMinutes;
        try {
            if (timeStr.contains("T")) {
                // ISO UTC string (e.g. "2023-01-01T07:00:00.293Z") — convert to local time
                String normalized = timeStr.replaceAll("\\.\\d+Z$", "Z");
                if (!normalized.endsWith("Z")) normalized += "Z";
                LocalTime localTime = Instant.parse(normalized).atZone(ZoneId.systemDefault()).toLocalTime();
                return localTime.getHour() * 60 + localTime.getMinute();
            }
            // Simple "HH:mm" format
            String[] parts = timeStr.split(":");
            return Integer.parseInt(parts[0]) * 60 + Integer.parseInt(parts[1]);
        } catch (Exception e) {
            return defaultMinutes;
        }
    }

    /**
     * Check if the employee has any time collision with existing appointments.
     *
     * @param employeeId the employee id
     * @param startTime the appointment start time
     * @param services the services booked (to calculate total duration)
     * @throws ResponseStatusException if a time collision is detected
     */
    private void checkTimeCollision(Long employeeId, LocalDateTime startTime, List<Service> services) {
        int totalDurationMin = services.stream()
                .mapToInt(Service::getDurationInMin)
                .sum();
        LocalDateTime endTime = startTime.plusMinutes(totalDurationMin);

        List<Appointment> confirmedAppointments = appointmentRepository.findByEmployeeIdAndConfirmedTrue(employeeId);

        for (Appointment existing : confirmedAppointments) {
            int existingDurationMin = existing.getServices().stream()
                    .mapToInt(Service::getDurationInMin)
                    .sum();
            LocalDateTime existingEndTime = existing.getAppointmentDateTime().plusMinutes(existingDurationMin);

            if (startTime.isBefore(existingEndTime) && endTime.isAfter(existing.getAppointmentDateTime())) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Employee has overlapping appointments. The selected time slot is not available."
                );
            }
        }
    }

    /**
     * Confirm appointment appointment.
     *
     * @param id               the id
     * @param confirmationCode the confirmation code
     * @return the appointment
     */
    public Appointment confirmAppointment(Long id, String confirmationCode) {
        log.info(String.valueOf(id));
        log.info(confirmationCode);
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No appointment found with id = " + id));

        log.info("OK");

        if (appointment.isConfirmed()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You have already confirmed your appointment");
        }

        log.info("OK2");

        if (appointment.getConfirmationCode().toString().equals(confirmationCode)) {
            appointment.setConfirmed(true);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not allowed");
        }

        return appointmentRepository.save(appointment);
    }


    /**
     * Gets appointments by enterprise id.
     *
     * @param enterpriseId the enterprise id
     * @return the appointments by enterprise id
     */
    public Page<Appointment> getAppointmentsByEnterpriseId(Long enterpriseId, Pageable pageable) {
        if (!enterpriseRepository.existsById(enterpriseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with id = " + enterpriseId);
        }
        return appointmentRepository.findAllByEnterpriseId(enterpriseId, pageable);
    }

    public Page<Appointment> getMyAppointments(String token, Pageable pageable) {
        String username = jwtService.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return appointmentRepository.findByCustomerId(user.getId(), pageable);
    }

    /**
     * Gets appointment by id.
     *
     * @param id the id
     * @return the appointment by id
     */
    public Appointment getAppointmentById(long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found with id = " + id));
    }

    /**
     * Update appointment appointment.
     *
     * @param id             the id
     * @param newAppointment the new appointment
     * @return the appointment
     */
    public Appointment updateAppointment(long id, Appointment newAppointment) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setEnterprise(newAppointment.getEnterprise());
                    appointment.setEmployee(newAppointment.getEmployee());
                    appointment.setServices(resolveServices(newAppointment.getServices(), newAppointment.getEnterprise()));
                    appointment.setCustomerName(newAppointment.getCustomerName());
                    appointment.setCustomerPhoneNumber(newAppointment.getCustomerPhoneNumber());
                    appointment.setCustomerEmail(newAppointment.getCustomerEmail());
                    appointment.setAppointmentDateTime(newAppointment.getAppointmentDateTime());
                    appointment.setConfirmed(newAppointment.isConfirmed());
                    appointment.setPaymentMethods(newAppointment.getPaymentMethods());
                    if (newAppointment.getEndDateTime() != null) {
                        appointment.setEndDateTime(newAppointment.getEndDateTime());
                    } else if (newAppointment.getAppointmentDateTime() != null) {
                        int dur = appointment.getServices().stream().mapToInt(Service::getDurationInMin).sum();
                        if (dur == 0) dur = 60;
                        appointment.setEndDateTime(newAppointment.getAppointmentDateTime().plusMinutes(dur));
                    }
                    return appointmentRepository.save(appointment);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found with id = " + id));
    }

    /**
     * Patch appointment appointment.
     *
     * @param id                 the id
     * @param updatedAppointment the updated appointment
     * @return the appointment
     */
    public Appointment patchAppointment(long id, Appointment updatedAppointment) {
        Appointment existing = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found with id = " + id));

        if (updatedAppointment.getAppointmentDateTime() != null)
            existing.setAppointmentDateTime(updatedAppointment.getAppointmentDateTime());
        if (updatedAppointment.getEndDateTime() != null)
            existing.setEndDateTime(updatedAppointment.getEndDateTime());
        if (updatedAppointment.getAppointmentType() != null)
            existing.setAppointmentType(updatedAppointment.getAppointmentType());
        if (updatedAppointment.getCustomerName() != null)
            existing.setCustomerName(updatedAppointment.getCustomerName());
        if (updatedAppointment.getCustomerPhoneNumber() != null)
            existing.setCustomerPhoneNumber(updatedAppointment.getCustomerPhoneNumber());
        if (updatedAppointment.getCustomerEmail() != null)
            existing.setCustomerEmail(updatedAppointment.getCustomerEmail());
        if (updatedAppointment.getEmployee() != null && updatedAppointment.getEmployee().getId() != null)
            existing.setEmployee(employeeRepository.findById(updatedAppointment.getEmployee().getId()).orElse(existing.getEmployee()));
        if (updatedAppointment.getPaymentMethods() != null && !updatedAppointment.getPaymentMethods().isEmpty())
            existing.setPaymentMethods(updatedAppointment.getPaymentMethods());
        if (updatedAppointment.getServices() != null && !updatedAppointment.getServices().isEmpty())
            existing.setServices(resolveServices(updatedAppointment.getServices(), existing.getEnterprise()));

        return appointmentRepository.save(existing);
    }

    private List<Service> resolveServices(List<Service> requestedServices, Enterprise enterprise) {
        if (requestedServices == null || requestedServices.isEmpty()) {
            return List.of();
        }

        List<Service> enterpriseServices = enterprise != null && enterprise.getServices() != null
                ? enterprise.getServices()
                : List.of();

        return requestedServices.stream()
                .map(requestedService -> {
                    if (requestedService.getId() != null) {
                        return serviceRepository.findById(requestedService.getId())
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found service with id = " + requestedService.getId()));
                    }

                    if (requestedService.getTitle() != null) {
                        return enterpriseServices.stream()
                                .filter(service -> requestedService.getTitle().equals(service.getTitle()))
                                .findFirst()
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found service with title = " + requestedService.getTitle()));
                    }

                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Service must have an id or title");
                })
                .collect(Collectors.toList());
    }


    /**
     * Delete appointment.
     *
     * @param id               the id
     * @param confirmationCode the confirmation code (optional, for customer deletion)
     */
    public void deleteAppointment(long id, String confirmationCode) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No appointment found with id = " + id));

        if (confirmationCode != null && !confirmationCode.isEmpty()) {
            if (!appointment.getConfirmationCode().toString().equals(confirmationCode)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not allowed to delete this appointment");
            }
        }

        appointmentRepository.deleteById(id);
    }
}
