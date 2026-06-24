import React, { useContext } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/auth-context';
import AppointmentList from '../components/profile/AppointmentList';
import ReviewList from '../components/profile/ReviewList';
import { useMyAppointments } from '../hooks/useAppointments';
import { useMyReviews } from '../hooks/useReviews';

const CustomerProfilePage = () => {
  const { t } = useTranslation();
  const authCtx = useContext(AuthContext);
  const { data: appointments = [], isLoading, refetch } = useMyAppointments();
  const { data: reviews = [], isLoading: reviewsLoading, refetch: refetchReviews } = useMyReviews();

  return (
    <Box sx={{ width: '60%', margin: '40px auto', minHeight: '60vh' }}>
      <Typography variant="h4" fontWeight={600} mb={1}>
        {t('MY_APPOINTMENTS', 'Meine Termine')}
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        {authCtx.email}
      </Typography>

      <AppointmentList appointments={appointments} loading={isLoading} onRefetch={refetch} />

      <Divider sx={{ my: 3 }} />

      <ReviewList reviews={reviews} loading={reviewsLoading} onRefetch={refetchReviews} />
    </Box>
  );
};

export default CustomerProfilePage;
