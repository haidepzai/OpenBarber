package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnterpriseRepository extends JpaRepository<Enterprise, Long> {
    @Override
    List<Enterprise> findAll();

    Page<Enterprise> findAll(Pageable pageable);

    Optional<Enterprise> findByEmail(String email);

    @Query(
        value = "SELECT * FROM enterprise WHERE (6371 * acos(cos(radians(:lat)) * cos(radians(address_latitude)) * cos(radians(address_longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(address_latitude)))) < :radius",
        countQuery = "SELECT count(*) FROM enterprise WHERE (6371 * acos(cos(radians(:lat)) * cos(radians(address_latitude)) * cos(radians(address_longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(address_latitude)))) < :radius",
        nativeQuery = true
    )
    Page<Enterprise> findWithinRadius(@Param("lat") double latitude, @Param("lng") double longitude, @Param("radius") double radius, Pageable pageable);
}
