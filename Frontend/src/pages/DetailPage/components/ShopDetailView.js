import React, { useEffect } from 'react';

import { Box, Typography, useMediaQuery } from '@mui/material';

import ShopInfoCard from './ShopInfoCard';
import ShopReview from './ShopReview';
import axios from 'axios';

const ShopDetailView = ({ shop }) => {
  const mobile = useMediaQuery('(max-width: 800px)');
  const sidePadding = mobile ? '2vw' : '10vw';

  const [reviews, setReviews] = React.useState([]);
  useEffect(() => {
    axios.get("http://localhost:8080/api/reviews?enterpriseId=" + shop.id).then(res => {
      setReviews(res.data);
    }).catch(err => {
      console.error("review request failed", err);
    });
  }, [])

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

      <Typography variant="h4" textAlign="center">
        Reviews
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {reviews && reviews.length > 0 && reviews.map((review, i) => (
          <ShopReview key={i} review={review} />
        ))}
      </Box>
    </Box>
  );
};

export default ShopDetailView;
