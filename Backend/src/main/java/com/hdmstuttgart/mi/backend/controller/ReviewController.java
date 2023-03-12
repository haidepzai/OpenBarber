package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.exception.UnauthorizedException;
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

/**
 * The type Review controller.
 */
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final EnterpriseService enterpriseService;

    /**
     * Instantiates a new Review controller.
     *
     * @param reviewService     the review service
     * @param enterpriseService the enterprise service
     */
    public ReviewController(ReviewService reviewService, EnterpriseService enterpriseService) {
        this.reviewService = reviewService;
        this.enterpriseService = enterpriseService;
    }

    /**
     * Create review response entity.
     *
     * @param reviewDto    the review dto
     * @param enterpriseId the enterprise id
     * @param reviewUuid   the review uuid
     * @return the response entity
     */
    @PostMapping
    public ResponseEntity<ReviewDto> createReview(@Valid @RequestBody ReviewDto reviewDto, @RequestParam Long enterpriseId,@RequestParam UUID reviewUuid) {
        Enterprise enterprise = enterpriseService.getEnterpriseById(enterpriseId);
        Review review = ReviewMapper.toEntity(reviewDto, enterprise);
        Review createdReview = reviewService.createReview(review, enterpriseId, reviewUuid);
        ReviewDto createdReviewDto = ReviewMapper.toDto(createdReview);
        return new ResponseEntity<>(createdReviewDto, HttpStatus.CREATED);
    }

    /**
     * Create review for enterprise response entity.
     *
     * @param reviewDto    the review dto
     * @param enterpriseId the enterprise id
     * @return the response entity
     */
    @PostMapping("/new")
    public ResponseEntity<ReviewDto> createReviewForEnterprise(@Valid @RequestBody ReviewDto reviewDto, @RequestParam Long enterpriseId) {
        Enterprise enterprise = enterpriseService.getEnterpriseById(enterpriseId);
        Review review = ReviewMapper.toEntity(reviewDto, enterprise);
        Review createdReview = reviewService.createReview(review, enterpriseId);
        ReviewDto createdReviewDto = ReviewMapper.toDto(createdReview);
        return new ResponseEntity<>(createdReviewDto, HttpStatus.CREATED);
    }

    /**
     * Create review authenticated response entity.
     *
     * @param reviewDto    the review dto
     * @param enterpriseId the enterprise id
     * @param token        the token
     * @return the response entity
     */
    @PostMapping("/auth")
    public ResponseEntity<ReviewDto> createReviewAuthenticated(@Valid @RequestBody ReviewDto reviewDto, @RequestParam Long enterpriseId, @RequestHeader("Authorization") String token) {

        if (token.isEmpty()) {
            throw new UnauthorizedException("Not allowed to review");
        }

        Enterprise enterprise = enterpriseService.getEnterpriseById(enterpriseId);
        Review review = ReviewMapper.toEntity(reviewDto, enterprise);
        Review createdReview = reviewService.createReview(review, enterpriseId, token);
        ReviewDto createdReviewDto = ReviewMapper.toDto(createdReview);
        return new ResponseEntity<>(createdReviewDto, HttpStatus.CREATED);
    }

    /**
     * Gets reviews by enterprise id.
     *
     * @param enterpriseId the enterprise id
     * @return the reviews by enterprise id
     */
    @GetMapping
    public ResponseEntity<List<ReviewDto>> getReviewsByEnterpriseId(@RequestParam Long enterpriseId) {
        List<Review> reviews = reviewService.getReviewsByEnterpriseId(enterpriseId);
        List<ReviewDto> reviewDtos = ReviewMapper.toDtos(reviews);
        return new ResponseEntity<>(reviewDtos, HttpStatus.OK);
    }

    /**
     * Gets review by id.
     *
     * @param id the id
     * @return the review by id
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReviewDto> getReviewById(@PathVariable long id) {
        Review review = reviewService.getReviewById(id);
        ReviewDto reviewDto = ReviewMapper.toDto(review);
        return new ResponseEntity<>(reviewDto, HttpStatus.OK);
    }

    /**
     * Update review response entity.
     *
     * @param id           the id
     * @param newReviewDto the new review dto
     * @param enterpriseId the enterprise id
     * @return the response entity
     */
    @PutMapping("/{id}")
    public ResponseEntity<ReviewDto> updateReview(@PathVariable long id, @Valid @RequestBody ReviewDto newReviewDto, Long enterpriseId) {
        Enterprise enterprise = enterpriseService.getEnterpriseById(enterpriseId);
        Review review = ReviewMapper.toEntity(newReviewDto, enterprise);
        Review updatedReview = reviewService.updateReview(id, review);
        ReviewDto updatedReviewDto = ReviewMapper.toDto(updatedReview);
        return new ResponseEntity<>(updatedReviewDto, HttpStatus.OK);
    }

    /**
     * Delete review response entity.
     *
     * @param id the id
     * @return the response entity
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable long id) {
        reviewService.deleteReview(id);
        return new ResponseEntity<>("Review deleted with id = " + id, HttpStatus.NO_CONTENT);
    }
}
