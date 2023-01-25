package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Enterprise;
import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface EnterpriseRepository extends CrudRepository<Enterprise, Long> {
    @Override
    List<Enterprise> findAll();
}
