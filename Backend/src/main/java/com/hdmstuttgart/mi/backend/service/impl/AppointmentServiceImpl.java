package com.hdmstuttgart.mi.backend.service.impl;

import com.hdmstuttgart.mi.backend.model.*;
import com.hdmstuttgart.mi.backend.model.dto.SlotDto;
import com.hdmstuttgart.mi.backend.model.enums.AppointmentType;
import com.hdmstuttgart.mi.backend.repository.*;
import com.hdmstuttgart.mi.backend.service.IAppointmentService;
import com.hdmstuttgart.mi.backend.service.IEmailSenderService;
import com.hdmstuttgart.mi.backend.service.IJwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import javax.mail.MessagingException;
import java.io.IOException;
import java.time.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * The type Appointment service.
 */
@org.springframework.stereotype.Service
public class AppointmentServiceImpl implements IAppointmentService {

    private static final Logger log = LoggerFactory.getLogger(AppointmentServiceImpl.class);

    private final AppointmentRepository appointmentRepository;
    private final ShopRepository shopRepository;
    private final EmployeeRepository employeeRepository;
    private final ServiceRepository serviceRepository;
    private final IEmailSenderService emailSenderService;
    private final IJwtService jwtService;
    private final UserRepository userRepository;

    public AppointmentServiceImpl(final AppointmentRepository appointmentRepository, final ShopRepository shopRepository, final EmployeeRepository employeeRepository, final ServiceRepository serviceRepository, final IEmailSenderService emailSenderService, final IJwtService jwtService, final UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.shopRepository = shopRepository;
        this.employeeRepository = employeeRepository;
        this.serviceRepository = serviceRepository;
        this.emailSenderService = emailSenderService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    /**
     * Create appointment appointment.
     *
     * @param appointment the appointment
     * @param shopId      the shop id
     * @return the appointment
     */
    public Appointment createAppointment(Appointment appointment, final long shopId, final String token) {
        final Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found shop with id = " + shopId));

        final boolean isVacation = AppointmentType.VACATION.equals(appointment.getAppointmentType());

        final List<Service> services;
        final Employee employee;

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
            services = resolveServices(appointment.getServices(), shop);
            if (services.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one service is mandatory");
            }
            if (appointment.getEmployee() == null || appointment.getEmployee().getId() == null) {
                employee = findAvailableEmployee(shop, appointment.getAppointmentDateTime(), services);
            } else {
                final long employeeId = appointment.getEmployee().getId();
                employee = employeeRepository.findById(employeeId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found employee with id = " + employeeId));
                checkTimeCollision(employeeId, appointment.getAppointmentDateTime(), services);
            }
        }

        appointment.setShop(shop);
        appointment.setEmployee(employee);
        appointment.setServices(services);
        appointment.setConfirmationCode(UUID.randomUUID());

        // Link to customer account only for non-operator users
        if (token != null && token.startsWith("Bearer ")) {
            try {
                final String username = jwtService.extractUsername(token.substring(7));
                final Appointment finalAppointment = appointment;
                userRepository.findByEmail(username).ifPresent(user -> {
                    if (user.getShop() == null) { // only link if not an shop operator
                        finalAppointment.setCustomer(user);
                        finalAppointment.setConfirmed(true); // customer email verified at signup → auto-confirm
                    }
                });
            } catch (final Exception ignored) {
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
            } catch (final MessagingException | IOException e) {
                log.error("Failed to send appointment confirmation email for appointment {}", appointment.getId(), e);
            }
        }
        return appointment;
    }

    private Employee findAvailableEmployee(final Shop shop, final LocalDateTime startTime, final List<Service> services) {
        final List<Employee> employees = shop.getEmployees();
        if (employees == null || employees.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No employees available for this shop");
        }
        final int totalDuration = services.stream().mapToInt(Service::getDurationInMin).sum();
        for (final Employee emp : employees) {
            try {
                checkTimeCollision(emp.getId(), startTime, services);
                return emp;
            } catch (final ResponseStatusException ignored) {
                // Employee not available, try next
            }
        }
        throw new ResponseStatusException(HttpStatus.CONFLICT, "No employee is available at the selected time");
    }

    @Transactional(readOnly = true)
    public List<SlotDto> getAvailableSlots(final Long shopId, final Long employeeId, final LocalDate date, final int serviceDurationMin) {
        final Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));

        final int openMinutes = parseTimeToMinutes(shop.getOpeningTime(), 8 * 60);
        final int closeMinutes = parseTimeToMinutes(shop.getClosingTime(), 20 * 60);

        final List<String> allSlots = new ArrayList<>();
        int cur = openMinutes;
        while (cur + serviceDurationMin <= closeMinutes) {
            allSlots.add(String.format("%02d:%02d", cur / 60, cur % 60));
            cur += 15;
        }

