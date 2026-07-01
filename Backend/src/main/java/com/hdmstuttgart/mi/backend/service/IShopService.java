package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.Shop;
import com.hdmstuttgart.mi.backend.model.dto.ShopFilterParams;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IShopService {
    Shop createShop(Shop request, String token);

    Page<Shop> getAllShops(Pageable pageable);

    Page<Shop> getFilteredShops(ShopFilterParams params, Pageable pageable);

    Page<Shop> getShopsWithinRadius(double lat, double lng, double radius, Pageable pageable);

    Page<Shop> getFilteredShopsWithinRadius(double lat, double lng, double radius, ShopFilterParams params, Pageable pageable);

    Shop getShopById(long id);

    Shop getShopByEmail(String email);

    Shop getShopByUser(String token);

    Shop updateShop(long id, Shop newShop, String token);

    Shop patchShop(Shop updatedShop, String token);

    Shop uploadLogo(Long id, MultipartFile file, String token);

    Shop deleteLogo(Long id, String token);

    Shop uploadPictures(Long id, List<MultipartFile> files, String token);

    Shop deletePicture(Long id, int index, String token);

    void deleteShop(long id);
}
