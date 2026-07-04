package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.config.JwtAuthenticationFilter;
import com.hdmstuttgart.mi.backend.config.RateLimitFilter;
import com.hdmstuttgart.mi.backend.mapper.ShopMapper;
import com.hdmstuttgart.mi.backend.model.Shop;
import com.hdmstuttgart.mi.backend.model.dto.ShopDto;
import com.hdmstuttgart.mi.backend.model.dto.SlotDto;
import com.hdmstuttgart.mi.backend.service.IAppointmentService;
import com.hdmstuttgart.mi.backend.service.IJwtService;
import com.hdmstuttgart.mi.backend.service.IShopService;
import com.hdmstuttgart.mi.backend.service.IUserService;
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

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ShopController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ShopControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IShopService shopService;
    @MockBean
    private IAppointmentService appointmentService;
    @MockBean
    private IUserService userService;
    @MockBean
    private IJwtService jwtService;
    @MockBean
    private ShopMapper shopMapper;
    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockBean
    private UserDetailsService userDetailsService;
    @MockBean
    private AuthenticationProvider authenticationProvider;
    @MockBean
    private RateLimitFilter rateLimitFilter;

    @Test
    void getShops_shouldReturnPagedResponse() throws Exception {
        Shop shop = Shop.builder().id(1L).name("OpenBarber").build();
        ShopDto dto = ShopDto.builder().id(1L).name("OpenBarber").build();
        when(shopService.getFilteredShops(any(), any())).thenReturn(new PageImpl<>(List.of(shop), PageRequest.of(0, 12), 1));
        when(shopMapper.toSummaryDto(shop)).thenReturn(dto);

        mockMvc.perform(get("/api/shops"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].name").value("OpenBarber"));
    }

    @Test
    void getShopsWithinRadius_shouldReturnPagedResponse() throws Exception {
        Shop shop = Shop.builder().id(2L).name("Nearby").build();
        ShopDto dto = ShopDto.builder().id(2L).name("Nearby").build();
        when(shopService.getFilteredShopsWithinRadius(eq(48.0), eq(9.0), eq(5.0), any(), any()))
                .thenReturn(new PageImpl<>(List.of(shop), PageRequest.of(0, 12), 1));
        when(shopMapper.toSummaryDto(shop)).thenReturn(dto);

        mockMvc.perform(get("/api/shops/within-radius")
                        .param("lat", "48.0")
                        .param("lng", "9.0")
                        .param("radius", "5.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(2))
                .andExpect(jsonPath("$.content[0].name").value("Nearby"));
    }

    @Test
    void getAvailableSlots_shouldReturnSlots() throws Exception {
        when(appointmentService.getAvailableSlots(1L, null, java.time.LocalDate.of(2026, 1, 5), 30))
                .thenReturn(List.of(new SlotDto("10:00", 7L, "Alex", null)));

        mockMvc.perform(get("/api/shops/1/available-slots")
                        .param("date", "2026-01-05")
                        .param("serviceDuration", "30"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].time").value("10:00"))
                .andExpect(jsonPath("$[0].employeeId").value(7))
                .andExpect(jsonPath("$[0].employeeName").value("Alex"));
    }
}
