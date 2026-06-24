// @ts-nocheck
import { Box, TextField, Typography, Stack, Button, Alert } from '@mui/material';
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { SignupContext } from '../../../context/Signup.context';
import AuthContext from '../../../context/auth-context';
import { useTranslation } from 'react-i18next';
import { getAccessToken } from '../../../context/tokenStorage';
import { API_ENDPOINTS } from '../../../config/constants';

const EmailVerificationStep = () => {
  const {
    data: { email, verificationCode, accountType },
    setData,
    completedSteps,
    setCompletedSteps,
    setActiveStep,
    close,
  } = useContext(SignupContext);
  const authCtx = useContext(AuthContext);

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const { t } = useTranslation();

  async function onSubmit(e) {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) {
      setError(true);
      return;
    }

    const verifyRequest = { confirmationCode: verificationCode };
    const customConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
      },
    };
    try {
      await authCtx.verifyHandler(verifyRequest, customConfig);
      if (accountType === 'customer') {
        // Customer flow: verification done, close modal and redirect
        authCtx.setIsLoggedIn(true);
        close();
      } else {
        // Shop flow: go to awaiting approval step
        setActiveStep(4);
        setCompletedSteps((cs) => {
          const res = [...cs];
          res[3] = true;
          res[4] = true;
          return res;
        });
      }
    } catch (err) {
      setError(true);
      const status = err?.response?.status;
      if (status === 410) {
        setErrorMsg(t('VERIFICATION_CODE_EXPIRED'));
      } else if (status === 429) {
        setErrorMsg(t('VERIFICATION_TOO_MANY_ATTEMPTS'));
      } else {
        setErrorMsg(t('VERIFICATION_CODE_INVALID'));
      }
    }
  }

  async function onResend() {
    setResendLoading(true);
    setResendSuccess(false);
    setError(false);
    setErrorMsg('');
    try {
      await axios.post(API_ENDPOINTS.AUTH_RESEND_VERIFICATION, {}, { headers: { Authorization: `Bearer ${getAccessToken()}` } });
      setResendSuccess(true);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 429) {
        setErrorMsg(t('RATE_LIMIT_EXCEEDED'));
      } else {
        setErrorMsg(t('RESEND_FAILED'));
      }
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <Stack component="form" height="100%" justifyContent="center" alignItems="center" gap={4} pt={16} onSubmit={onSubmit}>
      <Typography variant="h4" fontWeight="bold">
        {t('VERIFY_MAIL')}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {t('VERIFICATION_SENT')}&nbsp;
        <Box component="span" fontWeight="bold">
          {email}
        </Box>
      </Typography>
      <Typography variant="caption" color="textSecondary">
        {t('VERIFICATION_CODE_EXPIRES_IN')}
      </Typography>

      {resendSuccess && <Alert severity="success">{t('VERIFICATION_RESENT')}</Alert>}
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <TextField
        value={verificationCode}
        label={t('VERIFICATION_CODE')}
        variant="outlined"
        error={error}
        autoComplete="off"
        onInput={(e) => {
          setData((d) => ({ ...d, verificationCode: e.target.value }));
          setError(false);
          setErrorMsg('');
        }}
        onBlur={() => {
          if (!verificationCode || verificationCode.length !== 6) {
            setError(true);
          } else {
            setError(false);
          }
        }}
      />

      <Button variant="text" size="small" onClick={onResend} disabled={resendLoading}>
        {t('RESEND_VERIFICATION_CODE')}
      </Button>

      <Stack direction="row" justifyContent="space-between" marginTop="auto" width="100%" gap={2}>
        <Button variant="outlined" onClick={close} tabIndex={-1}>
          {t('CANCEL')}
        </Button>
        <Box flexGrow={1} />
        <Button
          type="submit"
          disabled={!verificationCode || verificationCode.length !== 6 || completedSteps.slice(0, accountType === 'customer' ? 2 : 3).some((e) => !e)}
          variant="contained"
        >
          {t('CONTINUE')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default EmailVerificationStep;
