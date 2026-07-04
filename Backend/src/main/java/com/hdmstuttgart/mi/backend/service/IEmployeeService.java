package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.Employee;

import java.util.List;

public interface IEmployeeService {
    Employee createEmployee(Employee employee, Long shopId);

    List<Employee> getEmployeesByShopId(Long shopId);

    Employee getEmployeeById(long id);

    Employee updateEmployee(long id, Employee newEmployee);

    void deleteEmployee(long id);
}
