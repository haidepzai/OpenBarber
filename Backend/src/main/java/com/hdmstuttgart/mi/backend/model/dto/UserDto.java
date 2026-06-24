package com.hdmstuttgart.mi.backend.model.dto;

import com.hdmstuttgart.mi.backend.model.Shop;
import com.hdmstuttgart.mi.backend.model.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * The type User dto.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private Long id;
    private String email;
    private String name;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String salutation;
    private byte[] profilePhoto;
    private String password;
    private Shop shop;
    private UserRole role;
    private Date createdAt;

}
