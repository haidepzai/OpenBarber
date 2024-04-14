import React, { useContext } from 'react';

import { Stack, Typography, Button, Box } from '@mui/material';
import { CheckCircleRounded } from '@mui/icons-material';
import { SignupContext } from '../../../context/Signup.context';
import AuthContext from '../../../context/auth-context';
import { useTranslation } from 'react-i18next';

const AwaitingApprovalStep = () => {
  const signUpContext = useContext(SignupContext);
  const authCtx = useContext(AuthContext);

  const { t } = useTranslation();

  const handleClose = () => {
    signUpContext.setSignupVisible(false);
    authCtx.setIsLoggedIn(true);
    document.body.style.overflow = '';
  };

  return (
    <>
      <Stack alignItems="center" justifyContent="center" flexGrow="1">
        <CheckCircleRounded sx={{ width: '5rem', height: '5rem', color: 'primary.main' }} />
        <Typography variant="p" fontSize="2rem" textAlign="center">
          {t('REGISTER_MESSAGE')}
          <br />
          {t('VERIFY_ACCOUNT')}
        </Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between" marginTop="auto" width="100%" gap={2}>
        <Box flexGrow={1} />
        <Button onClick={handleClose} variant="contained">
          {t('FINISH')}
        </Button>
      </Stack>
    </>
  );
};

export default AwaitingApprovalStep;
