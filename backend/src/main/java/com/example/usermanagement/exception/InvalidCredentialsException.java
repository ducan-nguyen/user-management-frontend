package com.example.usermanagement.exception;

public class InvalidCredentialsException extends RuntimeException {
    
    public InvalidCredentialsException(String message) {
        super(message);
    }
    
    public InvalidCredentialsException() {
        super("Invalid username or password");
    }
}