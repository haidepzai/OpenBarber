package com.hdmstuttgart.mi.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final RateLimitFilter rateLimitFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()
            // Return 401 (not 403) for unauthenticated requests
            .exceptionHandling()
            .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            .and()
            .authorizeHttpRequests()
            // Public auth endpoints
            .antMatchers("/api/auth/**").permitAll()
            // Swagger
            .antMatchers("/v2/api-docs", "/configuration/**", "/swagger*/**", "/webjars/**").permitAll()
            // Public read: shops, services, reviews
            .antMatchers(HttpMethod.GET, "/api/shops", "/api/shops/{id}", "/api/shops/within-radius", "/api/shops/email", "/api/shops/*/available-slots").permitAll()
            .antMatchers(HttpMethod.GET, "/api/reviews/my").authenticated()
            .antMatchers(HttpMethod.GET, "/api/reviews").permitAll()
            .antMatchers(HttpMethod.POST, "/api/reviews/auth").authenticated()
            .antMatchers(HttpMethod.PUT, "/api/reviews/**").authenticated()
            .antMatchers(HttpMethod.DELETE, "/api/reviews/**").authenticated()
            .antMatchers(HttpMethod.GET, "/api/services").permitAll()
            // Operator-only: manage own shop (UNVERIFIED/VERIFIED can create once during signup)
            .antMatchers(HttpMethod.POST, "/api/shops").hasAnyAuthority("OPERATOR", "VERIFIED", "UNVERIFIED")
            .antMatchers(HttpMethod.POST, "/api/shops/*/**").hasAuthority("OPERATOR")
            .antMatchers(HttpMethod.PUT, "/api/shops/**").hasAuthority("OPERATOR")
            .antMatchers(HttpMethod.PATCH, "/api/shops/**").hasAuthority("OPERATOR")
            .antMatchers(HttpMethod.DELETE, "/api/shops/**").hasAuthority("OPERATOR")
            .antMatchers("/api/employees/**").hasAuthority("OPERATOR")
            .antMatchers(HttpMethod.POST, "/api/services").hasAuthority("OPERATOR")
            .antMatchers(HttpMethod.PUT, "/api/services/**").hasAuthority("OPERATOR")
            .antMatchers(HttpMethod.DELETE, "/api/services/**").hasAuthority("OPERATOR")
            // Appointments: operators manage, verified users can create/read
            .antMatchers(HttpMethod.POST, "/api/appointments").permitAll() // guest booking allowed
            .antMatchers(HttpMethod.GET, "/api/appointments/confirmation/**", "/api/appointments/cancel/**").permitAll() // email confirmation links
            .antMatchers("/api/appointments/**").hasAnyAuthority("OPERATOR", "VERIFIED")
            // User info: authenticated only
            .antMatchers("/api/shops/user").authenticated()
            .antMatchers("/api/users/**").authenticated()
            // Catch-all: require authentication
            .anyRequest().authenticated()
            .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOriginPattern(System.getenv().getOrDefault("ALLOWED_ORIGIN", "http://localhost:3000"));
        configuration.addAllowedOriginPattern("http://127.0.0.1:3000");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
