package com.hdmstuttgart.mi.backend.model.dto;

import com.hdmstuttgart.mi.backend.model.Service;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

//    private String firstname; //not in frontend
//    private String lastname;  //not in frontend
    //TODO validation
    @Email
    private String email;
    private String password;

/*    private String enterpriseName;
    private String firstShopName; //redundant?
    private String shopPhone;
    private String shopDescription;
    private String shopEmail;
    private String shopHeaderUrl;
    private String shopWebsite;
    private List<Service> shopServices;*/
}
