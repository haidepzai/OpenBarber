package com.hdmstuttgart.mi.backend.model.dto;

import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.Review;
import com.hdmstuttgart.mi.backend.model.Service;
import com.hdmstuttgart.mi.backend.model.enums.PaymentMethod;
import com.hdmstuttgart.mi.backend.service.ServiceService;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.net.URL;
import java.util.List;
import java.util.Set;

@Data
public class EnterpriseDto {
    private String name;
    private String owner;
    private String address;
    private double addressLongitude;
    private double addressLatitude;
    private String email;
    private MultipartFile logo;
    private List<MultipartFile> pictures;
    private String phoneNumber;
    private String openingTime;
    private String closingTime;
    private URL website;
    private double rating;
    private boolean recommended;
    private boolean approved;
    private int priceCategory;
    private Set<PaymentMethod> paymentMethods;
    private Set<String> drinks;
    private List<ServiceDto> services;
    private List<EmployeeDto> employees;
    private List<Review> reviews;

    /*private Set<PaymentMethod> paymentMethods;
    private Set<Drink> drinks;*/

}
