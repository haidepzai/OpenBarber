import React from 'react';

import { Stack, Typography } from '@mui/material';
import { CheckCircleRounded } from '@mui/icons-material';

const AwaitingApprovalStep = () => {
  return (
    <Stack alignItems="center" justifyContent="center" flexGrow="1">
      <CheckCircleRounded sx={{ width: '5rem', height: '5rem', color: 'primary.main' }} />
      <Typography variant="p" fontSize="2rem" textAlign="center">
        Thank you for registering!
        <br />
        Please wait while we verify your account.
      </Typography>
    </Stack>
  );
};

export default AwaitingApprovalStep;
