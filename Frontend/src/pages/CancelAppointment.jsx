import { CheckCircleRounded, ErrorOutlineRounded } from '@mui/icons-material';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { cancelAppointment } from '../actions/AppointmentActions';
import { useTranslation } from 'react-i18next';

const CancelAppointment = () => {
  const { routeId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    const canceledAppointment = async () => {
      try {
        await cancelAppointment(routeId, searchParams.get('confirmationCode'));
      } catch (error) {
        setError(true);
        setIsLoading(false);
      }
      setIsLoading(false);
    };
    canceledAppointment().catch((error) => console.log(error));
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Stack alignItems="center" justifyContent="center" flexGrow="1" sx={{ borderBottom: 1, borderColor: 'divider', pb: 3 }}>
        {isLoading && (
          <Stack alignItems="center" justifyContent="center" flexGrow="1">
            <CircularProgress />
          </Stack>
        )}

        {!isLoading && !error && (
          <Fragment>
            <CheckCircleRounded sx={{ width: '5rem', height: '5rem', color: 'primary.main' }} />
            <Typography variant="p" fontSize="2rem" textAlign="center">
              {t('APPOINTMENT_CANCELED')}
            </Typography>
          </Fragment>
        )}

        {!isLoading && error && (
          <Fragment>
            <ErrorOutlineRounded sx={{ width: '5rem', height: '5rem', color: 'primary.main' }} />
            <Typography variant="p" fontSize="2rem" textAlign="center">
              {t('NO_APPOINTMENT_TO_CANCEL')}
            </Typography>
          </Fragment>
        )}
      </Stack>
    </Box>
  );
};

export default CancelAppointment;
