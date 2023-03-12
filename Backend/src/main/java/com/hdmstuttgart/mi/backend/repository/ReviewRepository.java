package com.hdmstuttgart.mi.backend.repository;

import com.hdmstuttgart.mi.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * The interface Review repository.
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Override
    List<Review> findAll();

    /**
     * Find all by enterprise id list.
     *
     * @param enterpriseId the enterprise id
     * @return the list
     */
    List<Review> findAllByEnterpriseId(Long enterpriseId);
}
