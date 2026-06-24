// @ts-nocheck
import React, { useContext, useEffect, useState } from 'react';
import { Box, Stack, Typography, useMediaQuery } from '@mui/material';
import { CheckCircleRounded } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { reviewsAPI } from '../../api/apiClient';
import ShopInfoCard from './ShopInfoCard';
import ShopReview from './ShopReview';
import Review from '../../components/Review';
import AuthContext from '../../context/auth-context';

const ShopDetailView = ({ shop }) => {
  const mobile = useMediaQuery('(max-width: 800px)');
  const sidePadding = mobile ? '2vw' : '10vw';

  const [reviews, setReviews] = useState([]);
  const [isReviewed, setIsReviewed] = useState(false);
  const { t } = useTranslation();
  const authCtx = useContext(AuthContext);
  const currentUserId = authCtx.user?.id;

  const loadReviews = async () => {
    try {
      const res = await reviewsAPI.getByShop(shop.id);
      const data = res.data?.content ?? [];
      setReviews(data);
      if (currentUserId) {
        setIsReviewed(data.some((r) => r.reviewerId === currentUserId));
      }
    } catch (error) {
      setReviews([]);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [shop.id, currentUserId]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        margin: `calc(40vh - 4rem) ${sidePadding} 0 ${sidePadding}`,
        gap: 4,
      }}
    >
      <ShopInfoCard shop={shop} mobile={mobile} reviews={reviews} />

      {!isReviewed && (
        <Review
          shop={shop}
          onReview={() => {
            setIsReviewed(true);
            loadReviews();
          }}
        />
      )}

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
          reviews
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((review, i) => (
              <ShopReview
                key={review.id ?? i}
                review={review}
                onUpdated={loadReviews}
                onDeleted={() => {
                  loadReviews();
                  setIsReviewed(false);
                }}
              />
            ))}
      </Box>
    </Box>
  );
};

export default ShopDetailView;
