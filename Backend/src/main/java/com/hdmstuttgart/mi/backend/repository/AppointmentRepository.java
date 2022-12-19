package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Appointment;
import org.springframework.data.repository.CrudRepository;

public interface AppointmentRepository extends CrudRepository<Appointment, Long> {
}
