package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.exception.UnauthorizedException;
import com.hdmstuttgart.mi.backend.model.Review;
import com.hdmstuttgart.mi.backend.model.Shop;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.repository.AppointmentRepository;
import com.hdmstuttgart.mi.backend.repository.ReviewRepository;
import com.hdmstuttgart.mi.backend.repository.ShopRepository;
import com.hdmstuttgart.mi.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReviewServiceTest {

    private static final String TOKEN = "Bearer token";

    @Mock
    private ReviewRepository reviewRepository;
    @Mock
    private ShopRepository shopRepository;
    @Mock
    private AppointmentRepository appointmentRepository;
    @Mock
    private JwtService jwtService;
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private ReviewService reviewService;

    @Test
    void createReviewWithToken_shouldSaveReviewForAuthenticatedUser() {
        User reviewer = User.builder().id(7L).email("user@example.com").build();
        Shop shop = Shop.builder().id(1L).name("Shop").build();
        Review review = Review.builder().author("Alex").comment("Great").rating(5).build();

        when(jwtService.extractUsername("token")).thenReturn("user@example.com");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(reviewer));
        when(reviewRepository.existsByShopIdAndReviewerId(1L, 7L)).thenReturn(false);
        when(shopRepository.findById(1L)).thenReturn(Optional.of(shop));
        when(reviewRepository.save(review)).thenReturn(review);

        Review result = reviewService.createReview(review, 1L, TOKEN);

        assertThat(result).isSameAs(review);
        assertThat(review.getShop()).isEqualTo(shop);
        assertThat(review.getReviewer()).isEqualTo(reviewer);
        verify(reviewRepository).save(review);
    }

    @Test
    void createReviewWithToken_shouldThrowWhenDuplicateExists() {
        User reviewer = User.builder().id(7L).email("user@example.com").build();
        when(jwtService.extractUsername("token")).thenReturn("user@example.com");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(reviewer));
        when(reviewRepository.existsByShopIdAndReviewerId(1L, 7L)).thenReturn(true);

        assertThatThrownBy(() -> reviewService.createReview(Review.builder().build(), 1L, TOKEN))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatus()).isEqualTo(HttpStatus.CONFLICT));

        verify(shopRepository, never()).findById(anyLong());
        verify(reviewRepository, never()).save(any());
    }

    @Test
    void createReviewWithToken_shouldThrowWhenShopMissing() {
        User reviewer = User.builder().id(7L).email("user@example.com").build();
        when(jwtService.extractUsername("token")).thenReturn("user@example.com");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(reviewer));
        when(reviewRepository.existsByShopIdAndReviewerId(1L, 7L)).thenReturn(false);
        when(shopRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reviewService.createReview(Review.builder().build(), 1L, TOKEN))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatus()).isEqualTo(HttpStatus.NOT_FOUND));
    }

    @Test
    void createReviewGuest_shouldSaveReview() {
        Shop shop = Shop.builder().id(1L).build();
        Review review = Review.builder().author("Guest").comment("Nice").rating(4).build();
        when(shopRepository.findById(1L)).thenReturn(Optional.of(shop));
        when(reviewRepository.save(review)).thenReturn(review);

        Review result = reviewService.createReview(review, 1L);

        assertThat(result).isSameAs(review);
        assertThat(review.getShop()).isEqualTo(shop);
        verify(reviewRepository).save(review);
    }

    @Test
    void createReviewGuest_shouldThrowWhenShopMissing() {
        when(shopRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reviewService.createReview(Review.builder().build(), 1L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatus()).isEqualTo(HttpStatus.NOT_FOUND));

        verify(reviewRepository, never()).save(any());
    }

    @Test
    void getReviewsByShopId_shouldReturnPage() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Review> page = new PageImpl<>(List.of(Review.builder().id(1L).author("Alex").comment("Great").rating(5).build()));
        when(shopRepository.existsById(1L)).thenReturn(true);
        when(reviewRepository.findAllByShopId(1L, pageable)).thenReturn(page);

        Page<Review> result = reviewService.getReviewsByShopId(1L, pageable);

        assertThat(result).isEqualTo(page);
        verify(reviewRepository).findAllByShopId(1L, pageable);
    }

    @Test
    void getReviewsByShopId_shouldThrowWhenShopMissing() {
        Pageable pageable = PageRequest.of(0, 10);
        when(shopRepository.existsById(1L)).thenReturn(false);

        assertThatThrownBy(() -> reviewService.getReviewsByShopId(1L, pageable))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatus()).isEqualTo(HttpStatus.NOT_FOUND));

        verify(reviewRepository, never()).findAllByShopId(anyLong(), any());
    }

    @Test
    void updateReview_shouldUpdateOwnedReview() {
        User reviewer = User.builder().id(5L).email("user@example.com").build();
        Review existing = Review.builder().id(9L).comment("Old").rating(2).reviewer(reviewer).build();
        Review update = Review.builder().comment("New").rating(5).build();

        when(jwtService.extractUsername("token")).thenReturn("user@example.com");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(reviewer));
        when(reviewRepository.findById(9L)).thenReturn(Optional.of(existing));
        when(reviewRepository.save(existing)).thenReturn(existing);

        Review result = reviewService.updateReview(9L, update, TOKEN);

        assertThat(result.getComment()).isEqualTo("New");
        assertThat(result.getRating()).isEqualTo(5);
        verify(reviewRepository).save(existing);
    }

    @Test
    void updateReview_shouldThrowWhenUserDoesNotOwnReview() {
        User user = User.builder().id(5L).email("user@example.com").build();
        User other = User.builder().id(6L).email("other@example.com").build();
        Review existing = Review.builder().id(9L).reviewer(other).build();

        when(jwtService.extractUsername("token")).thenReturn("user@example.com");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(reviewRepository.findById(9L)).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> reviewService.updateReview(9L, Review.builder().build(), TOKEN))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessageContaining("edit your own reviews");

        verify(reviewRepository, never()).save(any());
    }

    @Test
    void deleteReview_shouldDeleteOwnedReview() {
        User reviewer = User.builder().id(5L).email("user@example.com").build();
        Review existing = Review.builder().id(9L).reviewer(reviewer).build();

        when(jwtService.extractUsername("token")).thenReturn("user@example.com");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(reviewer));
        when(reviewRepository.findById(9L)).thenReturn(Optional.of(existing));

        reviewService.deleteReview(9L, TOKEN);

        verify(reviewRepository).deleteById(9L);
    }

    @Test
    void deleteReview_shouldThrowWhenUserDoesNotOwnReview() {
        User user = User.builder().id(5L).email("user@example.com").build();
        Review existing = Review.builder().id(9L).reviewer(User.builder().id(6L).build()).build();

        when(jwtService.extractUsername("token")).thenReturn("user@example.com");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(reviewRepository.findById(9L)).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> reviewService.deleteReview(9L, TOKEN))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessageContaining("delete your own reviews");

        verify(reviewRepository, never()).deleteById(anyLong());
    }

    @Test
    void getMyReviews_shouldReturnAuthenticatedUsersReviews() {
        User reviewer = User.builder().id(5L).email("user@example.com").build();
        Pageable pageable = PageRequest.of(0, 10);
        Page<Review> page = new PageImpl<>(List.of(Review.builder().id(1L).reviewer(reviewer).build()));

        when(jwtService.extractUsername("token")).thenReturn("user@example.com");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(reviewer));
        when(reviewRepository.findAllByReviewerId(5L, pageable)).thenReturn(page);

        Page<Review> result = reviewService.getMyReviews(TOKEN, pageable);

        assertThat(result).isEqualTo(page);
        verify(reviewRepository).findAllByReviewerId(5L, pageable);
    }
}
