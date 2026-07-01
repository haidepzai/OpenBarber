package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.Service;
import com.hdmstuttgart.mi.backend.model.Shop;
import com.hdmstuttgart.mi.backend.model.enums.ServiceTargetAudience;
import com.hdmstuttgart.mi.backend.repository.ServiceRepository;
import com.hdmstuttgart.mi.backend.repository.ShopRepository;
import com.hdmstuttgart.mi.backend.service.impl.ServiceServiceImpl;
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
public class ServiceServiceTest {

    @Mock
    private ServiceRepository serviceRepository;
    @Mock
    private ShopRepository shopRepository;
    @InjectMocks
    private ServiceServiceImpl serviceService;

    @Test
    void createService_shouldSaveServiceWithShop() {
        final Shop shop = Shop.builder().id(1L).name("Shop").build();
        final Service service = Service.builder().title("Cut").price(25).durationInMin(30).build();

        when(shopRepository.findById(1L)).thenReturn(Optional.of(shop));
        when(serviceRepository.save(service)).thenReturn(service);

        final Service result = serviceService.createService(service, 1L);

        assertThat(result).isSameAs(service);
        assertThat(service.getShop()).isEqualTo(shop);
        verify(serviceRepository).save(service);
    }

    @Test
    void createService_shouldThrowWhenShopMissing() {
        when(shopRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> serviceService.createService(Service.builder().build(), 1L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatus()).isEqualTo(HttpStatus.NOT_FOUND));

        verify(serviceRepository, never()).save(any());
    }

    @Test
    void getServicesByShopId_shouldReturnServices() {
        final List<Service> services = List.of(Service.builder().id(1L).title("Cut").build());
        when(shopRepository.existsById(1L)).thenReturn(true);
        when(serviceRepository.findAllByShopId(1L)).thenReturn(services);

        final List<Service> result = serviceService.getServicesByShopId(1L);

        assertThat(result).containsExactlyElementsOf(services);
        verify(serviceRepository).findAllByShopId(1L);
    }

    @Test
    void getServicesByShopId_shouldThrowWhenShopMissing() {
        when(shopRepository.existsById(1L)).thenReturn(false);

        assertThatThrownBy(() -> serviceService.getServicesByShopId(1L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatus()).isEqualTo(HttpStatus.NOT_FOUND));
    }

    @Test
    void getServiceById_shouldReturnService() {
        final Service service = Service.builder().id(2L).title("Cut").build();
        when(serviceRepository.findById(2L)).thenReturn(Optional.of(service));

        final Service result = serviceService.getServiceById(2L);

        assertThat(result).isEqualTo(service);
    }

    @Test
    void getServiceById_shouldThrowWhenMissing() {
        when(serviceRepository.findById(2L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> serviceService.getServiceById(2L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatus()).isEqualTo(HttpStatus.NOT_FOUND));
    }

    @Test
    void updateService_shouldUpdateMutableFields() {
        final Service existing = Service.builder().id(3L).title("Cut").price(20).durationInMin(30).targetAudience(ServiceTargetAudience.MEN).build();
        final Service update = Service.builder().title("Deluxe Cut").price(35).durationInMin(45).targetAudience(ServiceTargetAudience.ALL).build();

        when(serviceRepository.findById(3L)).thenReturn(Optional.of(existing));
        when(serviceRepository.save(existing)).thenReturn(existing);

        final Service result = serviceService.updateService(3L, update);

        assertThat(result.getTitle()).isEqualTo("Deluxe Cut");
        assertThat(result.getPrice()).isEqualTo(35);
        assertThat(result.getDurationInMin()).isEqualTo(45);
        assertThat(result.getTargetAudience()).isEqualTo(ServiceTargetAudience.ALL);
        verify(serviceRepository).save(existing);
    }

    @Test
    void updateService_shouldThrowWhenMissing() {
        when(serviceRepository.findById(3L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> serviceService.updateService(3L, Service.builder().build()))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatus()).isEqualTo(HttpStatus.NOT_FOUND));

        verify(serviceRepository, never()).save(any());
    }

    @Test
    void deleteService_shouldDeleteExistingService() {
        when(serviceRepository.existsById(4L)).thenReturn(true);

        serviceService.deleteService(4L);

        verify(serviceRepository).deleteById(4L);
    }

    @Test
    void deleteService_shouldThrowWhenMissing() {
        when(serviceRepository.existsById(4L)).thenReturn(false);

        assertThatThrownBy(() -> serviceService.deleteService(4L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatus()).isEqualTo(HttpStatus.NOT_FOUND));

        verify(serviceRepository, never()).deleteById(anyLong());
    }
}
