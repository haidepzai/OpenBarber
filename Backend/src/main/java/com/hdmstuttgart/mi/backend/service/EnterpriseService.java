package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.exception.UserNotFoundException;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.enums.Drink;
import com.hdmstuttgart.mi.backend.model.enums.PaymentMethod;
import com.hdmstuttgart.mi.backend.repository.EnterpriseRepository;
import com.hdmstuttgart.mi.backend.repository.ServiceRepository;
import com.hdmstuttgart.mi.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.Field;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnterpriseService {

    private static final Logger log = LoggerFactory.getLogger(EnterpriseService.class);
    private final EnterpriseRepository enterpriseRepository;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;

    public Enterprise createEnterprise(Enterprise request, String token) {
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
        Enterprise enterprise = Enterprise.builder()
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
        user.setEnterprise(enterprise);
        return userRepository.save(user).getEnterprise();
    }

    public List<Enterprise> getAllEnterprises() {
        List<Enterprise> enterprises = enterpriseRepository.findAll();
        if (enterprises.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "No enterprises found");
        }
        return enterprises;
    }

    public Enterprise getEnterpriseById(long id) {
        return enterpriseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with id = " + id));
    }

    public Enterprise getEnterpriseByEmail(String email) {
        return enterpriseRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with email = " + email));
    }

    public Enterprise getEnterpriseByUser(String token) {
        String username = jwtService.extractUsername(token.substring(7));

        User user = userRepository.findByEmail(username)
                .orElseThrow();

        return user.getEnterprise();
    }

    public Enterprise updateEnterprise(long id, Enterprise newEnterprise) {
        return enterpriseRepository.findById(id)
                .map(enterprise -> {
                    enterprise.setName(newEnterprise.getName());
                    enterprise.setAddress(newEnterprise.getAddress());
                    enterprise.setAddressLongitude(newEnterprise.getAddressLongitude());
                    enterprise.setAddressLatitude(newEnterprise.getAddressLatitude());
                    enterprise.setEmail(newEnterprise.getEmail());
                    //enterprise.setLogo(newEnterprise.getLogo());
                    //enterprise.setPictures(newEnterprise.getPictures());
                    enterprise.setWebsite(newEnterprise.getWebsite());
                    enterprise.setPhoneNumber(newEnterprise.getPhoneNumber());
                    enterprise.setApproved(newEnterprise.isApproved());
                    enterprise.setPriceCategory(newEnterprise.getPriceCategory());
                    enterprise.setOpeningTime(newEnterprise.getOpeningTime());
                    enterprise.setClosingTime(newEnterprise.getClosingTime());

                    // Update Payment Methods
                    if (newEnterprise.getPaymentMethods() != null) {
                        Set<PaymentMethod> paymentMethodsSet = newEnterprise.getPaymentMethods()
                                .stream()
                                .map(paymentMethod -> PaymentMethod.valueOf(paymentMethod.toString()))
                                .collect(Collectors.toSet());

                        // Set paymentMethods in Enterprise entity
                        enterprise.setPaymentMethods(paymentMethodsSet);
                    }


                    // Update Drinks
                    if (newEnterprise.getDrinks() != null) {
                        Set<Drink> drinksSet = newEnterprise.getDrinks()
                                .stream()
                                .map(drinks -> Drink.valueOf(drinks.name()))
                                .collect(Collectors.toSet());

                        enterprise.setDrinks(drinksSet);
                    }

                    // Update services
                    if (newEnterprise.getServices() != null) {
                        List<com.hdmstuttgart.mi.backend.model.Service> services = new ArrayList<>();
                        for (com.hdmstuttgart.mi.backend.model.Service serviceRequest : newEnterprise.getServices()) {
                            com.hdmstuttgart.mi.backend.model.Service service = new com.hdmstuttgart.mi.backend.model.Service();
                            service.setTitle(serviceRequest.getTitle());
                            service.setPrice(serviceRequest.getPrice());
                            service.setTargetAudience(serviceRequest.getTargetAudience());
                            service.setDurationInMin(serviceRequest.getDurationInMin());
                            service.setEnterprise(enterprise);
                            services.add(service);
                        }
                        enterprise.setServices(services);
                    }

                    // Update employees
                    if (newEnterprise.getEmployees() != null) {
                        List<Employee> employees = new ArrayList<>();
                        for (Employee employeeRequest : newEnterprise.getEmployees()) {
                            Employee employee = new Employee();
                            employee.setName(employeeRequest.getName());
                            employee.setEnterprise(enterprise);
                            byte[] picture = null;
                            if (employeeRequest.getPicture() != null) {
                                picture = employeeRequest.getPicture();
                            }
                            employee.setPicture(picture);
                            employee.setTitle(employeeRequest.getTitle());
                        }
                        enterprise.setEmployees(employees);
                    }

                    return enterpriseRepository.save(enterprise);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with id = " + id));
    }

    public Enterprise patchEnterprise(Enterprise updatedEnterprise, String token) {
        String username = jwtService.extractUsername(token.substring(7));

        User user = userRepository.findByEmail(username)
                .orElseThrow();

        Enterprise existingEnterprise = user.getEnterprise();

        Field[] fields = Enterprise.class.getDeclaredFields();

        for (Field field : fields) {
            try {
                field.setAccessible(true);
                Object newValue = field.get(updatedEnterprise);
                if (newValue != null) {
                    field.set(existingEnterprise, newValue);
                }
            } catch (IllegalAccessException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to update field: " + field.getName());

            }
        }

        return enterpriseRepository.save(existingEnterprise);
    }

    public void deleteEnterprise(long id) {
        if (!enterpriseRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with id = " + id);
        }
        enterpriseRepository.deleteById(id);
    }
}
