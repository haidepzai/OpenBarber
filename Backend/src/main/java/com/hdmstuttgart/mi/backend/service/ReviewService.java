package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.exception.UnauthorizedException;
import com.hdmstuttgart.mi.backend.exception.UserNotFoundException;
import com.hdmstuttgart.mi.backend.model.*;
import com.hdmstuttgart.mi.backend.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.UUID;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final EnterpriseRepository enterpriseRepository;
    private final AppointmentRepository appointmentRepository;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository, EnterpriseRepository enterpriseRepository, AppointmentRepository appointmentRepository, JwtService jwtService, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.enterpriseRepository = enterpriseRepository;
        this.appointmentRepository = appointmentRepository;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

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

    public Review createReview(Review review, Long enterpriseId) {
        Enterprise enterprise = enterpriseRepository.findById(enterpriseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with id = " + enterpriseId));
        review.setEnterprise(enterprise);
        return reviewRepository.save(review);
    }

    public Review createReview(Review review, Long enterpriseId, String token) {
        String username = jwtService.extractUsername(token.substring(7));

        userRepository.findByEmail(username)
                .orElseThrow(() -> new UnauthorizedException("Not allowed to review"));

        Enterprise enterprise = enterpriseRepository.findById(enterpriseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with id = " + enterpriseId));
        review.setEnterprise(enterprise);
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByEnterpriseId(Long enterpriseId) {
        if (!enterpriseRepository.existsById(enterpriseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Enterprise not found with id = " + enterpriseId);
        }

        List<Review> reviews = reviewRepository.findAllByEnterpriseId(enterpriseId);
//        if (reviews.isEmpty()) {
//            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "No reviews found for enterprise with id = " + enterpriseId);
//        }
        return reviews;
    }

    public Review getReviewById(long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found with id = " + id));
    }

    public Review updateReview(long id, Review newReview) {
        Review existingReview = getReviewById(id);
        existingReview.setAuthor(newReview.getAuthor());
        existingReview.setComment(newReview.getComment());
        existingReview.setRating(newReview.getRating());
        return reviewRepository.save(existingReview);
    }

    public void deleteReview(long id) {
        if (!reviewRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found with id = " + id);
        }
        reviewRepository.deleteById(id);
    }
}
