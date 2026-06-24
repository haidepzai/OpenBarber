package com.hdmstuttgart.mi.backend.model.dto;

import lombok.Data;

/**
 * The type Employee dto.
 */
@Data
public class EmployeeDto {
    private Long id;
    private String name;
    private String title;
    private String picture;
    private Long shopId;
}
