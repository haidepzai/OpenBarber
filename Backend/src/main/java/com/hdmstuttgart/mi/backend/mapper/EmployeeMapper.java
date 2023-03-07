package com.hdmstuttgart.mi.backend.mapper;

import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.dto.EmployeeDto;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

// Convert byte[] logo to MultipartFile


@Component
public class EmployeeMapper {

    public EmployeeDto toDto(Employee employee) {
        EmployeeDto dto = new EmployeeDto();
        dto.setName(employee.getName());
        dto.setTitle(employee.getTitle());
        // Convert byte[] logo to MultipartFile
        if (employee.getPicture() != null) {
            ByteArrayResource logoResource = new ByteArrayResource(employee.getPicture());
            dto.setPicture(new MockMultipartFile("logo", logoResource.getByteArray()));
        }
        return dto;
    }

    public List<EmployeeDto> toDtos(List<Employee> employees) {
        return employees.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Employee toEntity(EmployeeDto employeeDto) throws IOException {
        return Employee.builder()
                .name(employeeDto.getName())
                .title(employeeDto.getTitle())
                .picture(employeeDto.getPicture().getBytes())
                .build();
    }
}