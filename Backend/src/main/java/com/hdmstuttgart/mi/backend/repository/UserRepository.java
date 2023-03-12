package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * The interface User repository.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long>{
        @Override
        List<User> findAll();

    /**
     * Find by email optional.
     *
     * @param email the email
     * @return the optional
     */
    Optional<User> findByEmail(String email);

//        Optional<User> findByUsername(String username);
}
