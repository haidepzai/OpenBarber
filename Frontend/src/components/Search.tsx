// @ts-nocheck
import React from 'react';
import { Box, Stack, Button, TextField, useMediaQuery, Portal } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import EventIcon from '@mui/icons-material/Event';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { usePlacesWidget } from 'react-google-autocomplete';
import { getCurrentLocation, getGeocoordinates } from '../utils/geolocation';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API;

function Search({ dateAndTime, setDateAndTime }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [location, setLocation] = React.useState('');
  const [openDatePicker, setOpenDatePicker] = React.useState(false);
  const [openTimePicker, setOpenTimePicker] = React.useState(false);
  const [dateAnchor, setDateAnchor] = React.useState({ top: 0, left: 0 });
  const [timeAnchor, setTimeAnchor] = React.useState({ top: 0, left: 0 });

  const dateButtonRef = React.useRef(null);
  const timeButtonRef = React.useRef(null);

  const { ref: materialRef } = usePlacesWidget({
    apiKey: GOOGLE_API_KEY,
    onPlaceSelected: (place) => {
      setLocation(place);
    },
  });

  const [geoError, setGeoError] = React.useState('');

  const handleSubmit = async () => {
    setGeoError('');
    try {
      if (location !== '') {
        const loc = location.formatted_address;
        const response = await getGeocoordinates(loc);
        const lat = response.results[0].geometry.location.lat;
        const lng = response.results[0].geometry.location.lng;
        navigate('/filter', { state: { dateAndTime: dateAndTime.toISOString(), loc, lat, lng } });
      } else {
        const position = await getCurrentLocation();
        navigate('/filter', {
          state: {
            dateAndTime: dateAndTime.toISOString(),
            loc: `${position.coords.latitude},${position.coords.longitude}`,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      }
    } catch {
      // If geolocation fails, still navigate to filter (without coordinates)
      navigate('/filter', { state: { dateAndTime: dateAndTime.toISOString() } });
    }
  };

  const openDate = () => {
    if (dateButtonRef.current) {
      const rect = dateButtonRef.current.getBoundingClientRect();
      setDateAnchor({ top: rect.bottom + 8, left: rect.left });
    }
    setOpenDatePicker((v) => !v);
    setOpenTimePicker(false);
  };

  const openTime = () => {
    if (timeButtonRef.current) {
      const rect = timeButtonRef.current.getBoundingClientRect();
      setTimeAnchor({ top: rect.bottom + 8, left: rect.left });
    }
    setOpenTimePicker((v) => !v);
    setOpenDatePicker(false);
  };

  const portalPickerSx = (anchor) => ({
    position: 'fixed',
    top: anchor.top,
    left: anchor.left,
    zIndex: 9999,
    boxShadow: '-3px 3px 8px 2px rgba(0,0,0,0.4)',
    borderRadius: 1,
    overflow: 'hidden',
    '& .MuiPickerStaticWrapper-root, & .MuiCalendarPicker-root, & .MuiClockPicker-root': {
      maxWidth: '100%',
    },
  });

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      justifyContent="center"
      alignItems="stretch"
      gap={2}
      sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}
    >
      <Box sx={{ position: 'relative', width: { xs: '100%', md: 'auto' } }}>
        <Button
          ref={dateButtonRef}
          color="white"
          variant="contained"
          fullWidth={isMobile}
          onClick={openDate}
          startIcon={<EventIcon />}
          endIcon={<ExpandMoreIcon />}
          size="large"
          sx={{ p: '10.875px 22px', width: { xs: '100%', md: 'auto' }, minWidth: { md: 180 }, justifyContent: 'space-between' }}
        >
          {dateAndTime.format('DD/MM/YYYY')}
        </Button>

        {openDatePicker && (
          <Portal>
            <Box sx={portalPickerSx(dateAnchor)}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                  displayStaticWrapperAs={isMobile ? 'mobile' : 'desktop'}
                  openTo="day"
                  value={dateAndTime}
                  onChange={(newValue) => {
                    setDateAndTime(newValue);
                    setOpenDatePicker(false);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>
          </Portal>
        )}
      </Box>

      <Box sx={{ position: 'relative', width: { xs: '100%', md: 'auto' } }}>
        <Button
          ref={timeButtonRef}
          color="white"
          variant="contained"
          fullWidth={isMobile}
          onClick={openTime}
          startIcon={<AccessTimeIcon />}
          endIcon={<ExpandMoreIcon />}
          size="large"
          sx={{ p: '10.875px 22px', width: { xs: '100%', md: 'auto' }, minWidth: { md: 180 }, justifyContent: 'space-between' }}
        >
          {dateAndTime.format('HH:mm A')}
        </Button>

        {openTimePicker && (
          <Portal>
            <Box
              sx={{
                ...portalPickerSx(timeAnchor),
                '& .MuiDialogActions-root': { backgroundColor: 'white.main' },
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticTimePicker
                  displayStaticWrapperAs="mobile"
                  value={dateAndTime}
                  onChange={(newValue) => {
                    setDateAndTime(newValue);
                  }}
                  onAccept={() => setOpenTimePicker(false)}
                  renderInput={(params) => <TextField {...params} />}
                  sx={{ borderRadius: '4px' }}
                />
              </LocalizationProvider>
            </Box>
          </Portal>
        )}
      </Box>

      <TextField
        label={t('LOCATION')}
        onChange={(e) => setLocation(e.target.value)}
        variant="filled"
        size="small"
        inputRef={materialRef}
        sx={{
          width: { xs: '100%', md: 320 },
          '& .MuiInputBase-root': {
            backgroundColor: 'white.main',
            borderRadius: '4px',
            boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
            '&:hover': {
              backgroundColor: 'white.main',
            },
            '&.Mui-focused': {
              backgroundColor: 'white.main',
            },
          },
        }}
      />

      <Button
        color="secondary"
        variant="contained"
        size="large"
        fullWidth={isMobile}
        sx={{ p: '10.875px 32px', borderRadius: '100px', ml: { xs: 0, md: '16px' }, whiteSpace: 'nowrap' }}
        onClick={handleSubmit}
      >
        {t('LETS_GO').toUpperCase()}
      </Button>
    </Stack>
  );
}

export default Search;
