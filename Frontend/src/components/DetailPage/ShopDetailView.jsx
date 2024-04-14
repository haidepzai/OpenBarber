import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, useMediaQuery } from '@mui/material';
import { CheckCircleRounded } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import ShopInfoCard from './ShopInfoCard';
import ShopReview from './ShopReview';
import axios from 'axios';
import Review from '../../components/Review';

const ShopDetailView = ({ shop }) => {
  const mobile = useMediaQuery('(max-width: 800px)');
  const sidePadding = mobile ? '2vw' : '10vw';

  const [reviews, setReviews] = useState([]);
  const [isReviewed, setIsReviewed] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/reviews?enterpriseId=' + shop.id)
      .then((res) => {
        setReviews(res.data);
      })
      .catch((err) => {
        console.error('review request failed', err);
      });
  }, [shop.id]);

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
            {t('THANK_YOU_REVIEW')}
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
