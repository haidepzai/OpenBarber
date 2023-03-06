package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.mapper.ReviewMapper;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.Review;
import com.hdmstuttgart.mi.backend.model.dto.ReviewDto;
import com.hdmstuttgart.mi.backend.service.EnterpriseService;
import com.hdmstuttgart.mi.backend.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final EnterpriseService enterpriseService;

    public ReviewController(ReviewService reviewService, EnterpriseService enterpriseService) {
        this.reviewService = reviewService;
        this.enterpriseService = enterpriseService;
    }

    @PostMapping
    public ResponseEntity<ReviewDto> createReview(@Valid @RequestBody ReviewDto reviewDto, Long enterpriseId, UUID reviewUuid) {
        Enterprise enterprise = enterpriseService.getEnterpriseById(enterpriseId);
        Review review = ReviewMapper.toEntity(reviewDto, enterprise);
        Review createdReview = reviewService.createReview(review, enterpriseId, reviewUuid);
        ReviewDto createdReviewDto = ReviewMapper.toDto(createdReview);
        return new ResponseEntity<>(createdReviewDto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ReviewDto>> getReviewsByEnterpriseId(@RequestParam Long enterpriseId) {
        List<Review> reviews = reviewService.getReviewsByEnterpriseId(enterpriseId);
        List<ReviewDto> reviewDtos = ReviewMapper.toDtos(reviews);
        return new ResponseEntity<>(reviewDtos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewDto> getReviewById(@PathVariable long id) {
        Review review = reviewService.getReviewById(id);
        ReviewDto reviewDto = ReviewMapper.toDto(review);
        return new ResponseEntity<>(reviewDto, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewDto> updateReview(@PathVariable long id, @Valid @RequestBody ReviewDto newReviewDto, Long enterpriseId) {
        Enterprise enterprise = enterpriseService.getEnterpriseById(enterpriseId);
        Review review = ReviewMapper.toEntity(newReviewDto, enterprise);
        Review updatedReview = reviewService.updateReview(id, review);
        ReviewDto updatedReviewDto = ReviewMapper.toDto(updatedReview);
        return new ResponseEntity<>(updatedReviewDto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable long id) {
        reviewService.deleteReview(id);
        return new ResponseEntity<>("Review deleted with id = " + id, HttpStatus.NO_CONTENT);
    }
}
