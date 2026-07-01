package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.Appointment;
import com.hdmstuttgart.mi.backend.model.Shop;
import com.hdmstuttgart.mi.backend.model.dto.SlotDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface IAppointmentService {
    Appointment createAppointment(Appointment appointment, long shopId, String token);

    List<SlotDto> getAvailableSlots(Long shopId, Long employeeId, LocalDate date, int serviceDurationMin);

    boolean hasAnyFreeSlot(Shop shop, LocalDate date, String fromTime, int minDurationMin);

    Appointment confirmAppointment(Long id, String confirmationCode);

    Page<Appointment> getAppointmentsByShopId(Long shopId, Pageable pageable);

    Page<Appointment> getMyAppointments(String token, Pageable pageable);

    Appointment getAppointmentById(long id);

    Appointment updateAppointment(long id, Appointment newAppointment);

    Appointment patchAppointment(long id, Appointment updatedAppointment);

    void deleteAppointment(long id, String confirmationCode);
}
