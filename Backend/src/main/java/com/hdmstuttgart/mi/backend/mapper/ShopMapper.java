package com.hdmstuttgart.mi.backend.mapper;

import com.hdmstuttgart.mi.backend.model.Shop;
import com.hdmstuttgart.mi.backend.model.dto.ShopDto;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ShopMapper {

    public ShopDto toDto(Shop shop) {
        ShopDto dto = new ShopDto();
        dto.setId(shop.getId());
        dto.setName(shop.getName());
        dto.setOwner(shop.getOwner());
        dto.setAddress(shop.getAddress());
        dto.setAddressLongitude(shop.getAddressLongitude());
        dto.setAddressLatitude(shop.getAddressLatitude());
        dto.setEmail(shop.getEmail());
        if (shop.getLogo() != null) {
            dto.setLogo(Base64.getEncoder().encodeToString(shop.getLogo()));
        }
        if (shop.getPictures() != null) {
            dto.setPictures(shop.getPictures().stream()
                    .map(bytes -> Base64.getEncoder().encodeToString(bytes))
                    .collect(Collectors.toList()));
        }
        dto.setPhoneNumber(shop.getPhoneNumber());
        dto.setOpeningTime(shop.getOpeningTime());
        dto.setClosingTime(shop.getClosingTime());
        dto.setOpeningDays(shop.getOpeningDays());
        dto.setWebsite(shop.getWebsite());
        dto.setRecommended(shop.isRecommended());
        dto.setApproved(shop.isApproved());
        dto.setPriceCategory(shop.getPriceCategory());
        dto.setPaymentMethods(shop.getPaymentMethods());
        dto.setDrinks(shop.getDrinks());
        dto.setServices(shop.getServices());
        dto.setEmployees(shop.getEmployees());
        dto.setReviews(shop.getReviews());
        return dto;
    }

    /** Lightweight DTO for list views — excludes pictures binary data, but includes logo for card display. */
    public ShopDto toSummaryDto(Shop shop) {
        ShopDto dto = new ShopDto();
        dto.setId(shop.getId());
        dto.setName(shop.getName());
        dto.setOwner(shop.getOwner());
        dto.setAddress(shop.getAddress());
        dto.setAddressLongitude(shop.getAddressLongitude());
        dto.setAddressLatitude(shop.getAddressLatitude());
        dto.setEmail(shop.getEmail());
        if (shop.getLogo() != null) {
            dto.setLogo(Base64.getEncoder().encodeToString(shop.getLogo()));
        }
        dto.setPhoneNumber(shop.getPhoneNumber());
        dto.setOpeningTime(shop.getOpeningTime());
        dto.setClosingTime(shop.getClosingTime());
        dto.setOpeningDays(shop.getOpeningDays());
        dto.setWebsite(shop.getWebsite());
        dto.setRecommended(shop.isRecommended());
        dto.setApproved(shop.isApproved());
        dto.setPriceCategory(shop.getPriceCategory());
        dto.setPaymentMethods(shop.getPaymentMethods());
        dto.setDrinks(shop.getDrinks());
        dto.setServices(shop.getServices());
        dto.setEmployees(shop.getEmployees());
        dto.setReviews(shop.getReviews());
        return dto;
    }

    public List<ShopDto> toDtos(List<Shop> shops) {
        return shops.stream().map(this::toDto).collect(Collectors.toList());
    }

    public Shop toEntity(ShopDto dto) {
        Shop shop = new Shop();
        shop.setId(dto.getId());
        shop.setName(dto.getName());
        shop.setOwner(dto.getOwner());
        shop.setAddress(dto.getAddress());
        shop.setAddressLongitude(dto.getAddressLongitude());
        shop.setAddressLatitude(dto.getAddressLatitude());
        shop.setEmail(dto.getEmail());
        shop.setPhoneNumber(dto.getPhoneNumber());
        shop.setWebsite(dto.getWebsite());
        shop.setOpeningTime(dto.getOpeningTime());
        shop.setClosingTime(dto.getClosingTime());
        shop.setOpeningDays(dto.getOpeningDays());
        shop.setReviews(dto.getReviews());
        shop.setRecommended(dto.isRecommended());
        shop.setApproved(dto.isApproved());
        shop.setPriceCategory(dto.getPriceCategory());
        shop.setPaymentMethods(dto.getPaymentMethods());
        shop.setDrinks(dto.getDrinks());
        shop.setServices(dto.getServices());
        shop.setEmployees(dto.getEmployees());
        return shop;
    }

}