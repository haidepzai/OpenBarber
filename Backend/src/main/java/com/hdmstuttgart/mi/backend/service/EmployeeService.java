package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.repository.EmployeeRepository;
import com.hdmstuttgart.mi.backend.repository.EnterpriseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

/**
 * The type Employee service.
 */
@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EnterpriseRepository enterpriseRepository;

    /**
     * Instantiates a new Employee service.
     *
     * @param employeeRepository   the employee repository
     * @param enterpriseRepository the enterprise repository
     */
    public EmployeeService(EmployeeRepository employeeRepository, EnterpriseRepository enterpriseRepository) {
        this.employeeRepository = employeeRepository;
        this.enterpriseRepository = enterpriseRepository;
    }

    /**
     * Create employee employee.
     *
     * @param employee     the employee
     * @param enterpriseId the enterprise id
     * @return the employee
     */
    public Employee createEmployee(Employee employee, Long enterpriseId) {
        Enterprise enterprise = enterpriseRepository.findById(enterpriseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with id = " + enterpriseId));
        employee.setEnterprise(enterprise);
        return employeeRepository.save(employee);
    }

    /**
     * Gets employees by enterprise id.
     *
     * @param enterpriseId the enterprise id
     * @return the employees by enterprise id
     */
    public List<Employee> getEmployeesByEnterpriseId(Long enterpriseId) {
        if (!enterpriseRepository.existsById(enterpriseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with id = " + enterpriseId);
        }

        List<Employee> employees = employeeRepository.findAllByEnterpriseId(enterpriseId);
        if (employees.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "No employees found for enterprise with id = " + enterpriseId);
        }
        return employees;
    }

    /**
     * Gets employee by id.
     *
     * @param id the id
     * @return the employee by id
     */
    public Employee getEmployeeById(long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found with id = " + id));
    }

    /**
     * Update employee employee.
     *
     * @param id          the id
     * @param newEmployee the new employee
     * @return the employee
     */
    public Employee updateEmployee(long id, Employee newEmployee) {
        return employeeRepository.findById(id)
                .map(employee -> {
                    employee.setName(newEmployee.getName());
                    employee.setPicture(newEmployee.getPicture());
                    employee.setTitle(newEmployee.getTitle());

                    return employeeRepository.save(employee);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found with id = " + id));
    }

    /**
     * Delete employee.
     *
     * @param id the id
     */
    public void deleteEmployee(long id) {
        if (!employeeRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found with id = " + id);
        }
        employeeRepository.deleteById(id);
    }
}
