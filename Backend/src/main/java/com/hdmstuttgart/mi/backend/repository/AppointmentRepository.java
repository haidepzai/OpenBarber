package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    @Override
    List<Appointment> findAll();

    Page<Appointment> findAllByEnterpriseId(Long enterpriseId, Pageable pageable);

    Optional<Appointment> findById(UUID id);

    List<Appointment> findByEmployeeIdAndConfirmedTrue(Long employeeId);

    List<Appointment> findByEmployeeIdAndConfirmedTrueAndAppointmentDateTimeBetween(
            Long employeeId, LocalDateTime start, LocalDateTime end);

    List<Appointment> findByEmployeeIdAndAppointmentDateTimeBetween(
            Long employeeId, LocalDateTime start, LocalDateTime end);

    List<Appointment> findByEnterpriseIdAndConfirmedTrueAndAppointmentDateTimeBetween(
            Long enterpriseId, LocalDateTime start, LocalDateTime end);

    Page<Appointment> findByCustomerId(Long customerId, Pageable pageable);
}
