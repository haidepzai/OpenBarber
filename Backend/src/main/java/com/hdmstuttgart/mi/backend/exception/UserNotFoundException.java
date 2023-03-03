package com.hdmstuttgart.mi.backend.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String user) {
        super("Could not find user " + user);
    }
}
