package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query(value = "SELECT * FROM enterprise WHERE (6371 * acos(cos(radians(:address_latitude)) * cos(radians(address_latitude)) * cos(radians(address_longitude) - radians(:address_longitude)) + sin(radians(:address_latitude)) * sin(radians(address_latitude)))) < :radius", nativeQuery = true)
    List<Enterprise> findWithinRadius(@Param("address_latitude") double latitude, @Param("address_longitude") double longitude, @Param("radius") double radius);

}
