package com.hdmstuttgart.mi.backend.mapper;

import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.model.dto.UserDto;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public static UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .enterprise(user.getEnterprise())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public static User toUser(UserDto userDto) {
        return User.builder()
                .id(userDto.getId())
                .email(userDto.getEmail())
                .name(userDto.getName())
                .enterprise(userDto.getEnterprise())
                .role(userDto.getRole())
                .createdAt(userDto.getCreatedAt())
                .build();
    }
}
