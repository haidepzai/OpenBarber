package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Operator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OperatorRepository extends JpaRepository<Operator, Long>{
        @Override
        List<Operator> findAll();
}
