package com.example.usermanagement.security.keys;

import io.jsonwebtoken.security.Keys;
import java.util.Base64;

public class GenerateSecretKey {
    public static void main(String[] args) {
        // Tạo key cho HS512 (512 bits)
        var key = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS512);
        String base64Key = Base64.getEncoder().encodeToString(key.getEncoded());
        
        System.out.println("Your secure key (base64):");
        System.out.println(base64Key);
        System.out.println("Length: " + base64Key.length());
    }
}
