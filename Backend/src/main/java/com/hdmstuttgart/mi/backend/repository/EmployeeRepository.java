package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Employee;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface EmployeeRepository extends CrudRepository<Employee, Long> {
    @Override
    List<Employee> findAll();

    List<Employee> findAllByEnterpriseId(Long enterpriseId);
}
