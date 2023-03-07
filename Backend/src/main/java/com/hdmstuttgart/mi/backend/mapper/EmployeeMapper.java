package com.hdmstuttgart.mi.backend.mapper;

import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.dto.EmployeeDto;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

   private final ModelMapper modelMapper;

   public EmployeeMapper(ModelMapper modelMapper) {
       this.modelMapper = modelMapper;
   }

   public EmployeeDto toDto(Employee employee) {
       return modelMapper.map(employee, EmployeeDto.class);
   }

   public Employee toEntity(EmployeeDto employeeDto) {
       return modelMapper.map(employeeDto, Employee.class);
   }
}