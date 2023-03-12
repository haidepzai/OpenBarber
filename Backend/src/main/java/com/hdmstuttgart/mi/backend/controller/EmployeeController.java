package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.mapper.EmployeeMapper;
import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.dto.EmployeeDto;
import com.hdmstuttgart.mi.backend.service.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * The type Employee controller.
 */
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;
    private final EmployeeMapper employeeMapper;

    /**
     * Instantiates a new Employee controller.
     *
     * @param employeeService the employee service
     * @param employeeMapper  the employee mapper
     */
    public EmployeeController(EmployeeService employeeService, EmployeeMapper employeeMapper) {
        this.employeeService = employeeService;
        this.employeeMapper = employeeMapper;
    }

    /**
     * Create employee response entity.
     *
     * @param employeeDto  the employee dto
     * @param enterpriseId the enterprise id
     * @return the response entity
     * @throws IOException the io exception
     */
    @PostMapping
    public ResponseEntity<EmployeeDto> createEmployee(@Valid @RequestBody EmployeeDto employeeDto, @RequestParam Long enterpriseId) throws IOException {
        Employee employee = employeeMapper.toEntity(employeeDto);
        Employee createdEmployee = employeeService.createEmployee(employee, enterpriseId);
        EmployeeDto createdEmployeeDto = employeeMapper.toDto(createdEmployee);
        return new ResponseEntity<>(createdEmployeeDto, HttpStatus.CREATED);
    }

    /**
     * Gets employees by enterprise id.
     *
     * @param enterpriseId the enterprise id
     * @return the employees by enterprise id
     */
    @GetMapping
    public ResponseEntity<List<EmployeeDto>> getEmployeesByEnterpriseId(@RequestParam Long enterpriseId) {
        List<Employee> employees = employeeService.getEmployeesByEnterpriseId(enterpriseId);
        List<EmployeeDto> employeeDtos = employees.stream()
                .map(employeeMapper::toDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(employeeDtos, HttpStatus.OK);
    }

    /**
     * Gets employee by id.
     *
     * @param id the id
     * @return the employee by id
     */
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable long id) {
        Employee employee = employeeService.getEmployeeById(id);
        EmployeeDto employeeDto = employeeMapper.toDto(employee);
        return new ResponseEntity<>(employeeDto, HttpStatus.OK);
    }

    /**
     * Update employee response entity.
     *
     * @param id             the id
     * @param newEmployeeDto the new employee dto
     * @return the response entity
     * @throws IOException the io exception
     */
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDto> updateEmployee(@PathVariable long id, @Valid @RequestBody EmployeeDto newEmployeeDto) throws IOException {
        Employee newEmployee = employeeMapper.toEntity(newEmployeeDto);
        Employee updatedEmployee = employeeService.updateEmployee(id, newEmployee);
        EmployeeDto updatedEmployeeDto = employeeMapper.toDto(updatedEmployee);
        return new ResponseEntity<>(updatedEmployeeDto, HttpStatus.OK);
    }

    /**
     * Delete employee response entity.
     *
     * @param id    the id
     * @param token the token
     * @return the response entity
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable long id, @RequestHeader("Authorization") String token) {
        employeeService.deleteEmployee(id);
        return new ResponseEntity<>("Employee deleted with id = " + id, HttpStatus.NO_CONTENT);
    }
}
