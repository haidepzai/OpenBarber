import React from 'react';
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import Overview from './Overview';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

const SuccessScreen = ({ data, onClose }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ padding: '40px 40px 20px 40px', position: 'relative' }}>
      <IconButton sx={{ position: 'absolute', right: '5px', top: '5px' }} onClick={onClose}>
        <CloseIcon sx={{ fontSize: '30px' }} />
      </IconButton>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
        <CheckIcon sx={{ fontSize: 40, color: (theme) => theme.palette.success.light }} />
        <Typography variant="h6" sx={{ marginBottom: '20px' }}>
          {t('BOOKING_SUCCESS')}
        </Typography>
        <CheckIcon sx={{ fontSize: 40, color: (theme) => theme.palette.success.light }} />
      </Stack>
      <Divider sx={{ margin: '20px 0 10px 0' }} />
      <Typography variant="overline" display="block">
        {t('NAME')}
      </Typography>
      <Typography variant="body1">{data.personalData.firstName + ' ' + data.personalData.lastName}</Typography>
      <Divider sx={{ margin: '10px 0' }} />
      <Typography variant="overline" display="block">
        {t('EMAIL')}
      </Typography>
      <Typography variant="body1">{data.personalData.email}</Typography>
      <Divider sx={{ margin: '10px 0' }} />
      <Typography variant="overline" display="block" gutterBottom>
        {t('BOOKING_DETAILS')}
      </Typography>
      <Overview booked data={data} />
    </Box>
  );
};

export default SuccessScreen;
