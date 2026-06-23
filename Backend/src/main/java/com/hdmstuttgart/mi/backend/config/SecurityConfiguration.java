package com.hdmstuttgart.mi.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
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
            .authorizeHttpRequests()
            // Public auth endpoints
            .antMatchers("/api/auth/**").permitAll()
            // Swagger
            .antMatchers("/v2/api-docs", "/configuration/**", "/swagger*/**", "/webjars/**").permitAll()
            // Public read: enterprises, services, reviews
            .antMatchers(HttpMethod.GET, "/api/enterprises", "/api/enterprises/{id}", "/api/enterprises/within-radius", "/api/enterprises/email", "/api/enterprises/*/available-slots").permitAll()
            .antMatchers(HttpMethod.GET, "/api/reviews").permitAll()
            .antMatchers(HttpMethod.GET, "/api/services").permitAll()
            // Operator-only: manage own enterprise (UNVERIFIED/VERIFIED can create once during signup)
            .antMatchers(HttpMethod.POST, "/api/enterprises").hasAnyAuthority("OPERATOR", "VERIFIED", "UNVERIFIED")
            .antMatchers(HttpMethod.POST, "/api/enterprises/*/**").hasAuthority("OPERATOR")
            .antMatchers(HttpMethod.PUT, "/api/enterprises/**").hasAuthority("OPERATOR")
            .antMatchers(HttpMethod.PATCH, "/api/enterprises/**").hasAuthority("OPERATOR")
            .antMatchers(HttpMethod.DELETE, "/api/enterprises/**").hasAuthority("OPERATOR")
            .antMatchers("/api/employees/**").hasAuthority("OPERATOR")
            .antMatchers(HttpMethod.POST, "/api/services").hasAuthority("OPERATOR")
            .antMatchers(HttpMethod.PUT, "/api/services/**").hasAuthority("OPERATOR")
            .antMatchers(HttpMethod.DELETE, "/api/services/**").hasAuthority("OPERATOR")
            // Appointments: operators manage, verified users can create/read
            .antMatchers("/api/appointments/**").hasAnyAuthority("OPERATOR", "VERIFIED")
            // User info: authenticated only
            .antMatchers("/api/enterprises/user").authenticated()
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
