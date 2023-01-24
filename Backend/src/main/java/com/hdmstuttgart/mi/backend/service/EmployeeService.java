package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.repository.EmployeeRepository;
import com.hdmstuttgart.mi.backend.repository.EnterpriseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EnterpriseRepository enterpriseRepository;

    public EmployeeService(EmployeeRepository employeeRepository, EnterpriseRepository enterpriseRepository) {
        this.employeeRepository = employeeRepository;
        this.enterpriseRepository = enterpriseRepository;
    }

    public Employee createEmployee(Employee employee, Long enterpriseId) {
        Enterprise enterprise = enterpriseRepository.findById(enterpriseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with id = " + enterpriseId));
        employee.setEnterprise(enterprise);
        return employeeRepository.save(employee);
    }
    public List<Employee> getAllEmployees(Long enterpriseId) {
        return employeeRepository.findAllByEnterpriseId(enterpriseId);
    }

    public Employee getEmployeeById(long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));
    }

    public Employee updateEmployee(long id, Employee newEmployee) {
        return employeeRepository.findById(id)
                .map(employee -> {
                    employee.setName(newEmployee.getName());
                    employee.setPicture(newEmployee.getPicture());
                    employee.setAppointments(newEmployee.getAppointments());
                    return employeeRepository.save(employee);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));
    }

    public boolean deleteEmployee(long id) {
        boolean wasDeleted = employeeRepository.existsById(id);
        if (wasDeleted) {
            employeeRepository.deleteById(id);
        }
        return wasDeleted;
    }
}
