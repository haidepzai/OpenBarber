package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * The interface Employee repository.
 */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    @Override
    List<Employee> findAll();

    /**
     * Find all by enterprise id list.
     *
     * @param enterpriseId the enterprise id
     * @return the list
     */
    List<Employee> findAllByEnterpriseId(Long enterpriseId);
}