        final List<Employee> employees;
        if (employeeId != null && employeeId > 0) {
            employees = List.of(employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found")));
        } else {
            employees = employeeRepository.findAllByShopId(shopId);
        }

        if (employees.isEmpty()) return allSlots.stream()
                .map(t -> new SlotDto(t, null, null, null))
                .collect(Collectors.toList());

        final LocalDateTime dayStart = date.atStartOfDay();
        final LocalDateTime dayEnd = date.atTime(23, 59, 59);

        final Map<Long, List<Appointment>> appointmentsByEmployee = employees.stream()
                .collect(Collectors.toMap(
                        Employee::getId,
                        emp -> appointmentRepository.findByEmployeeIdAndAppointmentDateTimeBetween(emp.getId(), dayStart, dayEnd)
                ));

        final List<SlotDto> result = new ArrayList<>();
        for (final String slot : allSlots) {
            final String[] parts = slot.split(":");
            final LocalDateTime slotStart = LocalDateTime.of(date, LocalTime.of(Integer.parseInt(parts[0]), Integer.parseInt(parts[1])));
            final LocalDateTime slotEnd = slotStart.plusMinutes(serviceDurationMin);

            for (final Employee emp : employees) {
                final List<Appointment> dayAppointments = appointmentsByEmployee.get(emp.getId());
                final boolean hasConflict = dayAppointments.stream().anyMatch(existing -> {
                    final LocalDateTime existingEnd;
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

    /**
     * Checks whether a shop has at least one free slot of minDurationMin minutes
     * on the given date, starting no earlier than fromTime.
     * Also validates that the shop is open on that weekday and the time range fits within opening hours.
     */
    @Transactional(readOnly = true)
    public boolean hasAnyFreeSlot(final Shop shop, final LocalDate date, final String fromTime, final int minDurationMin) {
        // Check opening days
        final List<String> openingDays = shop.getOpeningDays();
        if (openingDays != null && !openingDays.isEmpty()) {
            final String weekday = date.getDayOfWeek().name(); // e.g. "MONDAY"
            final boolean isOpen = openingDays.stream()
                    .anyMatch(d -> d != null && d.equalsIgnoreCase(weekday));
            if (!isOpen) return false;
        }

        final int openMinutes = parseTimeToMinutes(shop.getOpeningTime(), 8 * 60);
        final int closeMinutes = parseTimeToMinutes(shop.getClosingTime(), 20 * 60);
        final int fromMinutes = parseTimeToMinutes(fromTime, openMinutes);
        final int startMinutes = Math.max(openMinutes, fromMinutes);

        // Not enough time left within opening hours
        if (startMinutes + minDurationMin > closeMinutes) {
            return false;
        }

        final List<Employee> employees = employeeRepository.findAllByShopId(shop.getId());
        if (employees.isEmpty()) {
            return true;
        }

        final LocalDateTime dayStart = date.atStartOfDay();
        final LocalDateTime dayEnd = date.atTime(23, 59, 59);

        final Map<Long, List<Appointment>> apptByEmployee = employees.stream()
                .collect(Collectors.toMap(
                        Employee::getId,
                        emp -> appointmentRepository.findByEmployeeIdAndAppointmentDateTimeBetween(emp.getId(), dayStart, dayEnd)
                ));

        int cur = startMinutes;
        while (cur + minDurationMin <= closeMinutes) {
            final LocalDateTime slotStart = LocalDateTime.of(date, LocalTime.of(cur / 60, cur % 60));
            final LocalDateTime slotEnd = slotStart.plusMinutes(minDurationMin);

            for (final Employee emp : employees) {
                final List<Appointment> dayAppts = apptByEmployee.getOrDefault(emp.getId(), List.of());
                final boolean hasConflict = dayAppts.stream().anyMatch(existing -> {
                    final LocalDateTime existingEnd;
                    if (existing.getEndDateTime() != null) {
                        existingEnd = existing.getEndDateTime();
                    } else {
                        int dur = existing.getServices().stream().mapToInt(Service::getDurationInMin).sum();
                        if (dur == 0) dur = 60;
                        existingEnd = existing.getAppointmentDateTime().plusMinutes(dur);
                    }
                    return slotStart.isBefore(existingEnd) && slotEnd.isAfter(existing.getAppointmentDateTime());
                });
                if (!hasConflict) return true;
            }
            cur += 15;
        }
        return false;
    }

    private int parseTimeToMinutes(final String timeStr, final int defaultMinutes) {
        if (timeStr == null || timeStr.isBlank()) return defaultMinutes;
        try {
            if (timeStr.contains("T")) {
                // ISO UTC string (e.g. "2023-01-01T07:00:00.293Z") — convert to local time
                String normalized = timeStr.replaceAll("\\.\\d+Z$", "Z");
                if (!normalized.endsWith("Z")) normalized += "Z";
                final LocalTime localTime = Instant.parse(normalized).atZone(ZoneId.systemDefault()).toLocalTime();
                return localTime.getHour() * 60 + localTime.getMinute();
            }
            // Simple "HH:mm" format
            final String[] parts = timeStr.split(":");
            return Integer.parseInt(parts[0]) * 60 + Integer.parseInt(parts[1]);
        } catch (final Exception e) {
            return defaultMinutes;
        }
    }

    /**
     * Check if the employee has any time collision with existing appointments.
     *
     * @param employeeId the employee id
     * @param startTime  the appointment start time
     * @param services   the services booked (to calculate total duration)
     * @throws ResponseStatusException if a time collision is detected
     */
    private void checkTimeCollision(final Long employeeId, final LocalDateTime startTime, final List<Service> services) {
        final int totalDurationMin = services.stream()
                .mapToInt(Service::getDurationInMin)
                .sum();
        final LocalDateTime endTime = startTime.plusMinutes(totalDurationMin);
        final LocalDateTime expiryThreshold = LocalDateTime.now().minusMinutes(30);

        // Block confirmed appointments AND unconfirmed guest appointments within 30-minute window
        final List<Appointment> relevantAppointments = appointmentRepository
                .findByEmployeeIdAndConfirmedTrue(employeeId);
        relevantAppointments.addAll(
                appointmentRepository.findByEmployeeIdAndAppointmentDateTimeBetween(
                                employeeId, startTime.minusHours(12), startTime.plusHours(12))
                        .stream()
                        .filter(a -> !a.isConfirmed() && a.getCustomer() == null
                                && a.getCreatedAt() != null && a.getCreatedAt().isAfter(expiryThreshold))
                        .toList()
        );

        for (final Appointment existing : relevantAppointments) {
            final int existingDurationMin = existing.getServices().stream()
                    .mapToInt(Service::getDurationInMin)
                    .sum();
            final LocalDateTime existingEndTime = existing.getAppointmentDateTime().plusMinutes(existingDurationMin);

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
    public Appointment confirmAppointment(final Long id, final String confirmationCode) {
        log.info(String.valueOf(id));
        log.info(confirmationCode);
        final Appointment appointment = appointmentRepository.findById(id)
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
     * Gets appointments by shop id.
     *
     * @param shopId the shop id
     * @return the appointments by shop id
     */
    public Page<Appointment> getAppointmentsByShopId(final Long shopId, final Pageable pageable) {
        if (!shopRepository.existsById(shopId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found with id = " + shopId);
        }
        return appointmentRepository.findAllByShopId(shopId, pageable);
    }

    public Page<Appointment> getMyAppointments(final String token, final Pageable pageable) {
        final String username = jwtService.extractUsername(token.substring(7));
        final User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return appointmentRepository.findByCustomerId(user.getId(), pageable);
    }

    /**
     * Gets appointment by id.
     *
     * @param id the id
     * @return the appointment by id
     */
    public Appointment getAppointmentById(final long id) {
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
    public Appointment updateAppointment(final long id, final Appointment newAppointment) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setShop(newAppointment.getShop());
                    appointment.setEmployee(newAppointment.getEmployee());
                    appointment.setServices(resolveServices(newAppointment.getServices(), newAppointment.getShop()));
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
    public Appointment patchAppointment(final long id, final Appointment updatedAppointment) {
        final Appointment existing = appointmentRepository.findById(id)
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
            existing.setServices(resolveServices(updatedAppointment.getServices(), existing.getShop()));

        return appointmentRepository.save(existing);
    }

    private List<Service> resolveServices(final List<Service> requestedServices, final Shop shop) {
        if (requestedServices == null || requestedServices.isEmpty()) {
            return List.of();
        }

        final List<Service> shopServices = shop != null && shop.getServices() != null
                ? shop.getServices()
                : List.of();

        return requestedServices.stream()
                .map(requestedService -> {
                    if (requestedService.getId() != null) {
                        return serviceRepository.findById(requestedService.getId())
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found service with id = " + requestedService.getId()));
                    }

                    if (requestedService.getTitle() != null) {
                        return shopServices.stream()
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
    public void deleteAppointment(final long id, final String confirmationCode) {
        final Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No appointment found with id = " + id));

        if (confirmationCode != null && !confirmationCode.isEmpty()) {
            if (!appointment.getConfirmationCode().toString().equals(confirmationCode)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not allowed to delete this appointment");
            }
        }

        appointmentRepository.deleteById(id);
    }
}
