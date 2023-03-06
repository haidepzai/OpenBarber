import React, { useState } from 'react';
import { Box, Stack, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import EventIcon from '@mui/icons-material/Event';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { usePlacesWidget } from 'react-google-autocomplete';
import { getCurrentLocation, getGeocoordinates } from '../context/GoogleMapsActions';
import { useNavigate } from 'react-router-dom';

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API;

function Search({ dateAndTime, setDateAndTime }) {
  const navigate = useNavigate();

  /*const [dateValue, setDateValue] = useState(dayjs());*/
  const [location, setLocation] = useState('');

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);

  const { ref: materialRef } = usePlacesWidget({
    apiKey: GOOGLE_API_KEY,
    onPlaceSelected: (place) => {
      setLocation(place);
    },
  });

  const handleSubmit = async (event) => {
    console.log(dateAndTime);
    if (location !== '') {
      const loc = location.formatted_address;
      console.log(location.formatted_address);
      const response = await getGeocoordinates(location.formatted_address);
      const lat = response.results[0].geometry.location.lat;
      const lng = response.results[0].geometry.location.lng;
      console.log('Lat: ' + lat);
      console.log('Lng: ' + lng);

      /*navigate({
        pathname: '/filter',
        search: `?location=${loc}`,
      });*/

      navigate('/filter', { state: { dateAndTime: dateAndTime.toISOString(), loc: loc } });
    } else {
      const loc = getCurrentLocation();
      navigate('/filter', { state: { dateAndTime: dateAndTime.toISOString(), loc: loc } });      
    }
  };

  return (
    <Stack direction="row" justifyContent="center" alignItems="center" gap={2} /*sx={{ p: '50px 0px' }}*/>
      <Box sx={{ position: 'relative' }}>
        <Button
          color="white"
          variant="contained"
          onClick={() => {
            setOpenDatePicker(!openDatePicker);
            setOpenTimePicker(false);
          }}
          startIcon={<EventIcon />}
          endIcon={<ExpandMoreIcon />}
          size="large"
          sx={{ p: '10.875px 22px' }}
        >
          {dateAndTime.format('DD/MM/YYYY')}
        </Button>

        {openDatePicker && (
          <Box sx={{ position: 'absolute', top: '49px', left: 0, boxShadow: '-3px 3px 8px 2px rgba(0,0,0,0.4)', zIndex: '3' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                openTo="day"
                value={dateAndTime}
                onChange={(newValue) => {
                  setDateAndTime(newValue);
                  setOpenDatePicker(false);
                }}
                onClick={() => setOpenDatePicker(false)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
        )}
      </Box>

      <Box sx={{ position: 'relative' }}>
        <Button
          color="white"
          variant="contained"
          onClick={() => {
            setOpenTimePicker(!openTimePicker);
            setOpenDatePicker(false);
          }}
          startIcon={<AccessTimeIcon />}
          endIcon={<ExpandMoreIcon />}
          size="large"
          sx={{ p: '10.875px 22px' }}
        >
          {dateAndTime.format('HH:mm A')}
        </Button>

        {openTimePicker && (
          <Box
            sx={{
              position: 'absolute',
              top: '49px',
              left: 0,
              boxShadow: '-3px 3px 8px 2px rgba(0,0,0,0.4)',
              zIndex: '3',
              borderRadius: '4px',
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
        )}
      </Box>

      <TextField
        label="Location"
        onChange={(e) => setLocation(e.target.value)}
        variant="filled"
        size="small"
        inputRef={materialRef}
        sx={{
          '& .MuiInputBase-root': {
            backgroundColor: 'white.main',
            borderRadius: '4px',
            boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
            /*paddingTop: "17px",*/
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
        sx={{ p: '10.875px 50px', borderRadius: '100px', ml: '16px' }}
        onClick={handleSubmit}
      >
        Let's go!
      </Button>
    </Stack>
  );
}

export default Search;
