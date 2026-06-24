// @ts-nocheck
import React, { useCallback, useEffect, useState } from 'react';
import { Box, Chip, CircularProgress, IconButton, Typography } from '@mui/material';
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
import { shopsAPI } from '../../api/apiClient';

const DatePage = ({ pickedStylist, pickStylist, pickedDate, pickDate, shopEmployees, shopId, selectedServices }) => {
  const [expanded, setExpanded] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const { t } = useTranslation();

  const pickedDay = pickedDate ? dayjs(pickedDate) : null;
  const pickedTimeStr = pickedDay && pickedDay.hour() + pickedDay.minute() > 0 ? pickedDay.format('HH:mm') : null;

  const isAnyEmployee = !pickedStylist?.id;
  const totalDuration = (selectedServices ?? []).reduce((sum, s) => sum + (s.durationInMin ?? 30), 0) || 30;

  const fetchSlots = useCallback(
    async (day) => {
      if (!day || !shopId) return;
      setLoadingSlots(true);
      try {
        const dateStr = day.format('YYYY-MM-DD');
        const employeeId = isAnyEmployee ? null : pickedStylist.id;
        const res = await shopsAPI.getAvailableSlots(shopId, dateStr, employeeId, totalDuration);
        setAvailableSlots(res.data ?? []);
      } catch (e) {
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    },
    [shopId, isAnyEmployee, pickedStylist?.id, totalDuration]
  );

  useEffect(() => {
    if (pickedDay) fetchSlots(pickedDay);
  }, [pickedDay?.format('YYYY-MM-DD'), fetchSlots]);

  const handleDateChange = (newDay) => {
    if (!newDay) return;
    pickDate(newDay.startOf('day').toDate());
  };

  const handleSlotPick = (slot) => {
    const [h, m] = slot.time.split(':').map(Number);
    const base = pickedDay ?? dayjs();
    pickDate(base.hour(h).minute(m).second(0).toDate());
    // Auto-assign the employee linked to this slot
    if (slot.employeeId) {
      pickStylist({ id: slot.employeeId, name: slot.employeeName, picture: slot.employeePicture });
    }
  };

  const handlePick = (employee) => {
    pickStylist(employee);
    setExpanded(false);
  };

  return (
    <Box sx={{ padding: '20px', overflowY: 'auto' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t('RESERVATION_TITLE')}
      </Typography>

      <Typography variant="overline" display="block" gutterBottom>
        {t('CHOOSE_STYLIST')}
      </Typography>
      <Accordion sx={{ mb: 2 }} expanded={expanded}>
        <Box sx={{ position: 'relative' }} onClick={() => setExpanded(!expanded)}>
          <Stylist employee={pickedStylist} onClick={setExpanded} selected />
          <Box sx={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)' }}>
            <IconButton type="button">{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
          </Box>
        </Box>
        {(shopEmployees ?? [])
          .filter((e) => e.name !== pickedStylist?.name)
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

      {pickedDay && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="overline" display="block" gutterBottom>
            {t('CHOOSE_TIME')}
            {isAnyEmployee && (
              <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                ({t('ANY_EMPLOYEE_HINT', 'Beliebiger Mitarbeiter')})
              </Typography>
            )}
          </Typography>

          {loadingSlots ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : availableSlots.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t('NO_SLOTS_AVAILABLE', 'Keine freien Termine an diesem Tag.')}
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {availableSlots.map((slot) => (
                <Chip
                  key={slot.time}
                  label={slot.time}
                  clickable
                  color={pickedTimeStr === slot.time ? 'primary' : 'default'}
                  variant={pickedTimeStr === slot.time ? 'filled' : 'outlined'}
                  onClick={() => handleSlotPick(slot)}
                />
              ))}
            </Box>
          )}
        </Box>
      )}

      {pickedDay && pickedTimeStr && (
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
