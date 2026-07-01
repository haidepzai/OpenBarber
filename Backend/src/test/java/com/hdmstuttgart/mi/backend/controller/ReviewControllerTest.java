package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.config.JwtAuthenticationFilter;
import com.hdmstuttgart.mi.backend.config.RateLimitFilter;
import com.hdmstuttgart.mi.backend.model.Review;
import com.hdmstuttgart.mi.backend.model.Shop;
import com.hdmstuttgart.mi.backend.service.JwtService;
import com.hdmstuttgart.mi.backend.service.ReviewService;
import com.hdmstuttgart.mi.backend.service.ShopService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReviewController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReviewService reviewService;
    @MockBean
    private ShopService shopService;
    @MockBean
    private JwtService jwtService;
    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockBean
    private UserDetailsService userDetailsService;
    @MockBean
    private AuthenticationProvider authenticationProvider;
    @MockBean
    private RateLimitFilter rateLimitFilter;

    @Test
    void getReviewsByShopId_shouldReturnPage() throws Exception {
        Shop shop = Shop.builder().id(1L).name("Shop").build();
        Review review = Review.builder().id(1L).author("Alex").comment("Great").rating(5).shop(shop).build();
        when(reviewService.getReviewsByShopId(eq(1L), any()))
                .thenReturn(new PageImpl<>(List.of(review), PageRequest.of(0, 10), 1));

        mockMvc.perform(get("/api/reviews").param("shopId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].author").value("Alex"))
                .andExpect(jsonPath("$.content[0].comment").value("Great"));
    }

    @Test
    void createReview_shouldReturnCreated() throws Exception {
        UUID reviewUuid = UUID.randomUUID();
        Shop shop = Shop.builder().id(1L).name("Shop").build();
        Review created = Review.builder().id(2L).author("Alex").comment("Nice").rating(4).shop(shop).build();

        when(shopService.getShopById(1L)).thenReturn(shop);
        when(reviewService.createReview(any(Review.class), eq(1L), eq(reviewUuid))).thenReturn(created);

        mockMvc.perform(post("/api/reviews")
                        .param("shopId", "1")
                        .param("reviewUuid", reviewUuid.toString())
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  \"author\": \"Alex\",
                                  \"comment\": \"Nice\",
                                  \"rating\": 4.0
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.author").value("Alex"))
                .andExpect(jsonPath("$.comment").value("Nice"));
    }
}
