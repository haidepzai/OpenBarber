import { Box, TextField, Typography, Stack, Button } from '@mui/material';
import React, { useContext, useState } from 'react';
import { SignupContext } from '../../../context/Signup.context';
import AuthContext from '../../../context/auth-context';
import { useTranslation } from 'react-i18next';

const EmailVerificationStep = () => {
  const {
    data: { email, verificationCode },
    setData,
    completedSteps,
    setCompletedSteps,
    setActiveStep,
    close,
  } = useContext(SignupContext);
  const authCtx = useContext(AuthContext);

  const [error, setError] = useState(false);

  const { t } = useTranslation();

  async function onSubmit(e) {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) {
      setError(true);
    }

    const verifyRequest = {
      confirmationCode: verificationCode,
    };

    const customConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    };
    try {
      await authCtx.verifyHandler(verifyRequest, customConfig);

      setActiveStep(3);
      setCompletedSteps((cs) => {
        const res = [...cs];
        res[2] = true;
        res[3] = true;
        return res;
      });
    } catch (error) {
      setError(true);
      console.error(error);
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

      <TextField
        value={verificationCode}
        label="Verification Code"
        variant="outlined"
        error={error}
        helperText={error ? 'Please enter a valid code (6 digits)' : ''}
        autoComplete="off"
        onInput={(e) => {
          setData((d) => ({ ...d, verificationCode: e.target.value }));
        }}
        onBlur={() => {
          if (!verificationCode || verificationCode.length !== 6) {
            setError(true);
          } else {
            setError(false);
          }
        }}
      />

      <Stack direction="row" justifyContent="space-between" marginTop="auto" width="100%" gap={2}>
        <Button variant="outlined" onClick={close} tabIndex={-1}>
          {t('CANCEL')}
        </Button>
        {/* <Button variant="outlined" onClick={() => setActiveStep(1)}>
          Back
        </Button> */}
        <Box flexGrow={1} />
        <Button
          type="submit"
          disabled={!verificationCode || verificationCode.length !== 6 || completedSteps.slice(0, 2).some((e) => !e)}
          variant="contained"
        >
          {t('CONTINUE')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default EmailVerificationStep;
