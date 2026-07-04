import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { ArrowBackRounded, CheckCircleOutline } from '@mui/icons-material';
import OpenBarberLogo from '../../assets/logo_openbarber.svg';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/constants';
import { useTranslation } from 'react-i18next';

const ForgotPasswordModal = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const portalElement = document.getElementById('overlays');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await axios.post(API_ENDPOINTS.AUTH_FORGOT_PASSWORD, { email });
      setIsSent(true);
    } catch {
      // Deliberately vague — don't reveal if email exists
      setIsSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        backdropFilter: 'blur(5px)',
        backgroundColor: 'rgba(0,0,0,0.2)',
        zIndex: 50,
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '600px',
          backgroundColor: 'background.default',
          borderRadius: 5,
          boxShadow: 10,
          padding: 5,
          boxSizing: 'border-box',
        }}
      >
        <Stack direction="row" alignItems="center" gap={2} mb={4}>
          <Button variant="outlined" size="medium" onClick={onBack} startIcon={<ArrowBackRounded />}>
            {t('BACK')}
          </Button>
          <div style={{ flexGrow: 1 }} />
          <Typography variant="h6" fontFamily="Roboto" fontWeight="500">
            OpenBarber
          </Typography>
          <img src={OpenBarberLogo} alt="logo" style={{ width: '8%' }} />
        </Stack>

        {isSent ? (
          <Stack alignItems="center" spacing={3} py={4}>
            <CheckCircleOutline sx={{ fontSize: 64, color: '#3CBAAD' }} />
            <Typography variant="h6" textAlign="center">
              {t('FORGOT_PASSWORD_SENT')}
            </Typography>
          </Stack>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Typography variant="h5" fontWeight="500">
                {t('FORGOT_PASSWORD_TITLE')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('FORGOT_PASSWORD_DESC')}
              </Typography>
              <TextField
                label={t('EMAIL_ADDRESS')}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!error}
                helperText={error}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading || !email}
                startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : null}
              >
                {t('FORGOT_PASSWORD_SEND')}
              </Button>
            </Stack>
          </form>
        )}
      </Box>
    </Box>,
    portalElement
  );
};

export default ForgotPasswordModal;
