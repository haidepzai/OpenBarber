package com.hdmstuttgart.mi.backend.mapper;

import com.hdmstuttgart.mi.backend.model.Service;
import com.hdmstuttgart.mi.backend.model.dto.ServiceDto;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

/**
 * The type Service mapper.
 */
@Component
public class ServiceMapper {

    private final ModelMapper modelMapper;

    /**
     * Instantiates a new Service mapper.
     *
     * @param modelMapper the model mapper
     */
    public ServiceMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    /**
     * To dto service dto.
     *
     * @param service the service
     * @return the service dto
     */
    public ServiceDto toDto(Service service) {
        return modelMapper.map(service, ServiceDto.class);
    }

    /**
     * To entity service.
     *
     * @param serviceDto the service dto
     * @return the service
     */
    public Service toEntity(ServiceDto serviceDto) {
        return modelMapper.map(serviceDto, Service.class);
    }
}