package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.BackendApplication;
import com.hdmstuttgart.mi.backend.model.Appointment;
import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.Service;
import com.hdmstuttgart.mi.backend.repository.AppointmentRepository;
import com.hdmstuttgart.mi.backend.repository.EmployeeRepository;
import com.hdmstuttgart.mi.backend.repository.EnterpriseRepository;
import com.hdmstuttgart.mi.backend.repository.ServiceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

import javax.mail.MessagingException;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.List;
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

    /**
     * Instantiates a new Appointment service.
     *
     * @param appointmentRepository the appointment repository
     * @param enterpriseRepository  the enterprise repository
     * @param employeeRepository    the employee repository
     * @param serviceRepository     the service repository
     * @param emailSenderService    the email sender service
     */
    public AppointmentService(AppointmentRepository appointmentRepository, EnterpriseRepository enterpriseRepository, EmployeeRepository employeeRepository, ServiceRepository serviceRepository, EmailSenderService emailSenderService) {
        this.appointmentRepository = appointmentRepository;
        this.enterpriseRepository = enterpriseRepository;
        this.employeeRepository = employeeRepository;
        this.serviceRepository = serviceRepository;
        this.emailSenderService = emailSenderService;
    }

    /**
     * Create appointment appointment.
     *
     * @param appointment  the appointment
     * @param enterpriseId the enterprise id
     * @return the appointment
     */
    public Appointment createAppointment(Appointment appointment, long enterpriseId) {
        long employeeId = appointment.getEmployee().getId();
        List<Long> serviceIds = appointment.getServices()
                .stream().map(Service::getId)
                .collect(Collectors.toList());
        Enterprise enterprise = enterpriseRepository.findById(enterpriseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found enterprise with id = " + enterpriseId));
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found employee with id = " + employeeId));
        List<Service> services = serviceIds.stream()
                .map(id -> serviceRepository.findById(id)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found service with id = " + id)))
                .collect(Collectors.toList());
        //TODO validate appointments don't collide with each other (query time betweeen startTime and statTime + duration for all booked services)
        appointment.setEnterprise(enterprise);
        appointment.setEmployee(employee);
        appointment.setServices(services);
        appointment.setConfirmationCode(UUID.randomUUID());
        appointmentRepository.save(appointment);

        try {
            emailSenderService.sendEmailWithTemplate(appointment, "appointment", appointment.getCustomerEmail());
        } catch (MessagingException | IOException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);
        }
        return appointment;
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
    public List<Appointment> getAppointmentsByEnterpriseId(Long enterpriseId) {
        if (!enterpriseRepository.existsById(enterpriseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with id = " + enterpriseId);
        }

        List<Appointment> appointments = appointmentRepository.findAllByEnterpriseId(enterpriseId);
        if (appointments.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "No appointments found for enterprise with id = " + enterpriseId);
        }
        return appointments;
    }

    /**
     * Gets appointment by id.
     *
     * @param id the id
     * @return the appointment by id
     */
    public Appointment getAppointmentById(long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found with id = " + id));
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
                    appointment.setServices(newAppointment.getServices());
                    appointment.setCustomerName(newAppointment.getCustomerName());
                    appointment.setCustomerPhoneNumber(newAppointment.getCustomerPhoneNumber());
                    appointment.setCustomerEmail(newAppointment.getCustomerEmail());
                    appointment.setAppointmentDateTime(newAppointment.getAppointmentDateTime());
                    appointment.setConfirmed(newAppointment.isConfirmed());
                    appointment.setPaymentMethods(newAppointment.getPaymentMethods());
//                    Appointment.setRating(newAppointment.getRating());
//                    Appointment.setRatingText(newAppointment.getRatingText());

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
        Appointment existingAppointment = appointmentRepository.getById(id);

        Field[] fields = Appointment.class.getDeclaredFields();

        for (Field field : fields) {
            try {
                field.setAccessible(true);
                Object newValue = field.get(updatedAppointment);
                if (newValue != null) {
                    field.set(existingAppointment, newValue);
                }
            } catch (IllegalAccessException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to update field: " + field.getName());

            }
        }

        return appointmentRepository.save(existingAppointment);
    }


    /**
     * Delete appointment.
     *
     * @param id               the id
     * @param confirmationCode the confirmation code
     */
    public void deleteAppointment(long id, String confirmationCode) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No appointment found with id = " + id));

        if (!appointment.getConfirmationCode().toString().equals(confirmationCode)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not allowed to delete this appointment");
        }

        appointmentRepository.deleteById(id);
    }
}
