// @ts-nocheck
import React from 'react';
import { Button, Chip, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import StoreIcon from '@mui/icons-material/Store';
import PersonIcon from '@mui/icons-material/Person';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { appointmentsAPI } from '../../api/apiClient';

const formatDateTime = (dateTime) => {
  if (!dateTime) return '';
  return new Date(dateTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

const AppointmentList = ({ appointments = [], loading, onRefetch }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cancelling, setCancelling] = React.useState(null);

  const handleCancel = async (appointment) => {
    if (!window.confirm(t('CONFIRM_CANCEL_APPOINTMENT', 'Termin wirklich absagen?'))) return;
    setCancelling(appointment.id);
    try {
      await appointmentsAPI.cancel(appointment.id, appointment.confirmationCode);
      await onRefetch();
    } catch (error) {
      console.error('Cancel failed', error);
    } finally {
      setCancelling(null);
    }
  };

  const renderCard = (appointment, allowCancel) => (
    <Paper
      key={appointment.id}
      elevation={2}
      onClick={() => appointment.shopId && navigate(`/shops/${appointment.shopId}`)}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        cursor: appointment.shopId ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s, transform 0.15s',
        '&:hover': appointment.shopId ? { boxShadow: 6, transform: 'translateY(-2px)' } : {},
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
      >
        <Stack gap={1} flex={1} minWidth={0}>
          <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
            <EventIcon fontSize="small" color="primary" />
            <Typography variant="body1" fontWeight={600}>
              {formatDateTime(appointment.appointmentDateTime)}
            </Typography>
            {appointment.endDateTime && (
              <Typography variant="body2" color="text.secondary">
                – {new Date(appointment.endDateTime).toLocaleTimeString(undefined, { timeStyle: 'short' })}
              </Typography>
            )}
          </Stack>

          {appointment.shopName && (
            <Stack direction="row" alignItems="center" gap={1}>
              <StoreIcon fontSize="small" color="action" />
              <Typography variant="body2">{appointment.shopName}</Typography>
            </Stack>
          )}

          {appointment.employeeName && (
            <Stack direction="row" alignItems="center" gap={1}>
              <PersonIcon fontSize="small" color="action" />
              <Typography variant="body2">{appointment.employeeName}</Typography>
            </Stack>
          )}

          {appointment.services?.length > 0 && (
            <Stack direction="row" gap={0.5} flexWrap="wrap">
              {appointment.services.map((service) => (
                <Chip key={service.id} label={service.title} size="small" variant="outlined" />
              ))}
            </Stack>
          )}
        </Stack>

        <Stack
          direction={{ xs: 'row', sm: 'column' }}
          alignItems={{ xs: 'center', sm: 'flex-end' }}
          justifyContent="space-between"
          gap={1}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          <Chip
            label={appointment.confirmed ? t('APPOINTMENT_CONFIRMED', 'Bestätigt') : t('PENDING', 'Ausstehend')}
            color={appointment.confirmed ? 'success' : 'warning'}
            size="small"
          />
          {allowCancel && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              disabled={cancelling === appointment.id}
              onClick={(event) => {
                event.stopPropagation();
                handleCancel(appointment);
              }}
            >
              {cancelling === appointment.id ? <CircularProgress size={16} /> : t('CANCEL_APPOINTMENT', 'Absagen')}
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );

  const now = new Date();
  const upcoming = appointments.filter((appointment) => new Date(appointment.appointmentDateTime) >= now);
  const past = appointments.filter((appointment) => new Date(appointment.appointmentDateTime) < now);

  return (
    <>
      <Typography variant="h6" fontWeight={600} mb={2}>
        {t('UPCOMING', 'Bevorstehend')}
      </Typography>
      {loading ? (
        <Stack alignItems="center" mt={8}>
          <CircularProgress />
        </Stack>
      ) : (
        <>
          {upcoming.length === 0 ? (
            <Typography color="text.secondary" mb={4}>
              {t('NO_UPCOMING_APPOINTMENTS', 'Keine bevorstehenden Termine.')}
            </Typography>
          ) : (
            <Stack gap={2} mb={4}>
              {upcoming.map((appointment) => renderCard(appointment, true))}
            </Stack>
          )}

          <Typography variant="h6" fontWeight={600} mb={2}>
            {t('PAST', 'Vergangen')}
          </Typography>
          {past.length === 0 ? (
            <Typography color="text.secondary">{t('NO_PAST_APPOINTMENTS', 'Keine vergangenen Termine.')}</Typography>
          ) : (
            <Stack gap={2}>{past.map((appointment) => renderCard(appointment, false))}</Stack>
          )}
        </>
      )}
    </>
  );
};

export default AppointmentList;
