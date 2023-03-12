package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * The interface Enterprise repository.
 */
@Repository
public interface EnterpriseRepository extends JpaRepository<Enterprise, Long> {
    @Override
    List<Enterprise> findAll();

    /**
     * Find by email optional.
     *
     * @param email the email
     * @return the optional
     */
    Optional<Enterprise> findByEmail(String email);
}
