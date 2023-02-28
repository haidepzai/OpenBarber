package com.hdmstuttgart.mi.backend;

import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.service.EmployeeService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.net.MalformedURLException;

import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class EmployeeServiceTest {

    @Autowired
    private EmployeeService employeeService;

    /**
     This test case verifies the successful creation of an Employee object by testing the createEmployee() method of the
     employeeService. It creates a new Employee object with the name "john" and assigns it to an Enterprise object. The
     createEmployee() method is then called, passing the Employee and Enterprise IDs as arguments. The test then retrieves
     the saved Employee object by ID and asserts that the name of the saved Employee matches the name of the original Employee,
     converted to title case (i.e. "John").
     */
    @Test
    public void testCreateEmployee() throws MalformedURLException {
        Employee employee = new Employee();
        Enterprise enterprise = new Enterprise();
        employee.setName("john");
        Long id = Long.valueOf(1);
        employeeService.createEmployee(employee, enterprise.getId());
        Employee savedEmployee = employeeService.getEmployeeById(employee.getId());
        assertEquals("John", savedEmployee.getName());
    }
}