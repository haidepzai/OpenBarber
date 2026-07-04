package com.hdmstuttgart.mi.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.mvc.method.RequestMappingInfoHandlerMapping;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.spring.web.plugins.WebMvcRequestHandlerProvider;
import springfox.documentation.spring.web.readers.operation.HandlerMethodResolver;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import javax.servlet.ServletContext;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Configuration
@EnableSwagger2
public class SwaggerConfig implements WebMvcConfigurer {

    /**
     * Fix for Springfox 3.0.0 + Spring Boot 2.6+:
     * Filter out handler mappings that use PathPatternParser (Spring Data REST, Actuator).
     * Springfox needs AntPathMatcher mappings only (getPatternParser() == null).
     */
    @Primary
    @Bean
    public WebMvcRequestHandlerProvider webMvcRequestHandlerProvider(
            Optional<ServletContext> servletContext,
            HandlerMethodResolver methodResolver,
            @Autowired List<RequestMappingInfoHandlerMapping> handlerMappings) {
        List<RequestMappingInfoHandlerMapping> filtered = handlerMappings.stream()
                .filter(m -> m.getPatternParser() == null)
                .collect(Collectors.toList());
        return new WebMvcRequestHandlerProvider(servletContext, methodResolver, filtered);
    }

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.hdmstuttgart.mi.backend"))
                .paths(PathSelectors.any())
                .build()
                .apiInfo(apiInfo());
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("OpenBarber")
                .description("API Documentation for OpenBarber")
                .version("1.0")
                .build();
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/swagger-ui.html")
                .addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**")
                .addResourceLocations("classpath:/META-INF/resources/webjars/");
    }
}
