package com.hdmstuttgart.mi.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Rate limiting filter using Bucket4j (token bucket algorithm).
 *
 * Tiers per IP:
 *  - AUTH_VERIFY   (/api/auth/verify, /api/auth/resend-verification): 5 req/15 min
 *  - AUTH_STRICT   (/api/auth/authenticate, /api/auth/register, /api/auth/google): 5 req/min
 *  - AUTH_GENERAL  (/api/auth/**):                                    20 req/min
 *  - API_GENERAL   (all other /api/**):                               60 req/min
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final int AUTH_VERIFY_CAPACITY  = 5;
    private static final int AUTH_STRICT_CAPACITY  = 5;
    private static final int AUTH_GENERAL_CAPACITY = 20;
    private static final int API_CAPACITY          = 60;

    private final LoadingCache<String, Bucket> authVerifyCache  = buildCache(AUTH_VERIFY_CAPACITY,  Duration.ofMinutes(15));
    private final LoadingCache<String, Bucket> authStrictCache  = buildCache(AUTH_STRICT_CAPACITY,  Duration.ofMinutes(1));
    private final LoadingCache<String, Bucket> authGeneralCache = buildCache(AUTH_GENERAL_CAPACITY, Duration.ofMinutes(1));
    private final LoadingCache<String, Bucket> apiCache         = buildCache(API_CAPACITY,          Duration.ofMinutes(1));

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        String ip   = resolveClientIp(request);
        String path = request.getRequestURI();
        Bucket bucket = resolveBucket(ip, path);

        long tokensLeft = bucket.getAvailableTokens();
        int  capacity   = capacityForPath(path);

        response.setHeader("X-RateLimit-Limit",     String.valueOf(capacity));
        response.setHeader("X-RateLimit-Remaining", String.valueOf(Math.max(0, tokensLeft)));

        if (bucket.tryConsume(1)) {
            chain.doFilter(request, response);
        } else {
            sendTooManyRequests(response, capacity);
        }
    }

    // ---- helpers ----

    private Bucket resolveBucket(String ip, String path) {
        if (isAuthVerify(path))   return authVerifyCache.get(ip);
        if (isAuthStrict(path))   return authStrictCache.get(ip);
        if (isAuthGeneral(path))  return authGeneralCache.get(ip);
        return apiCache.get(ip);
    }

    private int capacityForPath(String path) {
        if (isAuthVerify(path))  return AUTH_VERIFY_CAPACITY;
        if (isAuthStrict(path))  return AUTH_STRICT_CAPACITY;
        if (isAuthGeneral(path)) return AUTH_GENERAL_CAPACITY;
        return API_CAPACITY;
    }

    private boolean isAuthVerify(String path) {
        return path.equals("/api/auth/verify") || path.equals("/api/auth/resend-verification");
    }

    private boolean isAuthStrict(String path) {
        return path.equals("/api/auth/authenticate") || path.equals("/api/auth/register") || path.equals("/api/auth/google");
    }

    private boolean isAuthGeneral(String path) {
        return path.startsWith("/api/auth/");
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private LoadingCache<String, Bucket> buildCache(int capacity, Duration window) {
        return Caffeine.newBuilder()
                .expireAfterAccess(1, TimeUnit.HOURS)
                .build(ip -> newBucket(capacity, window));
    }

    private Bucket newBucket(int capacity, Duration window) {
        Bandwidth limit = Bandwidth.classic(capacity, Refill.greedy(capacity, window));
        return Bucket.builder().addLimit(limit).build();
    }

    private void sendTooManyRequests(HttpServletResponse response, int capacity) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setHeader("Retry-After", "60");

        Map<String, Object> body = Map.of(
                "status",  429,
                "error",   "Too Many Requests",
                "message", String.format("Rate limit exceeded. Max %d requests per minute.", capacity)
        );
        objectMapper.writeValue(response.getOutputStream(), body);
    }
}
