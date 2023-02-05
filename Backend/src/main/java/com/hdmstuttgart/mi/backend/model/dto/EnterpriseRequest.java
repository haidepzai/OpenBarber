package com.hdmstuttgart.mi.backend.model.dto;

import com.hdmstuttgart.mi.backend.model.enums.Drink;
import com.hdmstuttgart.mi.backend.model.enums.PaymentMethod;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import java.net.URL;
import java.sql.Blob;
import java.util.List;
import java.util.Set;

@Data
public class EnterpriseRequest {
    private String name;
    private String address;
    /*private long addressLongitude;
    private long addressAltitude;*/
    private String eMail;
    private MultipartFile logo;
    /*private List<MultipartFile> pictures;*/

    /*private String phoneNumber;
    private URL website;
    private String hours;
    private double rating;
    private long reviews;
    private boolean recommended;
    private boolean approved;
    private int priceCategory;*/

    /*private Set<PaymentMethod> paymentMethods;
    private Set<Drink> drinks;*/

}
