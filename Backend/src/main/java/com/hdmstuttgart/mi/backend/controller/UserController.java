package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.mapper.UserMapper;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.model.dto.UserDto;
import com.hdmstuttgart.mi.backend.service.JwtService;
import com.hdmstuttgart.mi.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping()
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDto> userDtos = users.stream()
                .map(UserMapper::toDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(userDtos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        UserDto userDto = UserMapper.toDto(user);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserDto> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email);
        UserDto userDto = UserMapper.toDto(user);
        return ResponseEntity.ok(userDto);
    }


    @PostMapping
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserDto userDto) {
        User user = UserMapper.toUser(userDto);
        User createdUser = userService.createUser(user);
        UserDto createdUserDto = UserMapper.toDto(createdUser);
        return ResponseEntity.created(URI.create("/api/users/" + createdUser.getId())).body(createdUserDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @Valid @RequestBody UserDto userDto, @RequestHeader("Authorization") String token) {
        // Get the email of the authenticated user from the JWT token
        String email = jwtService.extractUsername(token.substring(7));

        // Check if the authenticated user matches the user being updated
        User user = userService.getUserById(id);
        if (!user.getEmail().equals(email)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Update the user
        User updatedUser = userService.updateUser(id, UserMapper.toUser(userDto));
        UserDto updatedUserDto = UserMapper.toDto(updatedUser);
        return ResponseEntity.ok(updatedUserDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable Long id, HttpServletRequest request) {
        // Get the email of the authenticated user from the JWT token
        String email = jwtService.extractUsername(request.getHeader("Authorization"));

        // Check if the authenticated user matches the user being deleted
        User user = userService.getUserById(id);
        if (!user.getEmail().equals(email)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Delete the user
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }

}