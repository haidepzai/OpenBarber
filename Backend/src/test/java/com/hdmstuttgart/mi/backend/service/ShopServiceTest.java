package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.Shop;
import com.hdmstuttgart.mi.backend.model.dto.ShopFilterParams;
import com.hdmstuttgart.mi.backend.repository.ServiceRepository;
import com.hdmstuttgart.mi.backend.repository.ShopRepository;
import com.hdmstuttgart.mi.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ShopServiceTest {

    @Mock
    private ShopRepository shopRepository;
    @Mock
    private JwtService jwtService;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ServiceRepository serviceRepository;
    @Mock
    private AppointmentService appointmentService;
    @InjectMocks
    private ShopService shopService;

    @Test
    void getFilteredShops_withoutAvailabilityFilter_shouldDelegateToRepositoryPageQuery() {
        Pageable pageable = PageRequest.of(0, 2);
        ShopFilterParams params = ShopFilterParams.builder().priceCategory(List.of(1)).build();
        Page<Shop> page = new PageImpl<>(List.of(Shop.builder().id(1L).name("A").build()), pageable, 1);

        when(shopRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class), eq(pageable))).thenReturn(page);

        Page<Shop> result = shopService.getFilteredShops(params, pageable);

        assertThat(result).isEqualTo(page);
        verify(shopRepository).findAll(any(org.springframework.data.jpa.domain.Specification.class), eq(pageable));
        verify(shopRepository, never()).findAll(any(org.springframework.data.jpa.domain.Specification.class));
    }

    @Test
    void getFilteredShops_withAvailabilityFilter_shouldReturnOnlyAvailableShops() {
        Pageable pageable = PageRequest.of(0, 10);
        LocalDate date = LocalDate.of(2026, 1, 5);
        Shop available = Shop.builder().id(1L).name("Available").build();
        Shop unavailable = Shop.builder().id(2L).name("Unavailable").build();
        ShopFilterParams params = ShopFilterParams.builder().availableDate(date).availableFromTime("10:00").build();

        when(shopRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class))).thenReturn(List.of(available, unavailable));
        when(appointmentService.hasAnyFreeSlot(available, date, "10:00", 30)).thenReturn(true);
        when(appointmentService.hasAnyFreeSlot(unavailable, date, "10:00", 30)).thenReturn(false);

        Page<Shop> result = shopService.getFilteredShops(params, pageable);

        assertThat(result.getContent()).containsExactly(available);
        assertThat(result.getTotalElements()).isEqualTo(1);
        verify(shopRepository).findAll(any(org.springframework.data.jpa.domain.Specification.class));
        verify(shopRepository, never()).findAll(any(org.springframework.data.jpa.domain.Specification.class), eq(pageable));
    }

    @Test
    void getShopById_shouldReturnShop() {
        Shop shop = Shop.builder().id(1L).name("Shop").build();
        when(shopRepository.findById(1L)).thenReturn(Optional.of(shop));

        Shop result = shopService.getShopById(1L);

        assertThat(result).isEqualTo(shop);
    }

    @Test
    void getShopById_shouldThrowWhenMissing() {
        when(shopRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> shopService.getShopById(1L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatus()).isEqualTo(HttpStatus.NOT_FOUND));
    }

    @Test
    void getFilteredShops_shouldPaginateAvailabilityResults() {
        Pageable pageable = PageRequest.of(1, 1);
        LocalDate date = LocalDate.of(2026, 1, 5);
        Shop first = Shop.builder().id(1L).name("First").build();
        Shop second = Shop.builder().id(2L).name("Second").build();
        Shop third = Shop.builder().id(3L).name("Third").build();
        ShopFilterParams params = ShopFilterParams.builder().availableDate(date).availableFromTime("09:00").build();

        when(shopRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class))).thenReturn(List.of(first, second, third));
        when(appointmentService.hasAnyFreeSlot(any(Shop.class), eq(date), eq("09:00"), eq(30))).thenReturn(true);

        Page<Shop> result = shopService.getFilteredShops(params, pageable);

        assertThat(result.getContent()).containsExactly(second);
        assertThat(result.getTotalElements()).isEqualTo(3);
    }
}
