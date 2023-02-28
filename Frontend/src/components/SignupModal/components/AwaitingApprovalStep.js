import React, { useContext } from 'react';

import { Stack, Typography, Button, Box } from '@mui/material';
import { CheckCircleRounded } from '@mui/icons-material';
import { SignupContext } from '../Signup.context';

const AwaitingApprovalStep = () => {
  const { close, setActiveStep, completedSteps, verificationCode } = useContext(SignupContext);

  return (
    <>
      <Stack alignItems="center" justifyContent="center" flexGrow="1">
        <CheckCircleRounded sx={{ width: '5rem', height: '5rem', color: 'primary.main' }} />
        <Typography variant="p" fontSize="2rem" textAlign="center">
          Thank you for registering!
          <br />
          Please wait while we verify your account.
        </Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between" marginTop="auto" width="100%" gap={2}>
        <Box flexGrow={1} />
        <Button onClick={close} variant="contained">
          Finish
        </Button>
      </Stack>
    </>
  );
};

export default AwaitingApprovalStep;
