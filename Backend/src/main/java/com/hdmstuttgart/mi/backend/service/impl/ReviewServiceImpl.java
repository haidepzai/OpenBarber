package com.hdmstuttgart.mi.backend.service.impl;

import com.hdmstuttgart.mi.backend.exception.UnauthorizedException;
import com.hdmstuttgart.mi.backend.model.Appointment;
import com.hdmstuttgart.mi.backend.model.Review;
import com.hdmstuttgart.mi.backend.model.Shop;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.repository.AppointmentRepository;
import com.hdmstuttgart.mi.backend.repository.ReviewRepository;
import com.hdmstuttgart.mi.backend.repository.ShopRepository;
import com.hdmstuttgart.mi.backend.repository.UserRepository;
import com.hdmstuttgart.mi.backend.service.IJwtService;
import com.hdmstuttgart.mi.backend.service.IReviewService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

/**
 * The type Review service.
 */
@Service
public class ReviewServiceImpl implements IReviewService {

    private final ReviewRepository reviewRepository;
    private final ShopRepository shopRepository;
    private final AppointmentRepository appointmentRepository;
    private final IJwtService jwtService;
    private final UserRepository userRepository;

    /**
     * Instantiates a new Review service.
     *
     * @param reviewRepository      the review repository
     * @param shopRepository        the shop repository
     * @param appointmentRepository the appointment repository
     * @param jwtService            the jwt service
     * @param userRepository        the user repository
     */
    public ReviewServiceImpl(final ReviewRepository reviewRepository, final ShopRepository shopRepository, final AppointmentRepository appointmentRepository, final IJwtService jwtService, final UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.shopRepository = shopRepository;
        this.appointmentRepository = appointmentRepository;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    /**
     * Create review review.
     *
     * @param review     the review
     * @param shopId     the shop id
     * @param reviewUuid the review uuid
     * @return the review
     */
    public Review createReview(final Review review, final Long shopId, final UUID reviewUuid) {
        final Appointment appointment = appointmentRepository.findById(reviewUuid).orElseThrow();
        if (appointment.isReviewed()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Appointment has already been reviewed");
        }
        final Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found with id = " + shopId));
        review.setShop(shop);
        appointment.setReviewed(true);
        appointmentRepository.save(appointment);
        return reviewRepository.save(review);
    }

    /**
     * Create review review.
     *
     * @param review the review
     * @param shopId the shop id
     * @return the review
     */
    public Review createReview(final Review review, final Long shopId) {
        final Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found with id = " + shopId));
        review.setShop(shop);
        return reviewRepository.save(review);
    }

    /**
     * Create review review.
     *
     * @param review the review
     * @param shopId the shop id
     * @param token  the token
     * @return the review
     */
    public Review createReview(final Review review, final Long shopId, final String token) {
        final String username = jwtService.extractUsername(token.substring(7));

        final User reviewer = userRepository.findByEmail(username)
                .orElseThrow(() -> new UnauthorizedException("Not allowed to review"));

        if (reviewRepository.existsByShopIdAndReviewerId(shopId, reviewer.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already reviewed this shop");
        }

        final Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found with id = " + shopId));
        review.setShop(shop);
        review.setReviewer(reviewer);
        return reviewRepository.save(review);
    }

    /**
     * Gets reviews by shop id.
     *
     * @param shopId the shop id
     * @return the reviews by shop id
     */
    public Page<Review> getReviewsByShopId(final Long shopId, final Pageable pageable) {
        if (!shopRepository.existsById(shopId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found with id = " + shopId);
        }
        return reviewRepository.findAllByShopId(shopId, pageable);
    }

    /**
     * Gets review by id.
     *
     * @param id the id
     * @return the review by id
     */
    public Review getReviewById(final long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found with id = " + id));
    }

    /**
     * Update review review.
     *
     * @param id        the id
     * @param newReview the new review
     * @return the review
     */
    public Review updateReview(final long id, final Review newReview, final String token) {
        final Review existingReview = requireOwnedReview(id, token, "You can only edit your own reviews");
        existingReview.setComment(newReview.getComment());
        existingReview.setRating(newReview.getRating());
        return reviewRepository.save(existingReview);
    }

    public Review uploadPhoto(final long id, final byte[] photoData, final String token) {
        final Review review = requireOwnedReview(id, token, "You can only edit your own reviews");
        review.setPhotoData(photoData);
        return reviewRepository.save(review);
    }

    public Review deletePhoto(final long id, final String token) {
        final Review review = requireOwnedReview(id, token, "You can only edit your own reviews");
        review.setPhotoData(null);
        return reviewRepository.save(review);
    }

    public void deleteReview(final long id, final String token) {
        requireOwnedReview(id, token, "You can only delete your own reviews");
        reviewRepository.deleteById(id);
    }

    public Page<Review> getMyReviews(final String token, final Pageable pageable) {
        final User user = getAuthenticatedUser(token);
        return reviewRepository.findAllByReviewerId(user.getId(), pageable);
    }

    private User getAuthenticatedUser(final String token) {
        final String username = jwtService.extractUsername(token.substring(7));
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UnauthorizedException("Not authorized"));
    }

    private Review requireOwnedReview(final long id, final String token, final String message) {
        final User user = getAuthenticatedUser(token);
        final Review review = getReviewById(id);
        if (review.getReviewer() == null || !review.getReviewer().getId().equals(user.getId())) {
            throw new UnauthorizedException(message);
        }
        return review;
    }
}
