import React, { useState } from 'react';
import { Box, Button, Chip, IconButton, Stack, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import Stylist from './Stylist';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const SLOT_INTERVAL_MIN = 15;

const parseTime = (timeStr) => {
  if (!timeStr) return null;
  if (timeStr.includes('T')) {
    const d = new Date(timeStr);
    return { h: d.getUTCHours(), m: d.getUTCMinutes() };
  }
  const [h, m] = timeStr.split(':').map(Number);
  return { h, m };
};

const DEFAULT_OPEN = { h: 8, m: 0 };
const DEFAULT_CLOSE = { h: 20, m: 0 };

const generateSlots = (openingTime, closingTime) => {
  const open = parseTime(openingTime) ?? DEFAULT_OPEN;
  const close = parseTime(closingTime) ?? DEFAULT_CLOSE;
  const slots = [];
  let cur = open.h * 60 + open.m;
  const end = close.h * 60 + close.m;
  while (cur < end) {
    const h = Math.floor(cur / 60);
    const m = cur % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    cur += SLOT_INTERVAL_MIN;
  }
  return slots;
};

const DatePage = ({ pickedStylist, pickStylist, pickedDate, pickDate, shopEmployees, openingTime, closingTime }) => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();

  const slots = generateSlots(openingTime, closingTime);

  const pickedDay = pickedDate ? dayjs(pickedDate) : null;
  const pickedTimeStr = pickedDay ? pickedDay.format('HH:mm') : null;

  const handleDateChange = (newDay) => {
    if (!newDay) return;
    // Keep existing time if already selected, else don't set time yet
    if (pickedTimeStr) {
      const [h, m] = pickedTimeStr.split(':').map(Number);
      pickDate(newDay.hour(h).minute(m).second(0));
    } else {
      pickDate(newDay.startOf('day'));
    }
  };

  const handleSlotPick = (slot) => {
    const [h, m] = slot.split(':').map(Number);
    const base = pickedDay ?? dayjs();
    pickDate(base.hour(h).minute(m).second(0));
  };

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
            <IconButton type="button">
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>
        {shopEmployees
          .filter((e) => e.name !== pickedStylist.name)
          .map((e) => (
            <Stylist key={e.name} employee={e} onClick={() => handlePick(e)} />
          ))}
      </Accordion>

      <Typography variant="overline" display="block" gutterBottom>
        {t('CHOOSE_DATE')}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={t('CHOOSE_DATE')}
          value={pickedDay}
          disablePast
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </LocalizationProvider>

      {pickedDay && slots.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="overline" display="block" gutterBottom>
            {t('CHOOSE_TIME')}
            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              ({String((parseTime(openingTime) ?? DEFAULT_OPEN).h).padStart(2,'0')}:{String((parseTime(openingTime) ?? DEFAULT_OPEN).m).padStart(2,'0')} – {String((parseTime(closingTime) ?? DEFAULT_CLOSE).h).padStart(2,'0')}:{String((parseTime(closingTime) ?? DEFAULT_CLOSE).m).padStart(2,'0')})
            </Typography>
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {slots.map((slot) => (
              <Chip
                key={slot}
                label={slot}
                clickable
                color={pickedTimeStr === slot ? 'primary' : 'default'}
                variant={pickedTimeStr === slot ? 'filled' : 'outlined'}
                onClick={() => handleSlotPick(slot)}
              />
            ))}
          </Box>
        </Box>
      )}

      {pickedDay && pickedTimeStr && pickedTimeStr !== '00:00' && (
        <Box sx={{ border: '1px solid rgb(236,236,236)', p: '10px 20px', mt: 2 }}>
          <Typography sx={{ fontSize: '14px' }}>
            {t('APPOINTMENT_ON', { date: pickedDay.format('DD.MM.YYYY') + ' ' + pickedTimeStr + ' Uhr' })}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DatePage;
