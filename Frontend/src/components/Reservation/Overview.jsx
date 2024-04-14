import React from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import { ArrowForwardIos } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useTranslation } from 'react-i18next';

const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };

const Overview = ({ booked, data, handleStep }) => {
  const { t } = useTranslation();

  const calculateEndDate = (date, duration) => {
    date.setMinutes(date.getMinutes() + duration);
    return date.toLocaleString('de-DE', options);
  };

  const totalDuration = () => {
    return data.services.map((service) => parseInt(service.durationInMin)).reduce((prev, next) => prev + next);
  };

  const totalPrice = () => {
    return data.services.map((service) => parseInt(service.price)).reduce((prev, next) => prev + next);
  };

  return (
    <Box sx={{ borderRadius: '8px', border: '1px solid rgb(236,236,236)', marginBottom: '20px' }}>
      <Stack direction="row" alignItems="center" spacing={3} sx={{ borderTop: '1px solid rgb(236,236,236)', padding: ' 16px 24px' }}>
        <CalendarMonthIcon fontSize="large" />
        <Typography sx={{ lineHeight: 'unset' }}>{data.appointmentDateTime.toLocaleString('de-DE', options)}</Typography>
      </Stack>
      <Stack
        direction="row"
        alignItems={data.services.length > 1 ? 'start' : 'center'}
        sx={{
          borderTop: '1px solid rgb(236,236,236)',
          padding: '16px 16px 16px 24px',
          '&:hover': { backgroundColor: !booked && 'rgba(0, 0, 0, 0.1)', cursor: !booked && 'pointer' },
        }}
        onClick={() => handleStep(0)}
      >
        <ContentCutIcon fontSize="large" />
        <Stack direction="column" gap={1} sx={{ width: '100%', padding: '0 16px 0 24px' }}>
          {data.services.map((service, index) => (
            <Stack key={service.title} direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
              <Typography sx={{ lineHeight: 'unset', textTransform: 'capitalize', fontSize: data.services.length > 1 ? '14px' : '16px' }}>
                {(index !== 0 ? ' + ' : '') + service.targetAudience + ' > ' + service.title}
              </Typography>
              <Typography sx={{ lineHeight: 'unset', fontSize: data.services.length > 1 ? '14px' : '16px' }}>{service.price} &#8364;</Typography>
            </Stack>
          ))}
          {data.services.length >= 2 && (
            <Typography
              sx={{
                lineHeight: 'unset',
                fontSize: data.services.length > 1 ? '14px' : '16px',
                alignSelf: 'end',
                borderTop: '1px solid black',
                padding: '5px 5px 0 10px',
              }}
            >
              {totalPrice()} &#8364;
            </Typography>
          )}
        </Stack>
        {!booked && (
          <IconButton sx={{ alignSelf: 'center' }}>
            <ArrowForwardIos />
          </IconButton>
        )}
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          borderTop: '1px solid rgb(236,236,236)',
          padding: '13.5px 16px 13.5px 24px',
          '&:hover': { backgroundColor: !booked && 'rgba(0, 0, 0, 0.1)', cursor: !booked && 'pointer' },
        }}
        onClick={() => handleStep(1)}
      >
        <Stack direction="row" alignItems="center" spacing={3}>
          <Avatar alt="Alexandra" src={data.employee.picture} sx={{ width: 35, height: 35 }} />
          <Box>
            <Typography sx={{ lineHeight: 'unset' }}>{data.employee.name}</Typography>
            <Typography
              variant="overline"
              sx={{
                textTransform: 'uppercase',
                lineHeight: 'unset',
                color: '#666',
              }}
            >
              {data.employee.titel}
            </Typography>
          </Box>
        </Stack>
        {!booked && (
          <IconButton sx={{ alignSelf: 'center' }}>
            <ArrowForwardIos />
          </IconButton>
        )}
      </Stack>
      <Stack direction="row" alignItems="center" spacing={3} sx={{ borderTop: '1px solid rgb(236,236,236)', padding: '16px 24px' }}>
        <HourglassBottomIcon fontSize="large" />
        <Typography sx={{ lineHeight: 'unset' }}>
          {t('DURATION')}: {totalDuration()} {t('MINUTES')} (
          {t('ENDS_APROX', { time: `${calculateEndDate(data.appointmentDateTime, totalDuration())}` })})
        </Typography>
      </Stack>
    </Box>
  );
};

export default Overview;
