package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * The interface Service repository.
 */
@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    @Override
    List<Service> findAll();

    /**
     * Find all by enterprise id list.
     *
     * @param enterpriseId the enterprise id
     * @return the list
     */
    List<Service> findAllByEnterpriseId(Long enterpriseId);
}
