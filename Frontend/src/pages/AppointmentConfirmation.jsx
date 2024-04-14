import { CheckCircleRounded } from '@mui/icons-material';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { confirmAppointment } from '../actions/AppointmentActions';
import { useTranslation } from 'react-i18next';

const AppointmentConfirmation = () => {
  const { routeId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    const confirmedAppointment = async () => {
      try {
        await confirmAppointment(routeId, searchParams.get('confirmationCode'));
      } catch (error) {
        setIsConfirmed(true);
        setIsLoading(false);
      }
      setIsLoading(false);
    };
    confirmedAppointment().catch((error) => console.log(error));
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Stack alignItems="center" justifyContent="center" flexGrow="1" sx={{ borderBottom: 1, borderColor: 'divider', pb: 3 }}>
        {isLoading && (
          <Stack alignItems="center" justifyContent="center" flexGrow="1">
            <CircularProgress />
          </Stack>
        )}

        {!isLoading && !isConfirmed && (
          <Fragment>
            <CheckCircleRounded sx={{ width: '5rem', height: '5rem', color: 'primary.main' }} />
            <Typography variant="p" fontSize="2rem" textAlign="center">
              {t('APPOINTMENT_CONFIRMED')}
            </Typography>
          </Fragment>
        )}

        {!isLoading && isConfirmed && (
          <Fragment>
            <CheckCircleRounded sx={{ width: '5rem', height: '5rem', color: 'primary.main' }} />
            <Typography variant="p" fontSize="2rem" textAlign="center">
              {t('APPOINTMENT_ALREADY_CONFIRMED')}
            </Typography>
          </Fragment>
        )}
      </Stack>
    </Box>
  );
};

export default AppointmentConfirmation;
