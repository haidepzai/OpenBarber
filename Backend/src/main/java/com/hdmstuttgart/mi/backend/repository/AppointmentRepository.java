package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    @Override
    List<Appointment> findAll();

    List<Appointment> findAllByEnterpriseId(Long enterpriseId);
}
