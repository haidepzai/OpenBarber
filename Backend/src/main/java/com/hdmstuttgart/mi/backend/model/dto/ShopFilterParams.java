package com.hdmstuttgart.mi.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShopFilterParams {
    private List<Integer> priceCategory;
    private List<String> targetAudience;
    private Integer employeeCountMin;
    private Integer employeeCountMax;
    private List<String> openingDays;
    private String openingTime;
    private String closingTime;
    private List<String> paymentMethods;
    private List<String> drinks;
    private Double minRating;
    /** Filter shops that have at least one free slot on this date */
    private LocalDate availableDate;
    /** Only consider slots starting from this time (HH:mm), defaults to shop opening time */
    private String availableFromTime;
}
