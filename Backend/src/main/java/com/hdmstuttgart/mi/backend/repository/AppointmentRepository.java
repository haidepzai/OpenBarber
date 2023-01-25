package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Appointment;
import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface AppointmentRepository extends CrudRepository<Appointment, Long> {
    @Override
    List<Appointment> findAll();
}
