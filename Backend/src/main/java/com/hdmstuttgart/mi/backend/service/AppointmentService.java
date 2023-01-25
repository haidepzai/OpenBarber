package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.Appointment;
import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.Service;
import com.hdmstuttgart.mi.backend.repository.AppointmentRepository;
import com.hdmstuttgart.mi.backend.repository.EmployeeRepository;
import com.hdmstuttgart.mi.backend.repository.EnterpriseRepository;
import com.hdmstuttgart.mi.backend.repository.ServiceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final EnterpriseRepository enterpriseRepository;
    private final EmployeeRepository employeeRepository;
    private final ServiceRepository serviceRepository;

    public AppointmentService(AppointmentRepository appointmentRepository, EnterpriseRepository enterpriseRepository, EmployeeRepository employeeRepository, ServiceRepository serviceRepository) {
        this.appointmentRepository = appointmentRepository;
        this.enterpriseRepository = enterpriseRepository;
        this.employeeRepository = employeeRepository;
        this.serviceRepository = serviceRepository;
    }

    public Appointment createAppointment(Appointment appointment, long enterpriseId, long employeeId, List<Long> servicesId) {
        Enterprise enterprise = enterpriseRepository.findById(enterpriseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found enterprise with id = " + enterpriseId));
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found employee with id = " + employeeId));
        List<Service> services = servicesId.stream()
                .map(id -> serviceRepository.findById(id)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found service with id = " + id)))
                .collect(Collectors.toList());
        //TODO validate appointments don't collide with each other (query time betweeen startTime and statTime + duration for all booked services)
        appointment.setEnterprise(enterprise);
        appointment.setEmployee(employee);
        appointment.setServices(services);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment getAppointmentById(long id) {
        return appointmentRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
    }

    public Appointment updateAppointment(long id, Appointment newAppointment) {
        Appointment currentAppointment = getAppointmentById(id);
        // update the fields in the currentAppointment object
        currentAppointment.setEnterprise(newAppointment.getEnterprise());
        currentAppointment.setEmployee(newAppointment.getEmployee());
        currentAppointment.setServices(newAppointment.getServices());
        currentAppointment.setCustomerName(newAppointment.getCustomerName());
        currentAppointment.setCustomerPhoneNumber(newAppointment.getCustomerPhoneNumber());
        currentAppointment.setCustomerEmail(newAppointment.getCustomerEmail());
        currentAppointment.setAppointmentDateTime(newAppointment.getAppointmentDateTime());
        currentAppointment.setConfirmed(newAppointment.isConfirmed());
        currentAppointment.setRating(newAppointment.getRating());
        currentAppointment.setRatingText(newAppointment.getRatingText());
        return appointmentRepository.save(currentAppointment);
    }

    public void deleteAppointment(long id) {
        appointmentRepository.deleteById(id);
    }
}
