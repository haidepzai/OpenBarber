// @ts-nocheck
import React, { useContext, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import { SignupContext } from '../../../context/Signup.context';
import { useTranslation } from 'react-i18next';

const RoleSelectStep = () => {
  const signUpCtx = useContext(SignupContext);
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(null); // 'customer' | 'shop' | null

  const select = (type) => {
    signUpCtx.setData((d) => ({ ...d, accountType: type }));
    signUpCtx.setActiveStep(1);
    signUpCtx.setCompletedSteps((v) => {
      const res = [...v];
      res[0] = true;
      return res;
    });
  };

  const customerHovered = hovered === 'customer';
  const shopHovered = hovered === 'shop';

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
          onMouseEnter={() => setHovered('customer')}
          onMouseLeave={() => setHovered(null)}
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
            backgroundColor: customerHovered ? 'primary.main' : 'transparent',
          }}
        >
          <PersonIcon sx={{ fontSize: 60, color: customerHovered ? '#fff' : 'primary.main', transition: 'color 0.2s' }} />
          <Typography variant="h6" fontWeight="600" sx={{ color: customerHovered ? '#fff' : 'text.primary', transition: 'color 0.2s' }}>
            {t('AS_CUSTOMER')}
          </Typography>
          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: customerHovered ? 'rgba(255,255,255,0.85)' : 'text.secondary', transition: 'color 0.2s' }}
          >
            {t('AS_CUSTOMER_DESC')}
          </Typography>
          <Button
            variant={customerHovered ? 'outlined' : 'contained'}
            fullWidth
            sx={
              customerHovered
                ? { borderColor: '#fff', color: '#fff', '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' } }
                : {}
            }
            onClick={(e) => {
              e.stopPropagation();
              select('customer');
            }}
          >
            {t('CONTINUE')}
          </Button>
        </Box>

        <Box
          onClick={() => select('shop')}
          onMouseEnter={() => setHovered('shop')}
          onMouseLeave={() => setHovered(null)}
          sx={{
            cursor: 'pointer',
            border: '2px solid',
            borderColor: shopHovered ? 'grey.800' : 'grey.400',
            borderRadius: 4,
            padding: 5,
            width: '220px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s',
            backgroundColor: shopHovered ? 'grey.800' : 'transparent',
          }}
        >
          <StoreIcon sx={{ fontSize: 60, color: shopHovered ? '#fff' : 'text.secondary', transition: 'color 0.2s' }} />
          <Typography variant="h6" fontWeight="600" sx={{ color: shopHovered ? '#fff' : 'text.primary', transition: 'color 0.2s' }}>
            {t('AS_SHOP')}
          </Typography>
          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: shopHovered ? 'rgba(255,255,255,0.85)' : 'text.secondary', transition: 'color 0.2s' }}
          >
            {t('AS_SHOP_DESC')}
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            sx={
              shopHovered ? { borderColor: '#fff', color: '#fff', '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' } } : {}
            }
            onClick={(e) => {
              e.stopPropagation();
              select('shop');
            }}
          >
            {t('CONTINUE')}
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
};

export default RoleSelectStep;
