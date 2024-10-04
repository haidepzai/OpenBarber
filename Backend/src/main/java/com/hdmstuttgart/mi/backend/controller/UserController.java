package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.mapper.UserMapper;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.model.dto.UserDto;
import com.hdmstuttgart.mi.backend.service.JwtService;
import com.hdmstuttgart.mi.backend.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

/**
 * The type User controller.
 */
@Api(value = "User Controller", description = "Operations related to User", tags = "User")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    /**
     * Instantiates a new User controller.
     *
     * @param userService the user service
     * @param jwtService  the jwt service
     */
    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    /**
     * Gets all users.
     *
     * @return the all users
     */
    @ApiOperation(value = "Get All Users", notes = "Retrieves a list of all users")
    @GetMapping()
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDto> userDtos = users.stream()
                .map(UserMapper::toDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(userDtos, HttpStatus.OK);
    }

    /**
     * Gets user by id.
     *
     * @param id the id
     * @return the user by id
     */
    @ApiOperation(value = "Get User by ID", notes = "Retrieves a specific user by their ID")
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        UserDto userDto = UserMapper.toDto(user);
        return ResponseEntity.ok(userDto);
    }

    /**
     * Gets user by token.
     *
     * @param token the token
     * @return the user by token
     */
    @ApiOperation(value = "Get User by Token", notes = "Retrieves a user using their authorization token")
    @GetMapping("/info")
    public ResponseEntity<UserDto> getUserByToken(@RequestHeader("Authorization") String token) {
        String email = jwtService.extractUsername(token.substring(7));
        User user = userService.getUserByEmail(email);
        UserDto userDto = UserMapper.toDto(user);
        return ResponseEntity.ok(userDto);
    }

    /**
     * Gets user by email.
     *
     * @param email the email
     * @return the user by email
     */
    @ApiOperation(value = "Get User by Email", notes = "Retrieves a user by their email address")
    @GetMapping("/email/{email}")
    public ResponseEntity<UserDto> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email);
        UserDto userDto = UserMapper.toDto(user);
        return ResponseEntity.ok(userDto);
    }


    /**
     * Create user response entity.
     *
     * @param userDto the user dto
     * @return the response entity
     */
    @ApiOperation(value = "Create User", notes = "Creates a new user with the provided details")
    @PostMapping
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserDto userDto) {
        User user = UserMapper.toUser(userDto);
        User createdUser = userService.createUser(user);
        UserDto createdUserDto = UserMapper.toDto(createdUser);
        return ResponseEntity.created(URI.create("/api/users/" + createdUser.getId())).body(createdUserDto);
    }

    /**
     * Update user response entity.
     *
     * @param id      the id
     * @param userDto the user dto
     * @param token   the token
     * @return the response entity
     */
    @ApiOperation(value = "Update User", notes = "Updates a user's information if authenticated")
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

    /**
     * Delete user by id response entity.
     *
     * @param id      the id
     * @param request the request
     * @return the response entity
     */
    @ApiOperation(value = "Delete User by ID", notes = "Deletes a user by their ID if authenticated")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable Long id, HttpServletRequest request) {
        // Get the email of the authenticated user from the JWT token
        String email = jwtService.extractUsername(request.getHeader("Authorization").substring(7));

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