package com.hdmstuttgart.mi.backend.exception;

/**
 * The type User already exists exception.
 */
public class UserAlreadyExistsException extends RuntimeException {
    /**
     * Instantiates a new User already exists exception.
     *
     * @param user the user
     */
    public UserAlreadyExistsException(String user) {
        super("User " + user + " already exists");
    }
}
