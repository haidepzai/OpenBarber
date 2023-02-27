package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Enterprise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnterpriseRepository extends JpaRepository<Enterprise, Long> {
    @Override
    List<Enterprise> findAll();
}
