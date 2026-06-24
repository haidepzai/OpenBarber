package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.exception.UnauthorizedException;
import com.hdmstuttgart.mi.backend.exception.UserNotFoundException;
import com.hdmstuttgart.mi.backend.model.*;
import com.hdmstuttgart.mi.backend.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.UUID;

/**
 * The type Review service.
 */
@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final EnterpriseRepository enterpriseRepository;
    private final AppointmentRepository appointmentRepository;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    /**
     * Instantiates a new Review service.
     *
     * @param reviewRepository      the review repository
     * @param enterpriseRepository  the enterprise repository
     * @param appointmentRepository the appointment repository
     * @param jwtService            the jwt service
     * @param userRepository        the user repository
     */
    public ReviewService(ReviewRepository reviewRepository, EnterpriseRepository enterpriseRepository, AppointmentRepository appointmentRepository, JwtService jwtService, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.enterpriseRepository = enterpriseRepository;
        this.appointmentRepository = appointmentRepository;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    /**
     * Create review review.
     *
     * @param review       the review
     * @param enterpriseId the enterprise id
     * @param reviewUuid   the review uuid
     * @return the review
     */
    public Review createReview(Review review, Long enterpriseId, UUID reviewUuid) {
        Appointment appointment = appointmentRepository.findById(reviewUuid).orElseThrow();
        if (appointment.isReviewed()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Appointment has already been reviewed");
        }
        Enterprise enterprise = enterpriseRepository.findById(enterpriseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with id = " + enterpriseId));
        review.setEnterprise(enterprise);
        appointment.setReviewed(true);
        appointmentRepository.save(appointment);
        return reviewRepository.save(review);
    }

    /**
     * Create review review.
     *
     * @param review       the review
     * @param enterpriseId the enterprise id
     * @return the review
     */
    public Review createReview(Review review, Long enterpriseId) {
        Enterprise enterprise = enterpriseRepository.findById(enterpriseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with id = " + enterpriseId));
        review.setEnterprise(enterprise);
        return reviewRepository.save(review);
    }

    /**
     * Create review review.
     *
     * @param review       the review
     * @param enterpriseId the enterprise id
     * @param token        the token
     * @return the review
     */
    public Review createReview(Review review, Long enterpriseId, String token) {
        String username = jwtService.extractUsername(token.substring(7));

        User reviewer = userRepository.findByEmail(username)
                .orElseThrow(() -> new UnauthorizedException("Not allowed to review"));

        if (reviewRepository.existsByEnterpriseIdAndReviewerId(enterpriseId, reviewer.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already reviewed this enterprise");
        }

        Enterprise enterprise = enterpriseRepository.findById(enterpriseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with id = " + enterpriseId));
        review.setEnterprise(enterprise);
        review.setReviewer(reviewer);
        return reviewRepository.save(review);
    }

    /**
     * Gets reviews by enterprise id.
     *
     * @param enterpriseId the enterprise id
     * @return the reviews by enterprise id
     */
    public Page<Review> getReviewsByEnterpriseId(Long enterpriseId, Pageable pageable) {
        if (!enterpriseRepository.existsById(enterpriseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with id = " + enterpriseId);
        }
        return reviewRepository.findAllByEnterpriseId(enterpriseId, pageable);
    }

    /**
     * Gets review by id.
     *
     * @param id the id
     * @return the review by id
     */
    public Review getReviewById(long id) {
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
    public Review updateReview(long id, Review newReview, String token) {
        String username = jwtService.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UnauthorizedException("Not authorized"));
        Review existingReview = getReviewById(id);
        if (existingReview.getReviewer() == null || !existingReview.getReviewer().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only edit your own reviews");
        }
        existingReview.setComment(newReview.getComment());
        existingReview.setRating(newReview.getRating());
        return reviewRepository.save(existingReview);
    }

    public void deleteReview(long id, String token) {
        String username = jwtService.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UnauthorizedException("Not authorized"));
        Review review = getReviewById(id);
        if (review.getReviewer() == null || !review.getReviewer().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only delete your own reviews");
        }
        reviewRepository.deleteById(id);
    }

    public Page<Review> getMyReviews(String token, Pageable pageable) {
        String username = jwtService.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UnauthorizedException("Not authorized"));
        return reviewRepository.findAllByReviewerId(user.getId(), pageable);
    }
}
