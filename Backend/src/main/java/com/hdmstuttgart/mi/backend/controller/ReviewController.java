package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.model.Review;
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

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<Review> createReview(@Valid @RequestBody Review review, @RequestParam Long enterpriseId, @RequestParam UUID reviewUuid) {
        Review createdReview = reviewService.createReview(review, enterpriseId, reviewUuid);
        return new ResponseEntity<>(createdReview, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Review>> getReviewsByEnterpriseId(@RequestParam Long enterpriseId) {
        List<Review> reviews = reviewService.getReviewsByEnterpriseId(enterpriseId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable long id) {
        Review review = reviewService.getReviewById(id);
        return new ResponseEntity<>(review, HttpStatus.OK);
    }

//    @PutMapping("/{id}")
//    public ResponseEntity<Review> updateReview(@PathVariable long id, @Valid @RequestBody Review newReview) {
//        Review updatedReview = reviewService.updateReview(id, newReview);
//        return new ResponseEntity<>(updatedReview, HttpStatus.OK);
//    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable long id) {
        reviewService.deleteReview(id);
        return new ResponseEntity<>("Review deleted with id = " + id, HttpStatus.NO_CONTENT);
    }
}
