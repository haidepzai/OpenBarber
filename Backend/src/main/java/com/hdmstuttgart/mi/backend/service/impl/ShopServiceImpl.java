package com.hdmstuttgart.mi.backend.service.impl;

import com.hdmstuttgart.mi.backend.exception.UnauthorizedException;
import com.hdmstuttgart.mi.backend.exception.UserNotFoundException;
import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.Shop;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.model.dto.ShopFilterParams;
import com.hdmstuttgart.mi.backend.model.enums.Drink;
import com.hdmstuttgart.mi.backend.model.enums.PaymentMethod;
import com.hdmstuttgart.mi.backend.model.enums.UserRole;
import com.hdmstuttgart.mi.backend.repository.ServiceRepository;
import com.hdmstuttgart.mi.backend.repository.ShopRepository;
import com.hdmstuttgart.mi.backend.repository.UserRepository;
import com.hdmstuttgart.mi.backend.service.IAppointmentService;
import com.hdmstuttgart.mi.backend.service.IJwtService;
import com.hdmstuttgart.mi.backend.service.IShopService;
import com.hdmstuttgart.mi.backend.specification.ShopSpecification;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * The type Shop service.
 */
@Service
@RequiredArgsConstructor
public class ShopServiceImpl implements IShopService {

    private static final Logger log = LoggerFactory.getLogger(ShopServiceImpl.class);
    private final ShopRepository shopRepository;
    private final IJwtService jwtService;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    @Lazy
    private final IAppointmentService appointmentService;

    /**
     * Create shop shop.
     *
     * @param request the request
     * @param token   the token
     * @return the shop
     */
    public Shop createShop(final Shop request, final String token) {
        final String username = jwtService.extractUsername(token.substring(7));
        final User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        byte[] logo = null;
        final List<byte[]> pictures = new ArrayList<>();
        Set<PaymentMethod> paymentMethods = null;
        Set<Drink> drinks = null;
        final List<com.hdmstuttgart.mi.backend.model.Service> services = new ArrayList<>();
        final List<Employee> employees = new ArrayList<>();

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
            for (final com.hdmstuttgart.mi.backend.model.Service serviceRequest : request.getServices()) {
                final var service = com.hdmstuttgart.mi.backend.model.Service.builder()
                        .price(serviceRequest.getPrice())
                        .title(serviceRequest.getTitle())
                        .durationInMin(serviceRequest.getDurationInMin())
                        .targetAudience(serviceRequest.getTargetAudience())
                        .build();
                services.add(service);
            }
        }
        if (request.getEmployees() != null) {
            for (final Employee employeeRequest : request.getEmployees()) {
                byte[] picture = null;
                if (employeeRequest.getPicture() != null) {
                    picture = employeeRequest.getPicture();
                }
                final var employee = Employee.builder()
                        .name(employeeRequest.getName())
                        .title(employeeRequest.getTitle())
                        .picture(picture)
                        .build();
                employees.add(employee);
            }
        }
        final Shop shop = Shop.builder()
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
    public Page<Shop> getAllShops(final Pageable pageable) {
        return getFilteredShops(null, pageable);
    }

    public Page<Shop> getFilteredShops(final ShopFilterParams params, final Pageable pageable) {
        if (params != null && params.getAvailableDate() != null) {
            return filterByAvailability(shopRepository.findAll(ShopSpecification.withFilters(params)), params, pageable);
        }
        return shopRepository.findAll(ShopSpecification.withFilters(params), pageable);
    }

    public Page<Shop> getShopsWithinRadius(final double lat, final double lng, final double radius, final Pageable pageable) {
        return getFilteredShopsWithinRadius(lat, lng, radius, null, pageable);
    }

    public Page<Shop> getFilteredShopsWithinRadius(final double lat, final double lng, final double radius, final ShopFilterParams params, final Pageable pageable) {
        final var spec = ShopSpecification.withinRadius(lat, lng, radius).and(ShopSpecification.withFilters(params));
        if (params != null && params.getAvailableDate() != null) {
            return filterByAvailability(shopRepository.findAll(spec), params, pageable);
        }
        return shopRepository.findAll(spec, pageable);
    }

    private Page<Shop> filterByAvailability(final List<Shop> shops, final ShopFilterParams params, final Pageable pageable) {
        final List<Shop> available = shops.stream()
                .filter(shop -> appointmentService.hasAnyFreeSlot(
                        shop,
                        params.getAvailableDate(),
                        params.getAvailableFromTime(),
                        30))
                .collect(Collectors.toList());
        final int start = (int) pageable.getOffset();
        final int end = Math.min(start + pageable.getPageSize(), available.size());
        final List<Shop> page = start >= available.size() ? List.of() : available.subList(start, end);
        return new PageImpl<>(page, pageable, available.size());
    }

