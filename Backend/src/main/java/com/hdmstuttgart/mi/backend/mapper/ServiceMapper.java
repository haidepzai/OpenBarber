package com.hdmstuttgart.mi.backend.mapper;

import com.hdmstuttgart.mi.backend.model.Service;
import com.hdmstuttgart.mi.backend.model.dto.ServiceDto;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class ServiceMapper {

    private final ModelMapper modelMapper;

    public ServiceMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public ServiceDto toDto(Service service) {
        return modelMapper.map(service, ServiceDto.class);
    }

    public Service toEntity(ServiceDto serviceDto) {
        return modelMapper.map(serviceDto, Service.class);
    }
}