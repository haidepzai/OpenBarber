// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { LocationOn, GpsFixed, WarningAmberRounded } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { reverseGeocode } from '../../utils/geocoding';

type LocationState = 'idle' | 'loading' | 'success' | 'denied' | 'error';

const LocationBanner = () => {
  const { t } = useTranslation();
  const [state, setState] = useState<LocationState>('idle');
  const [locationName, setLocationName] = useState('');

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setState('error');
      return;
    }
    setState('loading');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const name = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          setLocationName(name);
          setState('success');
        } catch {
          setState('error');
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setState('denied');
        else setState('error');
      },
      { timeout: 10000, maximumAge: 300_000 }
    );
  };

  useEffect(() => {
    if (!navigator.permissions) return;
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted') requestLocation();
    });
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        py: 1.5,
        px: { xs: 2, sm: 3 },
        bgcolor: 'grey.50',
        borderBottom: '1px solid',
        borderColor: 'grey.200',
        flexWrap: 'wrap',
        minHeight: 52,
        textAlign: 'center',
        '& .MuiTypography-root': {
          overflowWrap: 'anywhere',
        },
      }}
    >
      {state === 'loading' && (
        <>
          <CircularProgress size={16} thickness={5} sx={{ color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {t('LOCATION_DETECTING', 'Standort wird ermittelt…')}
          </Typography>
        </>
      )}

      {state === 'success' && (
        <>
          <LocationOn fontSize="small" sx={{ color: 'primary.main' }} />
          <Typography variant="body2" color="text.primary" sx={{ maxWidth: { xs: '100%', md: 700 } }}>
            {t('LOCATION_DETECTED', 'Sie scheinen in {{location}} zu sein. Trifft das nicht zu?', { location: locationName })}
          </Typography>
          <Button
            size="small"
            variant="text"
            startIcon={<GpsFixed fontSize="small" />}
            onClick={requestLocation}
            sx={{ textTransform: 'none', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
          >
            {t('LOCATION_GET_CURRENT', 'Aktuellen Standort abrufen')}
          </Button>
        </>
      )}

      {state === 'denied' && (
        <>
          <WarningAmberRounded fontSize="small" sx={{ color: 'warning.main' }} />
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: { xs: '100%', md: 500 } }}>
            {t('LOCATION_DENIED', 'Wir konnten Ihren genauen Standort nicht ermitteln. Bitte aktivieren Sie den Standort in Ihren Browsereinstellungen.')}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<GpsFixed fontSize="small" />}
            onClick={requestLocation}
            sx={{ textTransform: 'none', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
          >
            {t('LOCATION_GET_CURRENT', 'Aktuellen Standort abrufen')}
          </Button>
        </>
      )}

      {(state === 'idle' || state === 'error') && (
        <>
          <LocationOn fontSize="small" sx={{ color: 'text.secondary' }} />
          {state === 'error' && (
            <Typography variant="body2" color="text.secondary">
              {t('LOCATION_ERROR', 'Standort konnte nicht ermittelt werden.')}
            </Typography>
          )}
          {state === 'idle' && (
            <Typography variant="body2" color="text.secondary">
              {t('LOCATION_IDLE_HINT', 'Finden Sie Barbiere in Ihrer Nähe.')}
            </Typography>
          )}
          <Button
            size="small"
            variant={state === 'error' ? 'outlined' : 'text'}
            startIcon={<GpsFixed fontSize="small" />}
            onClick={requestLocation}
            sx={{ textTransform: 'none', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
          >
            {t('LOCATION_GET_CURRENT', 'Aktuellen Standort abrufen')}
          </Button>
        </>
      )}
    </Box>
  );
};

export default LocationBanner;
