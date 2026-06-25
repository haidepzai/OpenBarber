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
import { useTheme } from '@mui/material/styles';

const ShopDetailView = ({ shop }) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));

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
        mt: { xs: 'calc(26vh - 1.5rem)', sm: 'calc(34vh - 2rem)', md: 'calc(40vh - 4rem)' },
        mx: { xs: 2, sm: 3, md: '8vw', lg: '10vw' },
        mb: { xs: 4, md: 6 },
        gap: { xs: 3, md: 4 },
      }}
    >
      <ShopInfoCard shop={shop} mobile={mobile} reviews={reviews} />

      {!isReviewed && (
        <Box sx={{ width: '100%' }}>
          <Review
            shop={shop}
            onReview={() => {
              setIsReviewed(true);
              loadReviews();
            }}
          />
        </Box>
      )}

      {isReviewed && (
        <Stack
          alignItems="center"
          justifyContent="center"
          flexGrow="1"
          sx={{ borderBottom: 1, borderColor: 'divider', pb: 3, width: '100%' }}
        >
          <CheckCircleRounded sx={{ width: { xs: '4rem', md: '5rem' }, height: { xs: '4rem', md: '5rem' }, color: 'primary.main' }} />
          <Typography component="p" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, textAlign: 'center' }}>
            {t('THANK_YOU_REVIEW')}
          </Typography>
        </Stack>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
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
