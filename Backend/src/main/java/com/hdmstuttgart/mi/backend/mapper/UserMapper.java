package com.hdmstuttgart.mi.backend.mapper;

import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.model.dto.UserDto;
import org.springframework.stereotype.Component;

/**
 * The type User mapper.
 */
@Component
public class UserMapper {

    /**
     * To dto user dto.
     *
     * @param user the user
     * @return the user dto
     */
    public static UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .password(user.getPassword())
                .enterprise(user.getEnterprise())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }

    /**
     * To user user.
     *
     * @param userDto the user dto
     * @return the user
     */
    public static User toUser(UserDto userDto) {
        return User.builder()
                .id(userDto.getId())
                .email(userDto.getEmail())
                .name(userDto.getName())
                .password(userDto.getPassword())
                .enterprise(userDto.getEnterprise())
                .role(userDto.getRole())
                .createdAt(userDto.getCreatedAt())
                .build();
    }
}
