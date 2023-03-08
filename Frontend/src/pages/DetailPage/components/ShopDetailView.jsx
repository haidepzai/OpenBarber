import React, { useEffect, useState } from 'react';

import { Box, Stack, Typography, useMediaQuery } from '@mui/material';

import ShopInfoCard from './ShopInfoCard';
import ShopReview from './ShopReview';
import axios from 'axios';
import barberShops from '../../../mocks/shops';
import Review from '../../../components/Review';
import { CheckCircleRounded } from '@mui/icons-material';

const ShopDetailView = ({ shop }) => {
  const mobile = useMediaQuery('(max-width: 800px)');
  const sidePadding = mobile ? '2vw' : '10vw';

  const [reviews, setReviews] = useState([]);
  const [mockReviews, setMockReviews] = useState([]);

  const [isReviewed, setIsReviewed] = useState(false);

  useEffect(() => {
    const fakeReviews = Object.values(barberShops)[0].reviews;
    setMockReviews(fakeReviews);
    axios
      .get('http://localhost:8080/api/reviews?enterpriseId=' + shop.id)
      .then((res) => {
        setReviews(res.data);
      })
      .catch((err) => {
        console.error('review request failed', err);
      });
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        margin: `calc(40vh - 4rem) ${sidePadding} 0 ${sidePadding}`,
        gap: 4,
      }}
    >
      <ShopInfoCard shop={shop} mobile={mobile} />

      {!isReviewed && <Review shop={shop} onReview={() => setIsReviewed(true)} />}

      {isReviewed && (
        <Stack alignItems="center" justifyContent="center" flexGrow="1" sx={{ borderBottom: 1, borderColor: 'divider', pb: 3 }}>
          <CheckCircleRounded sx={{ width: '5rem', height: '5rem', color: 'primary.main' }} />
          <Typography variant="p" fontSize="2rem" textAlign="center">
            Thank you for your review!
          </Typography>
        </Stack>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {reviews &&
          reviews.length > 0 &&
          reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((review, i) => <ShopReview key={i} review={review} />)}
      </Box>
    </Box>
  );
};

export default ShopDetailView;
