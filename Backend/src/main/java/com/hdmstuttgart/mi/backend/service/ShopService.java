package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.exception.UnauthorizedException;
import com.hdmstuttgart.mi.backend.exception.UserNotFoundException;
import com.hdmstuttgart.mi.backend.model.Shop;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.enums.Drink;
import com.hdmstuttgart.mi.backend.model.enums.PaymentMethod;
import com.hdmstuttgart.mi.backend.model.enums.UserRole;
import com.hdmstuttgart.mi.backend.repository.ShopRepository;
import com.hdmstuttgart.mi.backend.repository.ServiceRepository;
import com.hdmstuttgart.mi.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.*;
import java.util.stream.Collectors;

/**
 * The type Shop service.
 */
@Service
@RequiredArgsConstructor
public class ShopService {

    private static final Logger log = LoggerFactory.getLogger(ShopService.class);
    private final ShopRepository shopRepository;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;

    /**
     * Create shop shop.
     *
     * @param request the request
     * @param token   the token
     * @return the shop
     */
    public Shop createShop(Shop request, String token) {
        String username = jwtService.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        byte[] logo = null;
        List<byte[]> pictures = new ArrayList<>();
        Set<PaymentMethod> paymentMethods = null;
        Set<Drink> drinks = null;
        List<com.hdmstuttgart.mi.backend.model.Service> services = new ArrayList<>();
        List<Employee> employees = new ArrayList<>();

        if (request.getLogo() != null) {
            logo = request.getLogo();
        }
        if (request.getPictures() != null) {
            pictures.addAll(request.getPictures());
        }
        if (request.getDrinks() != null) {
            drinks = request.getDrinks()
                    .stream()
                    .map(drinkName -> Drink.valueOf(drinkName.name()))
                    .collect(Collectors.toSet());
        }
        if (request.getPaymentMethods() != null) {
            paymentMethods = request.getPaymentMethods()
                    .stream()
                    .map(method -> PaymentMethod.valueOf(method.name()))
                    .collect(Collectors.toSet());
        }
        if (request.getServices() != null) {
            for (com.hdmstuttgart.mi.backend.model.Service serviceRequest : request.getServices()) {
                var service = com.hdmstuttgart.mi.backend.model.Service.builder()
                        .price(serviceRequest.getPrice())
                        .title(serviceRequest.getTitle())
                        .durationInMin(serviceRequest.getDurationInMin())
                        .targetAudience(serviceRequest.getTargetAudience())
                        .build();
                services.add(service);
            }
        }
        if (request.getEmployees() != null) {
            for (Employee employeeRequest : request.getEmployees()) {
                byte[] picture = null;
                if (employeeRequest.getPicture() != null) {
                    picture = employeeRequest.getPicture();
                }
                var employee = Employee.builder()
                        .name(employeeRequest.getName())
                        .title(employeeRequest.getTitle())
                        .picture(picture)
                        .build();
                employees.add(employee);
            }
        }
        Shop shop = Shop.builder()
            .name(request.getName())
            .owner(request.getOwner())
            .email(request.getEmail())
            .addressLatitude(request.getAddressLatitude())
            .addressLongitude(request.getAddressLongitude())
            .address(request.getAddress())
            .logo(logo)
            .pictures(pictures)
            .phoneNumber(request.getPhoneNumber())
            .openingTime(request.getOpeningTime())
            .closingTime(request.getClosingTime())
            .website(request.getWebsite())
            .reviews(request.getReviews())
            .recommended(request.isRecommended())
            .approved(request.isApproved())
            .priceCategory(request.getPriceCategory())
            .paymentMethods(paymentMethods)
            .drinks(drinks)
            .services(services)
            .employees(employees)
            .build();
        user.setShop(shop);
        if (user.getRole() == UserRole.VERIFIED) {
            user.setRole(UserRole.OPERATOR);
        }
        return userRepository.save(user).getShop();
    }

    /**
     * Gets all shops.
     *
     * @return the all shops
     */
    public Page<Shop> getAllShops(Pageable pageable) {
        return shopRepository.findAll(pageable);
    }

    public Page<Shop> getShopsWithinRadius(double lat, double lng, double radius, Pageable pageable) {
        return shopRepository.findWithinRadius(lat, lng, radius, pageable);
    }

    /**
     * Gets shop by id.
     *
     * @param id the id
     * @return the shop by id
     */
    public Shop getShopById(long id) {
        return shopRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found with id = " + id));
    }

    /**
     * Gets shop by email.
     *
     * @param email the email
     * @return the shop by email
     */
    public Shop getShopByEmail(String email) {
        return shopRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found with email = " + email));
    }

    /**
     * Gets shop by user.
     *
     * @param token the token
     * @return the shop by user
     */
    public Shop getShopByUser(String token) {
        String username = jwtService.extractUsername(token.substring(7));

        User user = userRepository.findByEmail(username)
                .orElseThrow();

        return user.getShop();
    }

