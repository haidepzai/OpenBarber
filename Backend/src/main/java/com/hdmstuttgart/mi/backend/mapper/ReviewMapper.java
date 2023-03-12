package com.hdmstuttgart.mi.backend.mapper;

import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.Review;
import com.hdmstuttgart.mi.backend.model.dto.EmployeeDto;
import com.hdmstuttgart.mi.backend.model.dto.ReviewDto;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * The type Review mapper.
 */
@Component
public class ReviewMapper {

    /**
     * To dto review dto.
     *
     * @param review the review
     * @return the review dto
     */
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

    /**
     * To dtos list.
     *
     * @param reviews the reviews
     * @return the list
     */
    public static List<ReviewDto> toDtos(List<Review> reviews) {
        return reviews.stream()
                .map(ReviewMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * To entity review.
     *
     * @param reviewDto  the review dto
     * @param enterprise the enterprise
     * @return the review
     */
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
