package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    @Override
    List<Employee> findAll();

    List<Employee> findAllByEnterpriseId(Long enterpriseId);
}
