package com.hdmstuttgart.mi.backend.exception;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String user) {
        super("User " + user + " already exists");
    }
}
