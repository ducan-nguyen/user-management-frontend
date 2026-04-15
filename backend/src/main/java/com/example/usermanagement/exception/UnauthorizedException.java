package com.example.usermanagement.exception;

public class UnauthorizedException extends RuntimeException {
    
    public UnauthorizedException(String message) {
        super(message);
    }
    
    public UnauthorizedException() {
        super("You don't have permission to access this resource");
    }
}