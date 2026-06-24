package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Override
    List<Review> findAll();

    Page<Review> findAllByEnterpriseId(Long enterpriseId, Pageable pageable);

    Optional<Review> findByEnterpriseIdAndReviewerId(Long enterpriseId, Long reviewerId);

    boolean existsByEnterpriseIdAndReviewerId(Long enterpriseId, Long reviewerId);

    Page<Review> findAllByReviewerId(Long reviewerId, Pageable pageable);
}
