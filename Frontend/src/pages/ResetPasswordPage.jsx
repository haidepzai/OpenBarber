import React, { useState } from 'react';
import { Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/constants';
import { useTranslation } from 'react-i18next';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const passwordsMatch = newPassword === confirmPassword;
  const isValid = newPassword.length >= 8 && passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    setErrorMsg('');
    try {
      await axios.post(API_ENDPOINTS.AUTH_RESET_PASSWORD, { token, newPassword });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || t('RESET_PASSWORD_INVALID'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
        <Stack alignItems="center" spacing={2}>
          <ErrorOutline sx={{ fontSize: 64, color: 'error.main' }} />
          <Typography variant="h6">{t('RESET_PASSWORD_INVALID')}</Typography>
          <Button variant="contained" onClick={() => navigate('/')}>{t('BACK')}</Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh', bgcolor: '#E7E7E7' }}>
      <Box sx={{ width: '100%', maxWidth: 480, bgcolor: 'background.default', borderRadius: 4, boxShadow: 10, p: 5 }}>
        {status === 'success' ? (
          <Stack alignItems="center" spacing={3} py={2}>
            <CheckCircleOutline sx={{ fontSize: 64, color: '#3CBAAD' }} />
            <Typography variant="h6" textAlign="center">{t('RESET_PASSWORD_SUCCESS')}</Typography>
            <Button variant="contained" size="large" onClick={() => navigate('/')}>
              {t('LOGIN')}
            </Button>
          </Stack>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Typography variant="h5" fontWeight="500">{t('RESET_PASSWORD_TITLE')}</Typography>

              {status === 'error' && (
                <Typography color="error" variant="body2">{errorMsg}</Typography>
              )}

              <TextField
                label={t('RESET_PASSWORD_NEW')}
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={newPassword.length > 0 && newPassword.length < 8}
                helperText={newPassword.length > 0 && newPassword.length < 8 ? t('PLEASE_ENTER_PASSWORD') : ''}
              />
              <TextField
                label={t('RESET_PASSWORD_CONFIRM')}
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPassword.length > 0 && !passwordsMatch}
                helperText={confirmPassword.length > 0 && !passwordsMatch ? t('RESET_PASSWORD_MISMATCH') : ''}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!isValid || isLoading}
                startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : null}
              >
                {t('RESET_PASSWORD_SUBMIT')}
              </Button>
            </Stack>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;
