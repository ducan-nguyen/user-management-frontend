package com.example.usermanagement.exception;

public class UserAlreadyExistsException extends RuntimeException {
    
    public UserAlreadyExistsException(String message) {
        super(message);
    }
    
    public UserAlreadyExistsException(String fieldName, String fieldValue) {
        super(String.format("User already exists with %s : '%s'", fieldName, fieldValue));
    }
}