package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.BackendApplication;
import com.hdmstuttgart.mi.backend.model.Shop;
import com.hdmstuttgart.mi.backend.model.Service;
import com.hdmstuttgart.mi.backend.repository.ShopRepository;
import com.hdmstuttgart.mi.backend.repository.ServiceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * The type Service service.
 */
@org.springframework.stereotype.Service
public class ServiceService {

    private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);
    private final ServiceRepository serviceRepository;
    private final ShopRepository shopRepository;

    /**
     * Instantiates a new Service service.
     *
     * @param serviceRepository    the service repository
     * @param shopRepository the shop repository
     */
    public ServiceService(ServiceRepository serviceRepository, ShopRepository shopRepository) {
        this.serviceRepository = serviceRepository;
        this.shopRepository = shopRepository;
    }

    /**
     * Create service service.
     *
     * @param service      the service
     * @param shopId the shop id
     * @return the service
     */
    public Service createService(Service service, Long shopId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found with id = " + shopId));
        service.setShop(shop);
        return serviceRepository.save(service);
    }

    /**
     * Gets services by shop id.
     *
     * @param shopId the shop id
     * @return the services by shop id
     */
    public List<Service> getServicesByShopId(Long shopId) {
        if (!shopRepository.existsById(shopId)) {
            log.warn("Shop not foundM");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found with id = " + shopId);
        }

        return serviceRepository.findAllByShopId(shopId);
    }

    /**
     * Gets service by id.
     *
     * @param id the id
     * @return the service by id
     */
    public Service getServiceById(long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found with id = " + id));
    }

    /**
     * Update service service.
     *
     * @param id         the id
     * @param newService the new service
     * @return the service
     */
    public Service updateService(long id, Service newService) {
        return serviceRepository.findById(id)
                .map(service -> {
                    service.setPrice(newService.getPrice());
                    service.setTitle(newService.getTitle());
                    service.setDurationInMin(newService.getDurationInMin());
                    service.setTargetAudience(newService.getTargetAudience());

                    return serviceRepository.save(service);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found with id = " + id));
    }

    /**
     * Delete service.
     *
     * @param id the id
     */
    public void deleteService(long id) {
        if (!serviceRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found with id = " + id);
        }
        serviceRepository.deleteById(id);
    }

    /**
     * Delete service from shop.
     *
     * @param id           the id
     * @param shopId the shop id
     */
    public void deleteServiceFromShop(long id, long shopId) {
        if (!serviceRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found with id = " + id);
        }
        List<Service> services = getServicesByShopId(shopId);
        services.stream().filter(service -> id == service.getId()).findAny().ifPresent(serviceToDelete -> serviceRepository.deleteById(serviceToDelete.getId()));
    }
}
