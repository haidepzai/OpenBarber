package com.hdmstuttgart.mi.backend.service.impl;

import com.hdmstuttgart.mi.backend.service.IJwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * The type Jwt service.
 */
@Service
public class JwtServiceImpl implements IJwtService {

    private static final long ACCESS_TOKEN_EXPIRATION_TIME = 15 * 60; // 15 minutes in seconds
    private static final long REFRESH_TOKEN_EXPIRATION_TIME = 30 * 24 * 60 * 60; // 30 days in seconds
    @Value("${SECRET_KEY}")
    private String SECRET_KEY;

    /**
     * Extract username string.
     *
     * @param token the token
     * @return the string
     */
    public String extractUsername(final String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extract claim t.
     *
     * @param <T>            the type parameter
     * @param token          the token
     * @param claimsResolver the claims resolver
     * @return the t
     */
    public <T> T extractClaim(final String token, final Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Generate access token string.
     *
     * @param userDetails the user details
     * @return the string
     */
    public String generateAccessToken(final UserDetails userDetails) {
        final Map<String, Object> claims = new HashMap<>();
        return generateToken(claims, userDetails, ACCESS_TOKEN_EXPIRATION_TIME);
    }

    /**
     * Generate refresh token string.
     *
     * @param userDetails the user details
     * @return the string
     */
    public String generateRefreshToken(final UserDetails userDetails) {
        final Map<String, Object> claims = new HashMap<>();
        return generateToken(claims, userDetails, REFRESH_TOKEN_EXPIRATION_TIME);
    }

    private String generateToken(final Map<String, Object> claims, final UserDetails userDetails, final long expirationTime) {
        final Instant now = Instant.now();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(expirationTime)))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Is access token valid boolean.
     *
     * @param token       the token
     * @param userDetails the user details
     * @return the boolean
     */
    public boolean isAccessTokenValid(final String token, final UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    /**
     * Is refresh token valid boolean.
     *
     * @param token       the token
     * @param userDetails the user details
     * @return the boolean
     */
    public boolean isRefreshTokenValid(final String token, final UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(final String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(final String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(final String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        final byte[] keyBytes = SECRET_KEY.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Refresh access token string.
     *
     * @param refreshToken the refresh token
     * @param userDetails  the user details
     * @return the string
     */
    public String refreshAccessToken(final String refreshToken, final UserDetails userDetails) {
        final Claims claims = extractAllClaims(refreshToken);
        if (!claims.getSubject().equals(userDetails.getUsername())) {
            throw new IllegalArgumentException("Invalid refresh token for this user");
        }
        return generateAccessToken(userDetails);
    }
}
