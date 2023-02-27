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

    public Appointment createAppointment(Appointment appointment, long enterpriseId, long employeeId, List<Long> serviceIds) {
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
        return appointmentRepository.save(appointment);
    }

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

    public Appointment getAppointmentById(long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found with id = " + id));
    }

    public Appointment updateAppointment(long id, Appointment newAppointment) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
//                    appointment.setEnterprise(newAppointment.getEnterprise());
//                    appointment.setEmployee(newAppointment.getEmployee());
//                    appointment.setServices(newAppointment.getServices());
                    appointment.setCustomerName(newAppointment.getCustomerName());
                    appointment.setCustomerPhoneNumber(newAppointment.getCustomerPhoneNumber());
                    appointment.setCustomerEmail(newAppointment.getCustomerEmail());
                    appointment.setAppointmentDateTime(newAppointment.getAppointmentDateTime());
                    appointment.setConfirmed(newAppointment.isConfirmed());
//                    Appointment.setRating(newAppointment.getRating());
//                    Appointment.setRatingText(newAppointment.getRatingText());

                    return appointmentRepository.save(appointment);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found with id = " + id));
    }

    public void deleteAppointment(long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found with id = " + id);
        }
        appointmentRepository.deleteById(id);
    }
}
