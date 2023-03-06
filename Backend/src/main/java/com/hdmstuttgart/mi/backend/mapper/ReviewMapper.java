package com.hdmstuttgart.mi.backend.mapper;

import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.Review;
import com.hdmstuttgart.mi.backend.model.dto.EmployeeDto;
import com.hdmstuttgart.mi.backend.model.dto.ReviewDto;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ReviewMapper {

    public static ReviewDto toDto(Review review) {
        return ReviewDto.builder()
                .id(review.getId())
                .author(review.getAuthor())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .rating(review.getRating())
                .enterpriseId(review.getEnterprise().getId())
                .build();
    }

    public static List<ReviewDto> toDtos(List<Review> reviews) {
        return reviews.stream()
                .map(ReviewMapper::toDto)
                .collect(Collectors.toList());
    }

    public static Review toEntity(ReviewDto reviewDto, Enterprise enterprise) {
        return Review.builder()
                .id(reviewDto.getId())
                .author(reviewDto.getAuthor())
                .comment(reviewDto.getComment())
                .createdAt(reviewDto.getCreatedAt())
                .rating(reviewDto.getRating())
                .enterprise(enterprise)
                .build();
    }
}
