package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.service.EmployeeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enterprises/{enterpriseId}/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping
    public Employee createEmployee(@RequestBody Employee employee, @PathVariable Long enterpriseId) {
        return employeeService.createEmployee(employee, enterpriseId);
    }

    @GetMapping
    public List<Employee> getAllEmployees(@PathVariable Long enterpriseId) {
        return employeeService.getAllEmployees(enterpriseId);
    }

    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable long id) {
        return employeeService.getEmployeeById(id);
    }

    @PutMapping("/{id}")
    public Employee updateEmployee(@PathVariable long id, @RequestBody Employee newEmployee) {
        return employeeService.updateEmployee(id, newEmployee);
    }

    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable long id) {
        employeeService.deleteEmployee(id);
    }
}
