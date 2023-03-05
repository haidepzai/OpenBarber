package com.hdmstuttgart.mi.backend.model.dto;

import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.model.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;
    private String email;
    private String name;
    private Enterprise enterprise;
    private UserRole role;
    private Date createdAt;

    public static UserDto fromUser(User user) {
        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getEnterprise(),
                user.getRole(),
                user.getCreatedAt()
        );
    }

}
