package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    @Override
    List<Appointment> findAll();

    List<Appointment> findAllByEnterpriseId(Long enterpriseId);

    Optional<Appointment> findById(UUID id);
}
