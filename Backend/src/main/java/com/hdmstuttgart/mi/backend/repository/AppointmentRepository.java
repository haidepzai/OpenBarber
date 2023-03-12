package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * The interface Appointment repository.
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    @Override
    List<Appointment> findAll();

    /**
     * Find all by enterprise id list.
     *
     * @param enterpriseId the enterprise id
     * @return the list
     */
    List<Appointment> findAllByEnterpriseId(Long enterpriseId);

    /**
     * Find by id optional.
     *
     * @param id the id
     * @return the optional
     */
    Optional<Appointment> findById(UUID id);
}
