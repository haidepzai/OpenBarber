package com.hdmstuttgart.mi.backend.model.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

/**
 * The type Employee dto.
 */
@Data
public class EmployeeDto {
    private Long id;
    private String name;
    private String title;
    private MultipartFile picture;
    private Long enterpriseId;
}
