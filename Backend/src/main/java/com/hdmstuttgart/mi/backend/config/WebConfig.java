package com.hdmstuttgart.mi.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String allowedOrigin = System.getenv().getOrDefault("ALLOWED_ORIGIN", "http://localhost:3000");
        registry.addMapping("/**")
                .allowedOriginPatterns(allowedOrigin, "http://localhost:3000", "http://127.0.0.1:3000", "https://*.vercel.app")
                .allowedMethods("*")
                .allowedHeaders("*")
                .exposedHeaders("Authorization")
                .maxAge(3600L);
    }
}
