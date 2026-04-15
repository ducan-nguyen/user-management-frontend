package com.example.usermanagement.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {
        
        logger.error("Resource not found: {}", ex.getMessage());
        
        ErrorResponse errorResponse = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.NOT_FOUND.value(),
            "Not Found",
            ex.getMessage(),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleUserAlreadyExistsException(
            UserAlreadyExistsException ex, WebRequest request) {

        logger.error("Duplicate user: {}", ex.getMessage());

        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.CONFLICT.value());
        error.put("error", "Conflict");
        error.put("message", ex.getMessage());
        error.put("field", "username");
        error.put("path", request.getDescription(false));

        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentialsException(
            InvalidCredentialsException ex, WebRequest request) {
        
        logger.error("Invalid credentials: {}", ex.getMessage());
        
        ErrorResponse errorResponse = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.UNAUTHORIZED.value(),
            "Unauthorized",
            ex.getMessage(),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedException(
            UnauthorizedException ex, WebRequest request) {
        
        logger.error("Unauthorized access: {}", ex.getMessage());
        
        ErrorResponse errorResponse = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.FORBIDDEN.value(),
            "Forbidden",
            ex.getMessage(),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(
            BadCredentialsException ex, WebRequest request) {
        
        logger.error("Bad credentials: {}", ex.getMessage());
        
        ErrorResponse errorResponse = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.UNAUTHORIZED.value(),
            "Unauthorized",
            "Invalid username or password",
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(
            AccessDeniedException ex, WebRequest request) {
        
        logger.error("Access denied: {}", ex.getMessage());
        
        ErrorResponse errorResponse = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.FORBIDDEN.value(),
            "Forbidden",
            "You don't have permission to access this resource",
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        
        logger.error("Validation error: {}", ex.getMessage());
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(
            Exception ex, WebRequest request) {
        
        logger.error("Unexpected error occurred: {}", ex.getMessage(), ex);
        
        ErrorResponse errorResponse = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Internal Server Error",
            "An unexpected error occurred. Please try again later.",
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}