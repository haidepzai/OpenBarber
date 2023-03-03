package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.model.dto.EnterpriseRequest;
import com.hdmstuttgart.mi.backend.model.dto.ServiceRequest;
import com.hdmstuttgart.mi.backend.model.dto.EmployeeRequest;
import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.enums.Drink;
import com.hdmstuttgart.mi.backend.model.enums.PaymentMethod;
import com.hdmstuttgart.mi.backend.model.enums.ServiceTargetAudience;
import com.hdmstuttgart.mi.backend.repository.EnterpriseRepository;
import com.hdmstuttgart.mi.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
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

    /*public Enterprise createEnterprise(EnterpriseRequest request, MultipartFile file){
        try {
            var enterprise = Enterprise.builder()
                    .name(request.getName())
                    .eMail(request.getEMail())
                    .address(request.getAddress())
                    .file(file.getBytes())
                    .build();
            return enterpriseRepository.save(enterprise);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }*/

    public Enterprise createEnterprise(EnterpriseRequest request, String token) {
        String username = jwtService.extractUsername(token.substring(7));

        User user = userRepository.findByEmail(username)
                .orElseThrow();

        byte[] logo = null;
        List<byte[]> pictures = new ArrayList<>();
        Set<PaymentMethod> paymentMethods = null;
        Set<Drink> drinks = null;
        List<com.hdmstuttgart.mi.backend.model.Service> services = new ArrayList<>();
        List<Employee> employees = new ArrayList<>();
        try {
            if (request.getLogo() != null) {
                logo = request.getLogo().getBytes();
            }
            if (request.getPictures() != null) {
                for (MultipartFile pictureData : request.getPictures()) {
                    pictures.add(pictureData.getBytes());
                }
            }
            if (request.getDrinks() != null) {
                drinks = new HashSet<Drink>(
                        request.getDrinks()
                                .stream()
                                .map(Drink::valueOf)
                                .collect(Collectors.toList())
                );
            }
            if (request.getPaymentMethods() != null) {
                paymentMethods = new HashSet<PaymentMethod>(
                        request.getPaymentMethods()
                                .stream()
                                .map(PaymentMethod::valueOf)
                                .collect(Collectors.toList())
                );
            }
            if (request.getServices() != null) {
                for (ServiceRequest serviceRequest : request.getServices()) {
                    var service = com.hdmstuttgart.mi.backend.model.Service.builder()
                            .price(serviceRequest.getPrice())
                            .title(serviceRequest.getTitle())
                            .description(serviceRequest.getDescription())
                            .durationInMin(serviceRequest.getDurationInMin())
                            .targetAudience(ServiceTargetAudience.valueOf(serviceRequest.getTargetAudience()))
                            .build();
                    services.add(service);
                }
            }
            if (request.getEmployees() != null) {
                for (EmployeeRequest employeeRequest : request.getEmployees()) {
                    byte[] picture = null;
                    if (employeeRequest.getPicture() != null) {
                        picture = employeeRequest.getPicture().getBytes();
                    }
                    var employee = Employee.builder()
                            .name(employeeRequest.getName())
                            .picture(picture)
                            .build();
                    employees.add(employee);
                }
            }
            Enterprise enterprise = Enterprise.builder()
                .name(request.getName())
                .owner(request.getOwner())
                .eMail(request.getEMail())
                .addressLatitude(request.getAddressLatitude())
                .addressLongitude(request.getAddressLongitude())
                .address(request.getAddress())
                .logo(logo)
                .pictures(pictures)
                .phoneNumber(request.getPhoneNumber())
                .openingTime(request.getOpeningTime())
                .closingTime(request.getClosingTime())
                .website(request.getWebsite())
                .reviews(new ArrayList<>())
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
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);
        }
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
                    enterprise.setEMail(newEnterprise.getEMail());
                    enterprise.setLogo(newEnterprise.getLogo());
                    enterprise.setPictures(newEnterprise.getPictures());
                    enterprise.setWebsite(newEnterprise.getWebsite());
                    enterprise.setPhoneNumber(newEnterprise.getPhoneNumber());
                    enterprise.setApproved(newEnterprise.isApproved());
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
