import React, { useContext } from 'react';

import { Stack, Typography, Button, Box } from '@mui/material';
import { CheckCircleRounded } from '@mui/icons-material';
import { SignupContext } from '../Signup.context';

const AwaitingApprovalStep = () => {

  const { close, setActiveStep, completedSteps, verificationCode } = useContext(SignupContext);
  console.log(completedSteps)

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
        <Button variant="outlined" onClick={close} tabIndex={-1}>
          Cancel
        </Button>
        <Button variant="outlined" onClick={() => setActiveStep(2)}>
          Back
        </Button>
        <Box flexGrow={1} />
        <Button onClick={close} variant="contained">
          Finish
        </Button>
      </Stack>
    </>
  );
};

export default AwaitingApprovalStep;
