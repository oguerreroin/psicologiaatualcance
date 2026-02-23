package com.psico.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;

public class JwtUtil {
    // En producción esto debería venir de variables de entorno
    private static final String SECRET = "EstaEsUnaClaveSecretaMuyLargaYSeguraParaPsicologiaATuAlcance2025+";
    private static final Key KEY = Keys.hmacShaKeyFor(SECRET.getBytes());
    private static final long EXPIRATION_TIME = 86400000; // 24 horas

    public static String generateToken(int userId, String rol, String email) {
        return Jwts.builder()
                .setSubject(email)
                .claim("id", userId)
                .claim("rol", rol)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public static Claims validateToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            return null; // Token no válido o expirado
        }
    }
}
