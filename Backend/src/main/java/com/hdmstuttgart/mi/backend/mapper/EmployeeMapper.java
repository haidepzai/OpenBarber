package com.hdmstuttgart.mi.backend.mapper;

import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.dto.EmployeeDto;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

/**
 * The type Employee mapper.
 */
@Component
public class EmployeeMapper {

   private final ModelMapper modelMapper;

    /**
     * Instantiates a new Employee mapper.
     *
     * @param modelMapper the model mapper
     */
    public EmployeeMapper(ModelMapper modelMapper) {
       this.modelMapper = modelMapper;
   }

    /**
     * To dto employee dto.
     *
     * @param employee the employee
     * @return the employee dto
     */
    public EmployeeDto toDto(Employee employee) {
       return modelMapper.map(employee, EmployeeDto.class);
   }

    /**
     * To entity employee.
     *
     * @param employeeDto the employee dto
     * @return the employee
     */
    public Employee toEntity(EmployeeDto employeeDto) {
       return modelMapper.map(employeeDto, Employee.class);
   }
}