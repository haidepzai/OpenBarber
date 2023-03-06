package com.hdmstuttgart.mi.backend.model.dto;

import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.model.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private Long id;
    private String email;
    private String name;
    private Enterprise enterprise;
    private UserRole role;
    private Date createdAt;

    public static UserDto fromUser(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .enterprise(user.getEnterprise())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public User toUser() {
        return User.builder()
                .id(this.getId())
                .email(this.getEmail())
                .name(this.getName())
                .enterprise(this.getEnterprise())
                .role(this.getRole())
                .createdAt(this.getCreatedAt())
                .build();
    }

}
