import React from 'react';
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import Overview from './Overview';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const SuccessScreen = ({ data, onClose }) => {
  return (
    <Box sx={{ padding: '40px 40px 20px 40px', position: 'relative' }}>
      <IconButton sx={{ position: 'absolute', right: '5px', top: '5px' }} onClick={onClose}>
        <CloseIcon sx={{ fontSize: '30px' }} />
      </IconButton>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
        <CheckIcon sx={{ fontSize: 40, color: (theme) => theme.palette.success.light }} />
        <Typography variant="h6" sx={{ marginBottom: '20px' }}>
          Your booking was successfull!
        </Typography>
        <CheckIcon sx={{ fontSize: 40, color: (theme) => theme.palette.success.light }} />
      </Stack>
      <Divider sx={{ margin: '20px 0 10px 0' }} />
      <Typography variant="overline" display="block">
        Name
      </Typography>
      <Typography variant="body1">{data.personalData.firstName + ' ' + data.personalData.lastName}</Typography>
      <Divider sx={{ margin: '10px 0' }} />
      <Typography variant="overline" display="block">
        E-Mail
      </Typography>
      <Typography variant="body1">{data.personalData.email}</Typography>
      <Divider sx={{ margin: '10px 0' }} />
      <Typography variant="overline" display="block" gutterBottom>
        Booking Details
      </Typography>
      <Overview booked data={data} />
    </Box>
  );
};

export default SuccessScreen;
