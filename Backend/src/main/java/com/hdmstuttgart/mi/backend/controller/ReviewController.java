package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.exception.UnauthorizedException;
import com.hdmstuttgart.mi.backend.mapper.ReviewMapper;
import com.hdmstuttgart.mi.backend.model.Shop;
import com.hdmstuttgart.mi.backend.model.Review;
import com.hdmstuttgart.mi.backend.model.dto.ReviewDto;
import com.hdmstuttgart.mi.backend.service.IShopService;
import com.hdmstuttgart.mi.backend.service.IReviewService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import javax.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * The type Review controller.
 */
@Api(value = "Review Controller", description = "Operations related to Review", tags = "Review")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final IReviewService reviewService;
    private final IShopService shopService;

    /**
     * Instantiates a new Review controller.
     *
     * @param reviewService     the review service
     * @param shopService the shop service
     */
    public ReviewController(IReviewService reviewService, IShopService shopService) {
        this.reviewService = reviewService;
        this.shopService = shopService;
    }

    /**
     * Create review response entity.
     *
     * @param reviewDto    the review dto
     * @param shopId the shop id
     * @param reviewUuid   the review uuid
     * @return the response entity
     */
    @ApiOperation(value = "Create Review", notes = "Creates a new review for the given shop ID and UUID")
    @PostMapping
    public ResponseEntity<ReviewDto> createReview(@Valid @RequestBody ReviewDto reviewDto, @RequestParam Long shopId,@RequestParam UUID reviewUuid) {
        Shop shop = shopService.getShopById(shopId);
        Review review = ReviewMapper.toEntity(reviewDto, shop);
        Review createdReview = reviewService.createReview(review, shopId, reviewUuid);
        ReviewDto createdReviewDto = ReviewMapper.toDto(createdReview);
        return new ResponseEntity<>(createdReviewDto, HttpStatus.CREATED);
    }

    /**
     * Create review for shop response entity.
     *
     * @param reviewDto    the review dto
     * @param shopId the shop id
     * @return the response entity
     */
    @ApiOperation(value = "Create Review for Shop", notes = "Creates a new review for a specific shop")
    @PostMapping("/new")
    public ResponseEntity<ReviewDto> createReviewForShop(@Valid @RequestBody ReviewDto reviewDto, @RequestParam Long shopId) {
        Shop shop = shopService.getShopById(shopId);
        Review review = ReviewMapper.toEntity(reviewDto, shop);
        Review createdReview = reviewService.createReview(review, shopId);
        ReviewDto createdReviewDto = ReviewMapper.toDto(createdReview);
        return new ResponseEntity<>(createdReviewDto, HttpStatus.CREATED);
    }

    /**
     * Create review authenticated response entity.
     *
     * @param reviewDto    the review dto
     * @param shopId the shop id
     * @param token        the token
     * @return the response entity
     */
    @ApiOperation(value = "Create Authenticated Review", notes = "Creates a new authenticated review for the given shop ID")
    @PostMapping("/auth")
    public ResponseEntity<ReviewDto> createReviewAuthenticated(@Valid @RequestBody ReviewDto reviewDto, @RequestParam Long shopId, @RequestHeader("Authorization") String token) {

        if (token.isEmpty()) {
            throw new UnauthorizedException("Not allowed to review");
        }

        Shop shop = shopService.getShopById(shopId);
        Review review = ReviewMapper.toEntity(reviewDto, shop);
        Review createdReview = reviewService.createReview(review, shopId, token);
        ReviewDto createdReviewDto = ReviewMapper.toDto(createdReview);
        return new ResponseEntity<>(createdReviewDto, HttpStatus.CREATED);
    }

    /**
     * Gets reviews by shop id.
     *
     * @param shopId the shop id
     * @return the reviews by shop id
     */
    @ApiOperation(value = "Get My Reviews", notes = "Returns all reviews written by the authenticated user")
    @GetMapping("/my")
    public ResponseEntity<Page<ReviewDto>> getMyReviews(
            @RequestHeader("Authorization") String token,
            @PageableDefault(size = 50) Pageable pageable) {
        Page<Review> page = reviewService.getMyReviews(token, pageable);
        return ResponseEntity.ok(page.map(ReviewMapper::toDto));
    }

    @ApiOperation(value = "Get Reviews by Shop ID", notes = "Retrieves paginated reviews for a specific shop by its ID")
    @GetMapping
    public ResponseEntity<Page<ReviewDto>> getReviewsByShopId(
            @RequestParam Long shopId,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<Review> page = reviewService.getReviewsByShopId(shopId, pageable);
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
     * @param shopId the shop id
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

    @PostMapping(value = "/{id}/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReviewDto> uploadReviewPhoto(
            @PathVariable long id,
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String token) throws IOException {
        Review updated = reviewService.uploadPhoto(id, file.getBytes(), token);
        return ResponseEntity.ok(ReviewMapper.toDto(updated));
    }

    @DeleteMapping("/{id}/photo")
    public ResponseEntity<ReviewDto> deleteReviewPhoto(
            @PathVariable long id,
            @RequestHeader("Authorization") String token) {
        Review updated = reviewService.deletePhoto(id, token);
        return ResponseEntity.ok(ReviewMapper.toDto(updated));
    }

    @ApiOperation(value = "Delete Review", notes = "Deletes a review (owner only)")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable long id,
            @RequestHeader("Authorization") String token) {
        reviewService.deleteReview(id, token);
        return new ResponseEntity<>("Review deleted with id = " + id, HttpStatus.NO_CONTENT);
    }
}
