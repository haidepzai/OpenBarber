package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Service;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ServiceRepository extends CrudRepository<Service, Long> {
    @Override
    List<Service> findAll();

    List<Service> findAllByEnterpriseId(Long enterpriseId);
}