    /**
     * Update shop shop.
     *
     * @param id            the id
     * @param newShop the new shop
     * @param token         the token
     * @return the shop
     */
    public Shop updateShop(long id, Shop newShop, String token) {
        String username = jwtService.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        if (user.getShop().getId() != id) {
            throw new UnauthorizedException("Not allowed to update shop");
        }
        return shopRepository.findById(id)
                .map(shop -> {
                    shop.setName(newShop.getName());
                    shop.setAddress(newShop.getAddress());
                    shop.setAddressLongitude(newShop.getAddressLongitude());
                    shop.setAddressLatitude(newShop.getAddressLatitude());
                    shop.setEmail(newShop.getEmail());
                    //shop.setLogo(newShop.getLogo());
                    //shop.setPictures(newShop.getPictures());
                    shop.setWebsite(newShop.getWebsite());
                    shop.setPhoneNumber(newShop.getPhoneNumber());
                    shop.setApproved(newShop.isApproved());
                    shop.setPriceCategory(newShop.getPriceCategory());
                    shop.setOpeningTime(newShop.getOpeningTime());
                    shop.setClosingTime(newShop.getClosingTime());
                    shop.setOpeningDays(newShop.getOpeningDays());

                    // Update Payment Methods
                    if (newShop.getPaymentMethods() != null) {
                        Set<PaymentMethod> paymentMethodsSet = newShop.getPaymentMethods()
                                .stream()
                                .map(paymentMethod -> PaymentMethod.valueOf(paymentMethod.toString()))
                                .collect(Collectors.toSet());

                        // Set paymentMethods in Shop entity
                        shop.setPaymentMethods(paymentMethodsSet);
                    }


                    // Update Drinks
                    if (newShop.getDrinks() != null) {
                        Set<Drink> drinksSet = newShop.getDrinks()
                                .stream()
                                .map(drinks -> Drink.valueOf(drinks.name()))
                                .collect(Collectors.toSet());

                        shop.setDrinks(drinksSet);
                    }

                    // Update services
                    if (newShop.getServices() != null) {
                        List<com.hdmstuttgart.mi.backend.model.Service> services = new ArrayList<>();
                        for (com.hdmstuttgart.mi.backend.model.Service serviceRequest : newShop.getServices()) {
                            com.hdmstuttgart.mi.backend.model.Service service = new com.hdmstuttgart.mi.backend.model.Service();
                            service.setId(serviceRequest.getId());
                            service.setTitle(serviceRequest.getTitle());
                            service.setPrice(serviceRequest.getPrice());
                            service.setTargetAudience(serviceRequest.getTargetAudience());
                            service.setDurationInMin(serviceRequest.getDurationInMin());
                            service.setShop(shop);
                            services.add(service);
                        }
                        shop.setServices(services);
                    }

                    // Update employees
                    if (newShop.getEmployees() != null) {
                        List<Employee> employees = new ArrayList<>();
                        for (Employee employeeRequest : newShop.getEmployees()) {
                            Employee employee = new Employee();
                            employee.setName(employeeRequest.getName());
                            employee.setShop(shop);
                            byte[] picture = null;
                            if (employeeRequest.getPicture() != null) {
                                picture = employeeRequest.getPicture();
                            }
                            employee.setPicture(picture);
                            employee.setTitle(employeeRequest.getTitle());
                        }
                        shop.setEmployees(employees);
                    }

                    return shopRepository.save(shop);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found with id = " + id));
    }

    /**
     * Patch shop shop.
     *
     * @param updatedShop the updated shop
     * @param token             the token
     * @return the shop
     */
    public Shop patchShop(Shop updatedShop, String token) {
        String username = jwtService.extractUsername(token.substring(7));

        User user = userRepository.findByEmail(username)
                .orElseThrow();

        Shop existingShop = user.getShop();

        Field[] fields = Shop.class.getDeclaredFields();

        for (Field field : fields) {
            try {
                field.setAccessible(true);
                Object newValue = field.get(updatedShop);
                if (newValue != null) {
                    field.set(existingShop, newValue);
                }
            } catch (IllegalAccessException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to update field: " + field.getName());

            }
        }

        return shopRepository.save(existingShop);
    }

    /**
     * Delete shop.
     *
     * @param id the id
     */
    public Shop uploadLogo(Long id, MultipartFile file, String token) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));
        authorizeShopAccess(shop, token);
        try {
            shop.setLogo(file.getBytes());
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to process image");
        }
        return shopRepository.save(shop);
    }

    public Shop deleteLogo(Long id, String token) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));
        authorizeShopAccess(shop, token);
        shop.setLogo(null);
        return shopRepository.save(shop);
    }

    public Shop uploadPictures(Long id, List<MultipartFile> files, String token) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));
        authorizeShopAccess(shop, token);
        List<byte[]> pictures = new ArrayList<>();
        if (shop.getPictures() != null) {
            pictures.addAll(shop.getPictures());
        }
        for (MultipartFile file : files) {
            try {
                pictures.add(file.getBytes());
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to process image");
            }
        }
        shop.setPictures(pictures);
        return shopRepository.save(shop);
    }

    public Shop deletePicture(Long id, int index, String token) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));
        authorizeShopAccess(shop, token);
        List<byte[]> pictures = shop.getPictures() == null ? new ArrayList<>() : new ArrayList<>(shop.getPictures());
        if (index < 0 || index >= pictures.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid picture index");
        }
        pictures.remove(index);
        shop.setPictures(pictures);
        return shopRepository.save(shop);
    }

    private void authorizeShopAccess(Shop shop, String token) {
        String username = jwtService.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException(username));
        if (user.getShop() == null || !user.getShop().getId().equals(shop.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
    }

    public void deleteShop(long id) {
        if (!shopRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found with id = " + id);
        }
        shopRepository.deleteById(id);
    }
}
