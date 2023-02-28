package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Override
    List<Review> findAll();

    List<Review> findAllByEnterpriseId(Long enterpriseId);
}
