import React, { useContext } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import { SignupContext } from '../../../context/Signup.context';
import { useTranslation } from 'react-i18next';

const RoleSelectStep = () => {
  const signUpCtx = useContext(SignupContext);
  const { t } = useTranslation();

  const select = (type) => {
    signUpCtx.setData((d) => ({ ...d, accountType: type }));
    signUpCtx.setActiveStep(1);
    signUpCtx.setCompletedSteps((v) => {
      const res = [...v];
      res[0] = true;
      return res;
    });
  };

  return (
    <Stack height="100%" alignItems="center" justifyContent="center" gap={4}>
      <Typography variant="h4" fontWeight="bold">
        {t('REGISTER_AS')}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {t('REGISTER_AS_SUBTITLE')}
      </Typography>
      <Stack direction="row" gap={4} mt={2}>
        <Box
          onClick={() => select('customer')}
          sx={{
            cursor: 'pointer',
            border: '2px solid',
            borderColor: 'primary.main',
            borderRadius: 4,
            padding: 5,
            width: '220px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s',
            '&:hover': { backgroundColor: 'primary.main', color: 'white', '& *': { color: 'white' } },
          }}
        >
          <PersonIcon sx={{ fontSize: 60, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight="600">{t('AS_CUSTOMER')}</Typography>
          <Typography variant="body2" color="textSecondary" textAlign="center">{t('AS_CUSTOMER_DESC')}</Typography>
          <Button variant="contained" fullWidth onClick={() => select('customer')}>{t('CONTINUE')}</Button>
        </Box>

        <Box
          onClick={() => select('enterprise')}
          sx={{
            cursor: 'pointer',
            border: '2px solid',
            borderColor: 'grey.400',
            borderRadius: 4,
            padding: 5,
            width: '220px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s',
            '&:hover': { backgroundColor: 'grey.800', color: 'white', '& *': { color: 'white' } },
          }}
        >
          <StoreIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
          <Typography variant="h6" fontWeight="600">{t('AS_ENTERPRISE')}</Typography>
          <Typography variant="body2" color="textSecondary" textAlign="center">{t('AS_ENTERPRISE_DESC')}</Typography>
          <Button variant="outlined" fullWidth onClick={() => select('enterprise')}>{t('CONTINUE')}</Button>
        </Box>
      </Stack>
    </Stack>
  );
};

export default RoleSelectStep;