    /**
     * Gets shop by id.
     *
     * @param id the id
     * @return the shop by id
     */
    public Shop getShopById(final long id) {
        return shopRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found with id = " + id));
    }

    /**
     * Gets shop by email.
     *
     * @param email the email
     * @return the shop by email
     */
    public Shop getShopByEmail(final String email) {
        return shopRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found with email = " + email));
    }

    /**
     * Gets shop by user.
     *
     * @param token the token
     * @return the shop by user
     */
    public Shop getShopByUser(final String token) {
        final String username = jwtService.extractUsername(token.substring(7));

        final User user = userRepository.findByEmail(username)
                .orElseThrow();

        return user.getShop();
    }

    /**
     * Update shop shop.
     *
     * @param id      the id
     * @param newShop the new shop
     * @param token   the token
     * @return the shop
     */
    public Shop updateShop(final long id, final Shop newShop, final String token) {
        final String username = jwtService.extractUsername(token.substring(7));
        final User user = userRepository.findByEmail(username)
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
                        final Set<PaymentMethod> paymentMethodsSet = newShop.getPaymentMethods()
                                .stream()
                                .map(paymentMethod -> PaymentMethod.valueOf(paymentMethod.toString()))
                                .collect(Collectors.toSet());

                        // Set paymentMethods in Shop entity
                        shop.setPaymentMethods(paymentMethodsSet);
                    }


                    // Update Drinks
                    if (newShop.getDrinks() != null) {
                        final Set<Drink> drinksSet = newShop.getDrinks()
                                .stream()
                                .map(drinks -> Drink.valueOf(drinks.name()))
                                .collect(Collectors.toSet());

                        shop.setDrinks(drinksSet);
                    }

                    // Update services
                    if (newShop.getServices() != null) {
                        final List<com.hdmstuttgart.mi.backend.model.Service> services = new ArrayList<>();
                        for (final com.hdmstuttgart.mi.backend.model.Service serviceRequest : newShop.getServices()) {
                            final com.hdmstuttgart.mi.backend.model.Service service = new com.hdmstuttgart.mi.backend.model.Service();
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
                        final List<Employee> employees = new ArrayList<>();
                        for (final Employee employeeRequest : newShop.getEmployees()) {
                            final Employee employee = new Employee();
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
     * @param token       the token
     * @return the shop
     */
    public Shop patchShop(final Shop updatedShop, final String token) {
        final String username = jwtService.extractUsername(token.substring(7));

        final User user = userRepository.findByEmail(username)
                .orElseThrow();

        final Shop existingShop = user.getShop();

        final Field[] fields = Shop.class.getDeclaredFields();

        for (final Field field : fields) {
            try {
                field.setAccessible(true);
                final Object newValue = field.get(updatedShop);
                if (newValue != null) {
                    field.set(existingShop, newValue);
                }
            } catch (final IllegalAccessException e) {
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
    public Shop uploadLogo(final Long id, final MultipartFile file, final String token) {
        final Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));
        authorizeShopAccess(shop, token);
        try {
            shop.setLogo(file.getBytes());
        } catch (final IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to process image");
        }
        return shopRepository.save(shop);
    }

    public Shop deleteLogo(final Long id, final String token) {
        final Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));
        authorizeShopAccess(shop, token);
        shop.setLogo(null);
        return shopRepository.save(shop);
    }

    public Shop uploadPictures(final Long id, final List<MultipartFile> files, final String token) {
        final Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));
        authorizeShopAccess(shop, token);
        final List<byte[]> pictures = new ArrayList<>();
        if (shop.getPictures() != null) {
            pictures.addAll(shop.getPictures());
        }
        for (final MultipartFile file : files) {
            try {
                pictures.add(file.getBytes());
            } catch (final IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to process image");
            }
        }
        shop.setPictures(pictures);
        return shopRepository.save(shop);
    }

    public Shop deletePicture(final Long id, final int index, final String token) {
        final Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));
        authorizeShopAccess(shop, token);
        final List<byte[]> pictures = shop.getPictures() == null ? new ArrayList<>() : new ArrayList<>(shop.getPictures());
        if (index < 0 || index >= pictures.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid picture index");
        }
        pictures.remove(index);
        shop.setPictures(pictures);
        return shopRepository.save(shop);
    }

    private void authorizeShopAccess(final Shop shop, final String token) {
        final String username = jwtService.extractUsername(token.substring(7));
        final User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException(username));
        if (user.getShop() == null || !user.getShop().getId().equals(shop.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
    }

    public void deleteShop(final long id) {
        if (!shopRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found with id = " + id);
        }
        shopRepository.deleteById(id);
    }
}
