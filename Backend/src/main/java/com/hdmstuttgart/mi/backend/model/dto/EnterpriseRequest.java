package com.hdmstuttgart.mi.backend.model.dto;

import com.hdmstuttgart.mi.backend.model.Review;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.net.URL;
import java.util.List;

@Data
public class EnterpriseRequest {
    private String name;
    private String owner;
    private String address;
    private double addressLongitude;
    private double addressAltitude;
    private String eMail;
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
    private List<String> paymentMethods;
    private List<String> drinks;
    private List<ServiceRequest> services;
    private List<EmployeeRequest> employees;

    /*private Set<PaymentMethod> paymentMethods;
    private Set<Drink> drinks;*/

}
