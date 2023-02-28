package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.Appointment;
import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.Review;
import com.hdmstuttgart.mi.backend.repository.AppointmentRepository;
import com.hdmstuttgart.mi.backend.repository.EmployeeRepository;
import com.hdmstuttgart.mi.backend.repository.EnterpriseRepository;
import com.hdmstuttgart.mi.backend.repository.ReviewRepository;
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

    public ReviewService(ReviewRepository reviewRepository, EnterpriseRepository enterpriseRepository, AppointmentRepository appointmentRepository) {
        this.reviewRepository = reviewRepository;
        this.enterpriseRepository = enterpriseRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public Review createReview(Review review, Long enterpriseId, UUID reviewUuid) {
        Appointment appointment = appointmentRepository.findById(reviewUuid).orElseThrow();
        if (appointment.isReviewed()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Appointment has already been reviewed");
        }
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
        if (reviews.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "No reviews found for enterprise with id = " + enterpriseId);
        }
        return reviews;
    }

    public Review getReviewById(long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found with id = " + id));
    }

//    public Review updateReview(long id, Review newReview) {
//        return reviewRepository.findById(id)
//                .map(review -> {
//                    review.setAuthor(newReview.getAuthor());
//                    review.setRating(newReview.getRating());
//
//                    return reviewRepository.save(employee);
//                })
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found with id = " + id));
//    }

    public void deleteReview(long id) {
        if (!reviewRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found with id = " + id);
        }
        reviewRepository.deleteById(id);
    }
}
