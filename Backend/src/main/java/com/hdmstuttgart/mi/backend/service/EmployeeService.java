package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.Shop;
import com.hdmstuttgart.mi.backend.repository.EmployeeRepository;
import com.hdmstuttgart.mi.backend.repository.ShopRepository;
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
    private final ShopRepository shopRepository;

    /**
     * Instantiates a new Employee service.
     *
     * @param employeeRepository   the employee repository
     * @param shopRepository the shop repository
     */
    public EmployeeService(EmployeeRepository employeeRepository, ShopRepository shopRepository) {
        this.employeeRepository = employeeRepository;
        this.shopRepository = shopRepository;
    }

    /**
     * Create employee employee.
     *
     * @param employee     the employee
     * @param shopId the shop id
     * @return the employee
     */
    public Employee createEmployee(Employee employee, Long shopId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found with id = " + shopId));
        employee.setShop(shop);
        return employeeRepository.save(employee);
    }

    /**
     * Gets employees by shop id.
     *
     * @param shopId the shop id
     * @return the employees by shop id
     */
    public List<Employee> getEmployeesByShopId(Long shopId) {
        if (!shopRepository.existsById(shopId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found with id = " + shopId);
        }

        List<Employee> employees = employeeRepository.findAllByShopId(shopId);
        if (employees.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "No employees found for shop with id = " + shopId);
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
