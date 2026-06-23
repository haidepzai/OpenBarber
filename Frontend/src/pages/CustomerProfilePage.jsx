import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Typography, Chip, Divider, Stack, CircularProgress, Paper, Button, Avatar
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import StoreIcon from '@mui/icons-material/Store';
import PersonIcon from '@mui/icons-material/Person';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/auth-context';
import { appointmentsAPI } from '../api/apiClient';

const CustomerProfilePage = () => {
  const { t } = useTranslation();
  const authCtx = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const load = async () => {
    try {
      const res = await appointmentsAPI.getMy();
      setAppointments(res.data?.content ?? []);
    } catch (e) {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (a) => {
    if (!window.confirm(t('CONFIRM_CANCEL_APPOINTMENT', 'Termin wirklich absagen?'))) return;
    setCancelling(a.id);
    try {
      await appointmentsAPI.cancel(a.id, a.confirmationCode);
      await load();
    } catch (e) {
      console.error('Cancel failed', e);
    } finally {
      setCancelling(null);
    }
  };

  const formatDateTime = (dt) => {
    if (!dt) return '';
    return new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  };

  const now = new Date();
  const upcoming = appointments.filter((a) => new Date(a.appointmentDateTime) >= now);
  const past = appointments.filter((a) => new Date(a.appointmentDateTime) < now);

  const renderCard = (a, allowCancel) => (
    <Paper key={a.id} elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={1}>
        <Stack gap={1} flex={1}>
          {/* Date & time */}
          <Stack direction="row" alignItems="center" gap={1}>
            <EventIcon fontSize="small" color="primary" />
            <Typography variant="body1" fontWeight={600}>{formatDateTime(a.appointmentDateTime)}</Typography>
            {a.endDateTime && (
              <Typography variant="body2" color="text.secondary">
                – {new Date(a.endDateTime).toLocaleTimeString(undefined, { timeStyle: 'short' })}
              </Typography>
            )}
          </Stack>

          {/* Salon */}
          {a.enterpriseName && (
            <Stack direction="row" alignItems="center" gap={1}>
              <StoreIcon fontSize="small" color="action" />
              <Typography variant="body2">{a.enterpriseName}</Typography>
            </Stack>
          )}

          {/* Stylist */}
          {a.employeeName && (
            <Stack direction="row" alignItems="center" gap={1}>
              <PersonIcon fontSize="small" color="action" />
              <Typography variant="body2">{a.employeeName}</Typography>
            </Stack>
          )}

          {/* Services */}
          {a.services?.length > 0 && (
            <Stack direction="row" gap={0.5} flexWrap="wrap">
              {a.services.map((s) => (
                <Chip key={s.id} label={s.title} size="small" variant="outlined" />
              ))}
            </Stack>
          )}
        </Stack>

        <Stack alignItems="flex-end" gap={1}>
          <Chip
            label={a.confirmed ? t('APPOINTMENT_CONFIRMED', 'Bestätigt') : t('PENDING', 'Ausstehend')}
            color={a.confirmed ? 'success' : 'warning'}
            size="small"
          />
          {allowCancel && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              disabled={cancelling === a.id}
              onClick={() => handleCancel(a)}
            >
              {cancelling === a.id ? <CircularProgress size={16} /> : t('CANCEL_APPOINTMENT', 'Absagen')}
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );

  return (
    <Box sx={{ width: '60%', margin: '40px auto', minHeight: '60vh' }}>
      <Typography variant="h4" fontWeight={600} mb={1}>{t('MY_APPOINTMENTS', 'Meine Termine')}</Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>{authCtx.email}</Typography>

      {loading ? (
        <Stack alignItems="center" mt={8}><CircularProgress /></Stack>
      ) : (
        <>
          <Typography variant="h6" fontWeight={600} mb={2}>{t('UPCOMING', 'Bevorstehend')}</Typography>
          {upcoming.length === 0 ? (
            <Typography color="text.secondary" mb={4}>{t('NO_UPCOMING_APPOINTMENTS', 'Keine bevorstehenden Termine.')}</Typography>
          ) : (
            <Stack gap={2} mb={4}>{upcoming.map((a) => renderCard(a, true))}</Stack>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" fontWeight={600} mb={2}>{t('PAST', 'Vergangen')}</Typography>
          {past.length === 0 ? (
            <Typography color="text.secondary">{t('NO_PAST_APPOINTMENTS', 'Keine vergangenen Termine.')}</Typography>
          ) : (
            <Stack gap={2}>{past.map((a) => renderCard(a, false))}</Stack>
          )}
        </>
      )}
    </Box>
  );
};

export default CustomerProfilePage;

