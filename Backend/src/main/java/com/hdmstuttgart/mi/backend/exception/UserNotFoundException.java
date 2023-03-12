package com.hdmstuttgart.mi.backend.exception;

/**
 * The type User not found exception.
 */
public class UserNotFoundException extends RuntimeException {
    /**
     * Instantiates a new User not found exception.
     *
     * @param user the user
     */
    public UserNotFoundException(String user) {
        super("Could not find user " + user);
    }
}
