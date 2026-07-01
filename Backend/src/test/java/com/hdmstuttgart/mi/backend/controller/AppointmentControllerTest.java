package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.config.JwtAuthenticationFilter;
import com.hdmstuttgart.mi.backend.config.RateLimitFilter;
import com.hdmstuttgart.mi.backend.mapper.AppointmentMapper;
import com.hdmstuttgart.mi.backend.model.Appointment;
import com.hdmstuttgart.mi.backend.model.dto.AppointmentDto;
import com.hdmstuttgart.mi.backend.service.AppointmentService;
import com.hdmstuttgart.mi.backend.service.JwtService;
import com.hdmstuttgart.mi.backend.service.RecaptchaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AppointmentController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AppointmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AppointmentService appointmentService;
    @MockBean
    private AppointmentMapper appointmentMapper;
    @MockBean
    private RecaptchaService recaptchaService;
    @MockBean
    private JwtService jwtService;
    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockBean
    private UserDetailsService userDetailsService;
    @MockBean
    private AuthenticationProvider authenticationProvider;
    @MockBean
    private RateLimitFilter rateLimitFilter;

    @Test
    void getAppointmentsByShopId_shouldReturnPage() throws Exception {
        Appointment appointment = new Appointment();
        appointment.setId(1L);
        AppointmentDto dto = AppointmentDto.builder().id(1L).customerName("Alex").appointmentDateTime(LocalDateTime.of(2026, 1, 5, 10, 0)).build();

        when(appointmentService.getAppointmentsByShopId(eq(1L), any()))
                .thenReturn(new PageImpl<>(List.of(appointment), PageRequest.of(0, 500), 1));
        when(appointmentMapper.appointmentToDto(appointment)).thenReturn(dto);

        mockMvc.perform(get("/api/appointments").param("shopId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].customerName").value("Alex"));
    }

    @Test
    void getAppointmentById_shouldReturnAppointment() throws Exception {
        Appointment appointment = new Appointment();
        appointment.setId(2L);
        AppointmentDto dto = AppointmentDto.builder().id(2L).customerName("Jamie").build();

        when(appointmentService.getAppointmentById(2L)).thenReturn(appointment);
        when(appointmentMapper.appointmentToDto(appointment)).thenReturn(dto);

        mockMvc.perform(get("/api/appointments/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.customerName").value("Jamie"));
    }
}
