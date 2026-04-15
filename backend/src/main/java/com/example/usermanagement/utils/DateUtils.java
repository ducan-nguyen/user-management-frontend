package com.example.usermanagement.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateUtils {
    
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    public static String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(FORMATTER) : null;
    }
    
    public static boolean isExpired(LocalDateTime expiryTime) {
        return expiryTime != null && expiryTime.isBefore(LocalDateTime.now());
    }
    
    private DateUtils() {
        // Private constructor
    }
}