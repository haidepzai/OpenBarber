import { Box, TextField, Typography, Stack, Button } from '@mui/material';
import React, { useContext } from 'react';
import { SignupContext } from '../Signup.context';

const EmailVerificationStep = () => {
  const {
    data: { email, verificationCode },
    setData,
    completedSteps,
    setCompletedSteps,
    setActiveStep,
    close,
  } = useContext(SignupContext);

  const [error, setError] = React.useState(false);

  function onSubmit(e) {
    e.preventDefault();
    console.log("verificationCode", verificationCode);
    if (!verificationCode) {
      setError(true);
    }
    setActiveStep(2);
    setCompletedSteps((cs) => {
      const res = [...cs];
      res[1] = true;
      return res;
    });
  }

  return (
    <Stack
      component="form"
      height="100%"
      justifyContent="center" alignItems="center"
      gap={4} pt={16}
      onSubmit={onSubmit}
    >
      <Typography variant="h4" fontWeight="bold">Verify your email</Typography>
      <Typography variant="body1" color="textSecondary">
        We sent a verification code to:&nbsp;
        <Box component="span" fontWeight="bold">{email}</Box>
      </Typography>

      <TextField
        value={verificationCode}
        label="Verification Code"
        variant="outlined"
        error={error}
        helperText={error ? 'Please enter a verification code' : ''}
        autoComplete="off"
        onInput={(e) => {
          setData((d) => ({ ...d, verificationCode: e.target.value }));
        }}
        onBlur={e => {
          if (!verificationCode) {
            e.target.setCustomValidity('Please enter a verification code');
          } else {
            e.target.setCustomValidity('');
          }
        }
        }
      />

      <Stack direction="row" justifyContent="space-between" marginTop="auto" width="100%" gap={2}>
        <Button variant="outlined" onClick={close} tabIndex={-1}>
          Cancel
        </Button>
        <Button variant="outlined" onClick={() => setActiveStep(0)}>
          Back
        </Button>
        <Box flexGrow={1} />
        <Button type="submit" disabled={!verificationCode || completedSteps.slice(0, 1).some((e) => !e)} variant="contained">
          Continue
        </Button>
      </Stack>
    </Stack>
  );
};

export default EmailVerificationStep;
