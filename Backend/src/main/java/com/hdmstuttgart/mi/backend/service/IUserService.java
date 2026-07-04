package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IUserService {
    Page<User> getAllUsers(Pageable pageable);

    User getUserById(Long id);

    User getUserByEmail(String email);

    User createUser(User user);

    User updateUser(Long id, User user);

    void deleteUserById(Long id);
}
