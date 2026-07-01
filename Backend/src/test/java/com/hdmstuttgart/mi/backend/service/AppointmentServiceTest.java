package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.Appointment;
import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.Shop;
import com.hdmstuttgart.mi.backend.model.dto.SlotDto;
import com.hdmstuttgart.mi.backend.repository.AppointmentRepository;
import com.hdmstuttgart.mi.backend.repository.EmployeeRepository;
import com.hdmstuttgart.mi.backend.repository.ServiceRepository;
import com.hdmstuttgart.mi.backend.repository.ShopRepository;
import com.hdmstuttgart.mi.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;
    @Mock
    private ShopRepository shopRepository;
    @Mock
    private EmployeeRepository employeeRepository;
    @Mock
    private ServiceRepository serviceRepository;
    @Mock
    private EmailSenderService emailSenderService;
    @Mock
    private JwtService jwtService;
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private AppointmentService appointmentService;

    @Test
    void getAvailableSlots_shouldReturnAllSlotsWhenNoEmployeesExist() {
        LocalDate date = LocalDate.of(2026, 1, 5);
        Shop shop = shopWithHours(1L, "08:00", "09:00");
        when(shopRepository.findById(1L)).thenReturn(Optional.of(shop));
        when(employeeRepository.findAllByShopId(1L)).thenReturn(List.of());

        List<SlotDto> result = appointmentService.getAvailableSlots(1L, null, date, 30);

        assertThat(result).extracting(SlotDto::getTime).containsExactly("08:00", "08:15", "08:30");
        assertThat(result).allSatisfy(slot -> assertThat(slot.getEmployeeId()).isNull());
    }

    @Test
    void getAvailableSlots_shouldAssignEmployeeWhenNoConflictsExist() {
        LocalDate date = LocalDate.of(2026, 1, 5);
        Shop shop = shopWithHours(1L, "08:00", "09:00");
        Employee employee = Employee.builder().id(10L).name("Alex").picture(new byte[]{1}).build();
        when(shopRepository.findById(1L)).thenReturn(Optional.of(shop));
        when(employeeRepository.findAllByShopId(1L)).thenReturn(List.of(employee));
        when(appointmentRepository.findByEmployeeIdAndAppointmentDateTimeBetween(eq(10L), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(List.of());

        List<SlotDto> result = appointmentService.getAvailableSlots(1L, null, date, 30);

        assertThat(result).hasSize(3);
        assertThat(result).allSatisfy(slot -> {
            assertThat(slot.getEmployeeId()).isEqualTo(10L);
            assertThat(slot.getEmployeeName()).isEqualTo("Alex");
        });
    }

    @Test
    void getAvailableSlots_shouldSkipConflictingSlot() {
        LocalDate date = LocalDate.of(2026, 1, 5);
        Shop shop = shopWithHours(1L, "08:00", "09:00");
        Employee employee = Employee.builder().id(10L).name("Alex").build();
        Appointment conflict = new Appointment();
        conflict.setAppointmentDateTime(LocalDateTime.of(2026, 1, 5, 8, 15));
        conflict.setEndDateTime(LocalDateTime.of(2026, 1, 5, 8, 30));

        when(shopRepository.findById(1L)).thenReturn(Optional.of(shop));
        when(employeeRepository.findAllByShopId(1L)).thenReturn(List.of(employee));
        when(appointmentRepository.findByEmployeeIdAndAppointmentDateTimeBetween(eq(10L), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(List.of(conflict));

        List<SlotDto> result = appointmentService.getAvailableSlots(1L, null, date, 15);

        assertThat(result).extracting(SlotDto::getTime).containsExactly("08:00", "08:30", "08:45");
    }

    @Test
    void getAvailableSlots_shouldThrowWhenShopMissing() {
        when(shopRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> appointmentService.getAvailableSlots(1L, null, LocalDate.now(), 30))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatus()).isEqualTo(HttpStatus.NOT_FOUND));
    }

    @Test
    void hasAnyFreeSlot_shouldReturnFalseWhenClosedOnWeekday() {
        Shop shop = shopWithHours(1L, "08:00", "20:00");
        shop.setOpeningDays(List.of("MONDAY"));

        boolean result = appointmentService.hasAnyFreeSlot(shop, LocalDate.of(2026, 1, 6), "10:00", 30);

        assertThat(result).isFalse();
    }

    @Test
    void hasAnyFreeSlot_shouldReturnFalseWhenTimeDoesNotFitBeforeClosing() {
        Shop shop = shopWithHours(1L, "08:00", "09:00");

        boolean result = appointmentService.hasAnyFreeSlot(shop, LocalDate.of(2026, 1, 5), "08:45", 30);

        assertThat(result).isFalse();
    }

    @Test
    void hasAnyFreeSlot_shouldReturnTrueWhenNoEmployeesExist() {
        Shop shop = shopWithHours(1L, "08:00", "09:00");
        shop.setOpeningDays(List.of("MONDAY"));
        when(employeeRepository.findAllByShopId(1L)).thenReturn(List.of());

        boolean result = appointmentService.hasAnyFreeSlot(shop, LocalDate.of(2026, 1, 5), "08:00", 30);

        assertThat(result).isTrue();
    }

    @Test
    void hasAnyFreeSlot_shouldReturnFalseWhenAllEmployeesAreBusy() {
        LocalDate date = LocalDate.of(2026, 1, 5);
        Shop shop = shopWithHours(1L, "08:00", "09:00");
        Employee employee = Employee.builder().id(10L).name("Alex").build();
        Appointment busy = new Appointment();
        busy.setAppointmentDateTime(LocalDateTime.of(2026, 1, 5, 8, 0));
        busy.setEndDateTime(LocalDateTime.of(2026, 1, 5, 9, 0));

        when(employeeRepository.findAllByShopId(1L)).thenReturn(List.of(employee));
        when(appointmentRepository.findByEmployeeIdAndAppointmentDateTimeBetween(eq(10L), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(List.of(busy));

        boolean result = appointmentService.hasAnyFreeSlot(shop, date, "08:00", 30);

        assertThat(result).isFalse();
    }

    @Test
    void hasAnyFreeSlot_shouldReturnTrueWhenAtLeastOneSlotIsFree() {
        LocalDate date = LocalDate.of(2026, 1, 5);
        Shop shop = shopWithHours(1L, "08:00", "09:00");
        Employee employee = Employee.builder().id(10L).name("Alex").build();
        Appointment busy = new Appointment();
        busy.setAppointmentDateTime(LocalDateTime.of(2026, 1, 5, 8, 0));
        busy.setEndDateTime(LocalDateTime.of(2026, 1, 5, 8, 30));

        when(employeeRepository.findAllByShopId(1L)).thenReturn(List.of(employee));
        when(appointmentRepository.findByEmployeeIdAndAppointmentDateTimeBetween(eq(10L), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(List.of(busy));

        boolean result = appointmentService.hasAnyFreeSlot(shop, date, "08:00", 30);

        assertThat(result).isTrue();
    }

    private Shop shopWithHours(Long id, String openingTime, String closingTime) {
        return Shop.builder().id(id).openingTime(openingTime).closingTime(closingTime).build();
    }
}
