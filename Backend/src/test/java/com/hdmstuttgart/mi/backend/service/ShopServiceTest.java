package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.Shop;
import com.hdmstuttgart.mi.backend.model.dto.ShopFilterParams;
import com.hdmstuttgart.mi.backend.repository.ServiceRepository;
import com.hdmstuttgart.mi.backend.repository.ShopRepository;
import com.hdmstuttgart.mi.backend.repository.UserRepository;
import com.hdmstuttgart.mi.backend.service.impl.ShopServiceImpl;
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
    private IJwtService jwtService;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ServiceRepository serviceRepository;
    @Mock
    private IAppointmentService appointmentService;
    @InjectMocks
    private ShopServiceImpl shopService;

    @Test
    void getFilteredShops_withoutAvailabilityFilter_shouldDelegateToRepositoryPageQuery() {
        final Pageable pageable = PageRequest.of(0, 2);
        final ShopFilterParams params = ShopFilterParams.builder().priceCategory(List.of(1)).build();
        final Page<Shop> page = new PageImpl<>(List.of(Shop.builder().id(1L).name("A").build()), pageable, 1);

        when(shopRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class), eq(pageable))).thenReturn(page);

        final Page<Shop> result = shopService.getFilteredShops(params, pageable);

        assertThat(result).isEqualTo(page);
        verify(shopRepository).findAll(any(org.springframework.data.jpa.domain.Specification.class), eq(pageable));
        verify(shopRepository, never()).findAll(any(org.springframework.data.jpa.domain.Specification.class));
    }

    @Test
    void getFilteredShops_withAvailabilityFilter_shouldReturnOnlyAvailableShops() {
        final Pageable pageable = PageRequest.of(0, 10);
        final LocalDate date = LocalDate.of(2026, 1, 5);
        final Shop available = Shop.builder().id(1L).name("Available").build();
        final Shop unavailable = Shop.builder().id(2L).name("Unavailable").build();
        final ShopFilterParams params = ShopFilterParams.builder().availableDate(date).availableFromTime("10:00").build();

        when(shopRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class))).thenReturn(List.of(available, unavailable));
        when(appointmentService.hasAnyFreeSlot(available, date, "10:00", 30)).thenReturn(true);
        when(appointmentService.hasAnyFreeSlot(unavailable, date, "10:00", 30)).thenReturn(false);

        final Page<Shop> result = shopService.getFilteredShops(params, pageable);

        assertThat(result.getContent()).containsExactly(available);
        assertThat(result.getTotalElements()).isEqualTo(1);
        verify(shopRepository).findAll(any(org.springframework.data.jpa.domain.Specification.class));
        verify(shopRepository, never()).findAll(any(org.springframework.data.jpa.domain.Specification.class), eq(pageable));
    }

    @Test
    void getShopById_shouldReturnShop() {
        final Shop shop = Shop.builder().id(1L).name("Shop").build();
        when(shopRepository.findById(1L)).thenReturn(Optional.of(shop));

        final Shop result = shopService.getShopById(1L);

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
        final Pageable pageable = PageRequest.of(1, 1);
        final LocalDate date = LocalDate.of(2026, 1, 5);
        final Shop first = Shop.builder().id(1L).name("First").build();
        final Shop second = Shop.builder().id(2L).name("Second").build();
        final Shop third = Shop.builder().id(3L).name("Third").build();
        final ShopFilterParams params = ShopFilterParams.builder().availableDate(date).availableFromTime("09:00").build();

        when(shopRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class))).thenReturn(List.of(first, second, third));
        when(appointmentService.hasAnyFreeSlot(any(Shop.class), eq(date), eq("09:00"), eq(30))).thenReturn(true);

        final Page<Shop> result = shopService.getFilteredShops(params, pageable);

        assertThat(result.getContent()).containsExactly(second);
        assertThat(result.getTotalElements()).isEqualTo(3);
    }
}
