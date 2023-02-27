package com.hdmstuttgart.mi.backend.model.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class EmployeeRequest {
    private String name;
    private MultipartFile picture;
}
