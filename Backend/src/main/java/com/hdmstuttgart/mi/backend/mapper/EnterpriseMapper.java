package com.hdmstuttgart.mi.backend.mapper;

import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.dto.EnterpriseDto;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class EnterpriseMapper {

    public EnterpriseDto toDto(Enterprise enterprise) {
        EnterpriseDto dto = new EnterpriseDto();
        dto.setName(enterprise.getName());
        dto.setOwner(enterprise.getOwner());
        dto.setAddress(enterprise.getAddress());
        dto.setAddressLongitude(enterprise.getAddressLongitude());
        dto.setAddressLatitude(enterprise.getAddressLatitude());
        dto.setEmail(enterprise.getEmail());

        // Convert byte[] logo to MultipartFile
        if (enterprise.getLogo() != null) {
            ByteArrayResource logoResource = new ByteArrayResource(enterprise.getLogo());
            dto.setLogo(new MockMultipartFile("logo", logoResource.getByteArray()));
        }

        // Convert List<byte[]> pictures to List<MultipartFile>
        if (enterprise.getPictures() != null) {
            List<MultipartFile> pictures = new ArrayList<>();
            for (byte[] picture : enterprise.getPictures()) {
                ByteArrayResource pictureResource = new ByteArrayResource(picture);
                pictures.add(new MockMultipartFile("picture", pictureResource.getByteArray()));
            }
            dto.setPictures(pictures);
        }

        dto.setPhoneNumber(enterprise.getPhoneNumber());
        dto.setOpeningTime(enterprise.getOpeningTime());
        dto.setClosingTime(enterprise.getClosingTime());
        dto.setWebsite(enterprise.getWebsite());
        dto.setRecommended(enterprise.isRecommended());
        dto.setApproved(enterprise.isApproved());
        dto.setPriceCategory(enterprise.getPriceCategory());
        dto.setPaymentMethods(enterprise.getPaymentMethods());
        dto.setDrinks(enterprise.getDrinks());
        dto.setServices(enterprise.getServices());
        dto.setEmployees(enterprise.getEmployees());
        dto.setReviews(enterprise.getReviews());
        return dto;
    }

    public List<EnterpriseDto> toDtos(List<Enterprise> enterprises) {
        List<EnterpriseDto> enterpriseDtos = new ArrayList<>();
        for (Enterprise enterprise : enterprises) {
            enterpriseDtos.add(toDto(enterprise));
        }
        return enterpriseDtos;
    }

    public Enterprise toEntity(EnterpriseDto dto) {
        Enterprise enterprise = new Enterprise();
        enterprise.setName(dto.getName());
        enterprise.setOwner(dto.getOwner());
        enterprise.setAddress(dto.getAddress());
        enterprise.setAddressLongitude(dto.getAddressLongitude());
        enterprise.setAddressLatitude(dto.getAddressLatitude());
        enterprise.setEmail(dto.getEmail());

        // Convert MultipartFile logo to byte[]
        try {
            if (dto.getLogo() != null) {
                byte[] logo = dto.getLogo().getBytes();
                enterprise.setLogo(logo);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to convert logo to byte[]: " + e.getMessage(), e);
        }

        // Convert List<MultipartFile> pictures to List<byte[]>
        if (dto.getPictures() != null) {
            List<byte[]> pictures = new ArrayList<>();
            for (MultipartFile picture : dto.getPictures()) {
                try {
                    byte[] pictureBytes = picture.getBytes();
                    pictures.add(pictureBytes);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to convert picture to byte[]: " + e.getMessage(), e);
                }
            }
            enterprise.setPictures(pictures);
        }
        enterprise.setPhoneNumber(dto.getPhoneNumber());
        enterprise.setWebsite(dto.getWebsite());
        enterprise.setOpeningTime(dto.getOpeningTime());
        enterprise.setClosingTime(dto.getClosingTime());
        enterprise.setReviews(dto.getReviews());
        enterprise.setRecommended(dto.isRecommended());
        enterprise.setApproved(dto.isApproved());
        enterprise.setPriceCategory(dto.getPriceCategory());
        enterprise.setPaymentMethods(dto.getPaymentMethods());
        enterprise.setDrinks(dto.getDrinks());
        enterprise.setLogo(convertMultipartFileToBytes(dto.getLogo()));
        enterprise.setPictures(convertMultipartFilesToBytesList(dto.getPictures()));
        enterprise.setServices(dto.getServices());
        enterprise.setEmployees(dto.getEmployees());
        return enterprise;
    }


    private byte[] convertMultipartFileToBytes(MultipartFile file) {
        if (file == null) {
            return null;
        }
        try {
            return file.getBytes();
        } catch (IOException e) {
            throw new RuntimeException("Error converting multipart file to bytes", e);
        }
    }


    private List<byte[]> convertMultipartFilesToBytesList(List<MultipartFile> files) {
        if (files == null) {
            return null;
        }
        return files.stream().map(this::convertMultipartFileToBytes).collect(Collectors.toList());
    }

}