package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IReviewService {
    Review createReview(Review review, Long shopId, UUID reviewUuid);

    Review createReview(Review review, Long shopId);

    Review createReview(Review review, Long shopId, String token);

    Page<Review> getReviewsByShopId(Long shopId, Pageable pageable);

    Review getReviewById(long id);

    Review updateReview(long id, Review newReview, String token);

    Review uploadPhoto(long id, byte[] photoData, String token);

    Review deletePhoto(long id, String token);

    void deleteReview(long id, String token);

    Page<Review> getMyReviews(String token, Pageable pageable);
}
