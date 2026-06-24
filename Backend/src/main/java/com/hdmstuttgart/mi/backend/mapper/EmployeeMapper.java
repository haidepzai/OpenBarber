package com.hdmstuttgart.mi.backend.mapper;

import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.dto.EmployeeDto;
import org.springframework.stereotype.Component;

import java.util.Base64;

/**
 * The type Employee mapper.
 */
@Component
public class EmployeeMapper {

    /**
     * To dto employee dto.
     *
     * @param employee the employee
     * @return the employee dto
     */
    public EmployeeDto toDto(Employee employee) {
        EmployeeDto dto = new EmployeeDto();
        dto.setId(employee.getId());
        dto.setName(employee.getName());
        dto.setTitle(employee.getTitle());
        if (employee.getPicture() != null) {
            dto.setPicture(Base64.getEncoder().encodeToString(employee.getPicture()));
        }
        if (employee.getShop() != null) {
            dto.setShopId(employee.getShop().getId());
        }
        return dto;
    }

    /**
     * To entity employee.
     *
     * @param employeeDto the employee dto
     * @return the employee
     */
    public Employee toEntity(EmployeeDto employeeDto) {
        Employee employee = new Employee();
        employee.setId(employeeDto.getId());
        employee.setName(employeeDto.getName());
        employee.setTitle(employeeDto.getTitle());
        if (employeeDto.getPicture() != null && !employeeDto.getPicture().isEmpty()) {
            employee.setPicture(Base64.getDecoder().decode(employeeDto.getPicture()));
        }
        return employee;
    }
}