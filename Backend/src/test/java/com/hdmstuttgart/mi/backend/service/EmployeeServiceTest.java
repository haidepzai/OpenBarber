package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.Shop;
import com.hdmstuttgart.mi.backend.repository.EmployeeRepository;
import com.hdmstuttgart.mi.backend.repository.ShopRepository;
import com.hdmstuttgart.mi.backend.service.impl.EmployeeServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;
    @Mock
    private ShopRepository shopRepository;
    @InjectMocks
    private EmployeeServiceImpl employeeService;

    @Test
    void createEmployee_shouldSaveEmployeeWithShop() {
        final Shop shop = Shop.builder().id(1L).name("Shop").build();
        final Employee employee = Employee.builder().name("Alex").title("Barber").build();

        when(shopRepository.findById(1L)).thenReturn(Optional.of(shop));
        when(employeeRepository.save(employee)).thenReturn(employee);

        final Employee result = employeeService.createEmployee(employee, 1L);

        assertThat(result).isSameAs(employee);
        assertThat(employee.getShop()).isEqualTo(shop);
        verify(shopRepository).findById(1L);
        verify(employeeRepository).save(employee);
    }

    @Test
    void createEmployee_shouldThrowWhenShopMissing() {
        final Employee employee = Employee.builder().name("Alex").build();
        when(shopRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.createEmployee(employee, 1L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatus()).isEqualTo(HttpStatus.NOT_FOUND));

        verify(employeeRepository, never()).save(any());
    }

    @Test
    void getEmployeesByShopId_shouldReturnEmployees() {
        final List<Employee> employees = List.of(Employee.builder().id(1L).name("Alex").build());
        when(shopRepository.existsById(1L)).thenReturn(true);
        when(employeeRepository.findAllByShopId(1L)).thenReturn(employees);

        final List<Employee> result = employeeService.getEmployeesByShopId(1L);

        assertThat(result).containsExactlyElementsOf(employees);
        verify(shopRepository).existsById(1L);
        verify(employeeRepository).findAllByShopId(1L);
    }

    @Test
    void getEmployeesByShopId_shouldThrowWhenShopMissing() {
        when(shopRepository.existsById(1L)).thenReturn(false);

        assertThatThrownBy(() -> employeeService.getEmployeesByShopId(1L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatus()).isEqualTo(HttpStatus.NOT_FOUND));

        verify(employeeRepository, never()).findAllByShopId(anyLong());
    }

    @Test
    void getEmployeesByShopId_shouldThrowWhenNoEmployeesExist() {
        when(shopRepository.existsById(1L)).thenReturn(true);
        when(employeeRepository.findAllByShopId(1L)).thenReturn(List.of());

        assertThatThrownBy(() -> employeeService.getEmployeesByShopId(1L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatus()).isEqualTo(HttpStatus.NO_CONTENT));
    }

    @Test
    void getEmployeeById_shouldReturnEmployee() {
        final Employee employee = Employee.builder().id(2L).name("Alex").build();
        when(employeeRepository.findById(2L)).thenReturn(Optional.of(employee));

        final Employee result = employeeService.getEmployeeById(2L);

        assertThat(result).isEqualTo(employee);
        verify(employeeRepository).findById(2L);
    }

    @Test
    void getEmployeeById_shouldThrowWhenMissing() {
        when(employeeRepository.findById(2L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.getEmployeeById(2L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatus()).isEqualTo(HttpStatus.NOT_FOUND));
    }

    @Test
    void updateEmployee_shouldUpdateMutableFields() {
        final Employee existing = Employee.builder().id(3L).name("Old").title("Junior").picture(new byte[]{1}).build();
        final Employee updates = Employee.builder().name("New").title("Senior").picture(new byte[]{2, 3}).build();

        when(employeeRepository.findById(3L)).thenReturn(Optional.of(existing));
        when(employeeRepository.save(existing)).thenReturn(existing);

        final Employee result = employeeService.updateEmployee(3L, updates);

        assertThat(result.getName()).isEqualTo("New");
        assertThat(result.getTitle()).isEqualTo("Senior");
        assertThat(result.getPicture()).containsExactly(2, 3);
        verify(employeeRepository).save(existing);
    }

    @Test
    void updateEmployee_shouldThrowWhenMissing() {
        when(employeeRepository.findById(3L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.updateEmployee(3L, Employee.builder().build()))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatus()).isEqualTo(HttpStatus.NOT_FOUND));

        verify(employeeRepository, never()).save(any());
    }

    @Test
    void deleteEmployee_shouldDeleteExistingEmployee() {
        when(employeeRepository.existsById(4L)).thenReturn(true);

        employeeService.deleteEmployee(4L);

        verify(employeeRepository).deleteById(4L);
    }

    @Test
    void deleteEmployee_shouldThrowWhenMissing() {
        when(employeeRepository.existsById(4L)).thenReturn(false);

        assertThatThrownBy(() -> employeeService.deleteEmployee(4L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatus()).isEqualTo(HttpStatus.NOT_FOUND));

        verify(employeeRepository, never()).deleteById(anyLong());
    }
}
