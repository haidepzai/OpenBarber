package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.exception.UnauthorizedException;
import com.hdmstuttgart.mi.backend.mapper.ReviewMapper;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.Review;
import com.hdmstuttgart.mi.backend.model.dto.ReviewDto;
import com.hdmstuttgart.mi.backend.service.EnterpriseService;
import com.hdmstuttgart.mi.backend.service.ReviewService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

/**
 * The type Review controller.
 */
@Api(value = "Review Controller", description = "Operations related to Review", tags = "Review")
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
    @ApiOperation(value = "Create Review", notes = "Creates a new review for the given enterprise ID and UUID")
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
    @ApiOperation(value = "Create Review for Enterprise", notes = "Creates a new review for a specific enterprise")
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
    @ApiOperation(value = "Create Authenticated Review", notes = "Creates a new authenticated review for the given enterprise ID")
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
    @ApiOperation(value = "Get My Reviews", notes = "Returns all reviews written by the authenticated user")
    @GetMapping("/my")
    public ResponseEntity<Page<ReviewDto>> getMyReviews(
            @RequestHeader("Authorization") String token,
            @PageableDefault(size = 50) Pageable pageable) {
        Page<Review> page = reviewService.getMyReviews(token, pageable);
        return ResponseEntity.ok(page.map(ReviewMapper::toDto));
    }

    @ApiOperation(value = "Get Reviews by Enterprise ID", notes = "Retrieves paginated reviews for a specific enterprise by its ID")
    @GetMapping
    public ResponseEntity<Page<ReviewDto>> getReviewsByEnterpriseId(
            @RequestParam Long enterpriseId,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<Review> page = reviewService.getReviewsByEnterpriseId(enterpriseId, pageable);
        return ResponseEntity.ok(page.map(ReviewMapper::toDto));
    }

    /**
     * Gets review by id.
     *
     * @param id the id
     * @return the review by id
     */
    @ApiOperation(value = "Get Review by ID", notes = "Retrieves a specific review by its ID")
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
    @ApiOperation(value = "Update Review", notes = "Updates an existing review (owner only)")
    @PutMapping("/{id}")
    public ResponseEntity<ReviewDto> updateReview(@PathVariable long id, @Valid @RequestBody ReviewDto newReviewDto,
            @RequestHeader("Authorization") String token) {
        Review review = ReviewMapper.toEntity(newReviewDto, null);
        Review updatedReview = reviewService.updateReview(id, review, token);
        return ResponseEntity.ok(ReviewMapper.toDto(updatedReview));
    }

    @ApiOperation(value = "Delete Review", notes = "Deletes a review (owner only)")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable long id,
            @RequestHeader("Authorization") String token) {
        reviewService.deleteReview(id, token);
        return new ResponseEntity<>("Review deleted with id = " + id, HttpStatus.NO_CONTENT);
    }
}
