package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    @Override
    List<Service> findAll();

    List<Service> findAllByEnterpriseId(Long enterpriseId);
}
