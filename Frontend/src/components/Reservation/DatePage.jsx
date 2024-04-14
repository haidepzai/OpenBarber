import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import Stylist from './Stylist';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTimePicker } from '@mui/x-date-pickers';

const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };

const DatePage = ({ pickedStylist, pickStylist, pickedDate, pickDate, shopEmployees }) => {
  const [expanded, setExpanded] = useState(false);

  const { t } = useTranslation();

  const handlePick = (employee) => {
    pickStylist(employee);
    setExpanded(false);
  };

  return (
    <Box sx={{ padding: '20px', overflowY: 'auto' }}>
      <Typography variant="h6" sx={{ marginBottom: '20px' }}>
        {t('RESERVATION_TITLE')}
      </Typography>
      <Typography variant="overline" display="block" gutterBottom>
        {t('CHOOSE_STYLIST')}
      </Typography>
      <Accordion sx={{ marginBottom: '20px' }} expanded={expanded}>
        <Box sx={{ position: 'relative' }} onClick={() => setExpanded(!expanded)}>
          <Stylist employee={pickedStylist} onClick={setExpanded} selected />
          <Box sx={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)' }}>
            {expanded ? (
              <IconButton type="button" aria-label="delete">
                <ExpandLessIcon />
              </IconButton>
            ) : (
              <IconButton type="button" aria-label="delete">
                <ExpandMoreIcon />
              </IconButton>
            )}
          </Box>
        </Box>
        {shopEmployees
          .filter((employee) => employee.name !== pickedStylist.name)
          .map((employee) => (
            <Stylist key={employee.name} employee={employee} onClick={() => handlePick(employee)} />
          ))}
      </Accordion>

      <Typography variant="overline" display="block" gutterBottom sx={{ marginBottom: '20px' }}>
        {t('CHOOSE_DATE')}
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label={t('CHOOSE_DATE')}
          displayStaticWrapperAs="desktop"
          openTo="day"
          value={pickedDate}
          onChange={(newValue) => {
            pickDate(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>

      {pickedDate && (
        <Box sx={{ width: '100%', border: '1px solid rgb(236,236,236)', padding: '10px 20px', boxSizing: 'border-box', marginTop: '20px' }}>
          <Typography sx={{ fontSize: '14px' }}>{t('APPOINTMENT_ON', { date: `${pickedDate.toLocaleString('de-DE', options)}` })} </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DatePage;
