package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.exception.UserNotFoundException;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.model.dto.UserDto;
import com.hdmstuttgart.mi.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email " + email));
    }

    public User createUser(User user) {
        // Check if user with same email already exists
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("User with email " + user.getEmail() + " already exists.");
        }

        return userRepository.save(user);
    }

    public User updateUser(Long id, UserDto user) {
        User existingUser = getUserById(id);
        existingUser.setEmail(user.getEmail());
        //existingUser.setPassword(user.getPassword());
        //existingUser.setConfirmationCode(user.getConfirmationCode());
        existingUser.setName(user.getName());
        existingUser.setEnterprise(user.getEnterprise());
        existingUser.setRole(user.getRole());
        return userRepository.save(existingUser);
    }

    public void deleteUserById(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

}