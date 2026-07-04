package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Shop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long>, JpaSpecificationExecutor<Shop> {
    @Override
    List<Shop> findAll();

    Page<Shop> findAll(Pageable pageable);

    Optional<Shop> findByEmail(String email);

    @Query(
        value = "SELECT * FROM shop WHERE (6371 * acos(cos(radians(:lat)) * cos(radians(address_latitude)) * cos(radians(address_longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(address_latitude)))) < :radius",
        countQuery = "SELECT count(*) FROM shop WHERE (6371 * acos(cos(radians(:lat)) * cos(radians(address_latitude)) * cos(radians(address_longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(address_latitude)))) < :radius",
        nativeQuery = true
    )
    Page<Shop> findWithinRadius(@Param("lat") double latitude, @Param("lng") double longitude, @Param("radius") double radius, Pageable pageable);
}
