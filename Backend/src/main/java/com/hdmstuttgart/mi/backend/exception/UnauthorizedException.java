package com.hdmstuttgart.mi.backend.exception;

/**
 * The type Unauthorized exception.
 */
public class UnauthorizedException extends RuntimeException {
    /**
     * Instantiates a new Unauthorized exception.
     *
     * @param message the message
     */
    public UnauthorizedException(String message) {
        super(message);
    }

    /**
     * Instantiates a new Unauthorized exception.
     *
     * @param message the message
     * @param cause   the cause
     */
    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
}
