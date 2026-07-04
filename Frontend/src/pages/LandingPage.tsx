import { Box, Button, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import React, { useEffect, useState, useCallback } from 'react';
import MediaCard from '../components/CardComponent/MediaCard';
import Search from '../components/Search';
import ShopHighlightsSlider from '../components/LandingPage/ShopHighlightsSlider';
import LocationBanner from '../components/LandingPage/LocationBanner';
import dayjs from 'dayjs';
import ReservationDialog from '../components/Reservation/ReservationDialog';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { reviewsAPI, shopsAPI } from '../api/apiClient';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dateAndTime, setDateAndTime] = useState(dayjs());
  const [shops, setShops] = useState([]);
  const [openModal, setOpenModal] = useState();
  const { t } = useTranslation();

  const loadData = useCallback(async () => {
    try {
      const shopsResponse = await shopsAPI.getAll(0, 6);
      const shopsData = shopsResponse.data;
      const normalizedShops = Array.isArray(shopsData?.content) ? shopsData.content : Array.isArray(shopsData) ? shopsData : [];

      const shopsWithReviews = await Promise.all(
        normalizedShops.map(async (shop) => {
          const res = await reviewsAPI.getByShop(shop.id);
          return { ...shop, reviews: res.data?.content ?? res.data ?? [] };
        })
      );

      setShops(shopsWithReviews);
    } catch (error) {
      setShops([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const rating = (shop) => {
    const sum = shop.reviews.map((review) => review.rating).reduce((a, b) => a + b, 0);
    const avg = sum / shop.reviews.length || 0;
    return avg;
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      <Box
        sx={{
          background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(93,71,58,1) 0%, rgba(160,142,131,1) 100%)',
          py: { xs: 4, sm: 5, md: 7 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            color: 'primary.contrastText',
            pb: { xs: 3, md: 5 },
            fontWeight: '400',
            fontSize: { xs: '2.125rem', sm: '3rem', md: '3.75rem' },
          }}
        >
          {t('LANDING_PAGE_TITLE')}
        </Typography>
        <Search dateAndTime={dateAndTime} setDateAndTime={setDateAndTime} />
      </Box>
      <LocationBanner />
      <Box sx={{ margin: '0 auto', maxWidth: { xs: '100%', md: '80%' }, px: { xs: 2, sm: 2, md: 0 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: '36px', p: '0 15px' }}>
          <Typography variant="h5">{t('LANDING_PAGE_SUBTITLE')}</Typography>
          <Button variant="text" onClick={() => navigate('/filter')} sx={{ fontSize: '15px' }}>
            {t('SHOW_ALL')}
          </Button>
        </Stack>
        <Divider orientation="horizontal" sx={{ m: '12px 0', borderColor: 'rgba(0, 0, 0, 0.24)' }} />
        <ShopHighlightsSlider />
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: '36px', p: '0 15px' }}>
          <Typography variant="h5">{t('LANDING_PAGE_DESCRIPTION')}</Typography>
          <Button variant="text" onClick={() => navigate('/filter')} sx={{ fontSize: '15px' }}>
            {t('SHOW_ALL')}
          </Button>
        </Stack>
        <Divider orientation="horizontal" sx={{ m: '12px 0', borderColor: 'rgba(0, 0, 0, 0.24)' }} />
        {isLoading && (
          <Stack alignItems="center" justifyContent="center" flexGrow="1" sx={{ py: 6 }}>
            <CircularProgress />
          </Stack>
        )}
        {!isLoading && (
          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={4} sx={{ pt: '20px', pb: { xs: 3, md: 1 } }}>
            {shops
              .slice(0, 5)
              .sort((a, b) => rating(b) - rating(a))
              .map((shop) => (
                <Box key={shop.id} sx={{ width: { xs: '100%', sm: 280 } }}>
                  <MediaCard shop={shop} setOpenModal={() => setOpenModal(shop.id)} />
                  {openModal === shop.id && (
                    <ReservationDialog open={openModal === shop.id} handleClose={() => setOpenModal(undefined)} shop={shop} />
                  )}
                </Box>
              ))}
          </Stack>
        )}
      </Box>
    </>
  );
};

export default LandingPage;
