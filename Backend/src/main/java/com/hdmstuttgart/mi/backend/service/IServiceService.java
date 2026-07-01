package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.Service;

import java.util.List;

public interface IServiceService {
    Service createService(Service service, Long shopId);

    List<Service> getServicesByShopId(Long shopId);

    Service getServiceById(long id);

    Service updateService(long id, Service newService);

    void deleteService(long id);

    void deleteServiceFromShop(long id, long shopId);
}
