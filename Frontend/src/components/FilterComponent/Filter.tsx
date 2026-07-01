// @ts-nocheck
import React from 'react';
import { Button, Checkbox, Divider, FormGroup, Rating, Slider, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import CoffeeIcon from '@mui/icons-material/Coffee';
import PaymentIcon from '@mui/icons-material/Payment';
import Face2Icon from '@mui/icons-material/Face2';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import GroupsIcon from '@mui/icons-material/Groups';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import StarIcon from '@mui/icons-material/Star';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useTranslation } from 'react-i18next';
import { CalendarMonth } from '@mui/icons-material';

const paymentMethodOptions = ['ON_SITE_CASH', 'ON_SITE_CARD', 'BANK_TRANSFER', 'PAYPAL'];
const drinkOptions = ['COFFEE', 'TEA', 'WATER', 'SOFT_DRINKS', 'BEER', 'CHAMPAGNE', 'SPARKLING_WINE'];
const dayOptions = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const DEFAULT_FILTER = {
  minRating: null,
  openingDays: [],
  openingTime: null,
  closingTime: null,
  targetAudience: [],
  employeeCount: [0, 20],
  priceCategory: [],
  paymentMethods: [],
  drinks: [],
};

const ResetLink = ({ show, onReset }) => {
  const { t } = useTranslation();
  if (!show) return null;
  return (
    <Typography
      variant="caption"
      onClick={onReset}
      sx={{ ml: 'auto', cursor: 'pointer', color: 'primary.main', textDecoration: 'underline', lineHeight: 1, alignSelf: 'center' }}
    >
      {t('RESET')}
    </Typography>
  );
};

const SectionHeader = ({ icon, label, show, onReset }) => (
  <Stack direction="row" alignItems="center" sx={{ width: '100%', mb: '15px' }}>
    <FormLabel component="legend" sx={{ display: 'flex', gap: '8px', fontWeight: '500', color: 'black', m: 0 }}>
      {icon}
      {label}
    </FormLabel>
    <ResetLink show={show} onReset={onReset} />
  </Stack>
);

const Filter = ({ filter, setFilter }) => {
  const { t } = useTranslation();

  const isActive = {
    minRating: filter.minRating != null && filter.minRating > 0,
    openingDays: filter.openingDays?.length > 0,
    openingHours: filter.openingTime != null || filter.closingTime != null,
    targetAudience: filter.targetAudience?.length > 0,
    employeeCount: filter.employeeCount?.[0] !== 0 || filter.employeeCount?.[1] !== 20,
    priceCategory: filter.priceCategory?.length > 0,
    paymentMethods: filter.paymentMethods?.length > 0,
    drinks: filter.drinks?.length > 0,
  };

  const isAnyActive = Object.values(isActive).some(Boolean);

  const reset = (fields) => setFilter({ ...filter, ...fields });
  const resetAll = () => setFilter({ ...filter, ...DEFAULT_FILTER });

  const updateTargetAudience = (event, newTA) => setFilter({ ...filter, targetAudience: newTA });
  const updateEmployeeCount = (event, newValue) => setFilter({ ...filter, employeeCount: newValue });

  const updateOpeningHour = (newValue) => {
    const changedValue = newValue.set('year', 2023).set('month', 0).set('date', 1);
    setFilter({ ...filter, openingTime: changedValue.toISOString() });
  };

  const updateClosingHour = (newValue) => {
    const changedValue = newValue.set('year', 2023).set('month', 0).set('date', 1);
    setFilter({ ...filter, closingTime: changedValue.toISOString() });
  };

  const updateFilterArray = (event, value) => {
    const name = event.target.name;
    const checked = event.target.checked;
    setFilter({
      ...filter,
      [name]: checked ? [...filter[name], value] : filter[name].filter((el) => el !== value),
    });
  };

  return (
    <Stack
      direction="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      spacing={3}
      sx={{ width: 280, flexShrink: 0, padding: '20px 20px' }}
      divider={<Divider orientation="horizontal" flexItem />}
    >
      {/* Reset All */}
      {isAnyActive && (
        <Button
          startIcon={<FilterAltOffIcon />}
          onClick={resetAll}
          size="small"
          variant="outlined"
          color="primary"
          sx={{ textTransform: 'none', alignSelf: 'flex-start' }}
        >
          {t('RESET_ALL_FILTERS', 'Reset all filters')}
        </Button>
      )}

      {/* Minimum Rating */}
      <FormControl component="fieldset" variant="standard" fullWidth>
        <SectionHeader icon={<StarIcon />} label={t('MIN_RATING')} show={isActive.minRating} onReset={() => reset({ minRating: null })} />
        <Rating value={filter.minRating ?? 0} precision={0.5} onChange={(_, newValue) => setFilter({ ...filter, minRating: newValue })} />
      </FormControl>

      {/* Opening Days */}
      <FormControl component="fieldset" variant="standard" fullWidth>
        <SectionHeader icon={<CalendarMonth />} label={t('OPENING_DAYS')} show={isActive.openingDays} onReset={() => reset({ openingDays: [] })} />
        <ToggleButtonGroup
          value={filter.openingDays}
          onChange={(event, newDays) => setFilter({ ...filter, openingDays: newDays })}
          aria-label="opening days"
          sx={{ flexWrap: 'wrap', gap: '4px' }}
        >
          {dayOptions.map((day) => (
            <ToggleButton key={day} value={day} aria-label={day} sx={{ width: '44px', minWidth: '44px' }}>
              {t(day)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </FormControl>

      {/* Opening Hours */}
      <FormControl component="fieldset" variant="standard" fullWidth>
        <SectionHeader
          icon={<QueryBuilderIcon />}
          label={t('OPENING_HOURS')}
          show={isActive.openingHours}
          onReset={() => reset({ openingTime: null, closingTime: null })}
        />
        <Stack direction="column" spacing={2}>
          <Stack direction="row" sx={{ '& > p': { flex: '1' } }} gap={2}>
            <Typography variant="body1">{t('OPENING_TIME')}</Typography>
            <Typography variant="body1">{t('CLOSING_TIME')}</Typography>
          </Stack>
          <Stack direction="row" sx={{ '& > *': { flex: '1', minWidth: 0 } }} gap={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                name="open"
                label={!filter.openingTime && 'Open'}
                value={filter.openingTime}
                onChange={updateOpeningHour}
                renderInput={(params) => <TextField {...params} InputLabelProps={{ shrink: false }} />}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                name="close"
                label={!filter.closingTime && 'Close'}
                value={filter.closingTime}
                onChange={updateClosingHour}
                renderInput={(params) => <TextField {...params} InputLabelProps={{ shrink: false }} />}
              />
            </LocalizationProvider>
          </Stack>
        </Stack>
      </FormControl>

      {/* Target Audience */}
      <FormControl component="fieldset" variant="standard" fullWidth>
        <SectionHeader
          icon={<Face2Icon />}
          label={t('TARGET_AUDIENCE')}
          show={isActive.targetAudience}
          onReset={() => reset({ targetAudience: [] })}
        />
        <ToggleButtonGroup value={filter.targetAudience} onChange={updateTargetAudience} aria-label="target audience selection">
          <ToggleButton value="ALL">{t('ALL')}</ToggleButton>
          <ToggleButton value="MEN">{t('MEN')}</ToggleButton>
          <ToggleButton value="WOMEN">{t('WOMEN')}</ToggleButton>
          <ToggleButton value="KIDS">{t('KIDS')}</ToggleButton>
        </ToggleButtonGroup>
      </FormControl>

      {/* Number of Hairdressers */}
      <FormControl component="fieldset" variant="standard" fullWidth>
        <SectionHeader
          icon={<GroupsIcon />}
          label={t('HAIRDRESSERS_NUMBER')}
          show={isActive.employeeCount}
          onReset={() => reset({ employeeCount: [0, 20] })}
        />
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={4} sx={{ p: '0 12px' }}>
          <Slider
            getAriaLabel={() => 'Number of Hairdressers'}
            value={filter.employeeCount}
            onChange={updateEmployeeCount}
            step={1}
            min={0}
            max={20}
            valueLabelDisplay="auto"
            getAriaValueText={() => filter.employeeCount}
            sx={{ flex: 1, minWidth: 0 }}
          />
          <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap', minWidth: '50px' }}>
            {filter.employeeCount[0] === filter.employeeCount[1]
              ? filter.employeeCount[0] >= 20
                ? '20+'
                : filter.employeeCount[0]
              : filter.employeeCount[0] + ' - ' + (filter.employeeCount[1] >= 20 ? '20+' : filter.employeeCount[1])}
          </Typography>
        </Stack>
      </FormControl>

      {/* Price Range */}
      <FormControl component="fieldset" variant="standard" fullWidth>
        <SectionHeader
          icon={<PointOfSaleIcon />}
          label={t('PRICE_RANGE')}
          show={isActive.priceCategory}
          onReset={() => reset({ priceCategory: [] })}
        />
        <ToggleButtonGroup
          value={filter.priceCategory}
          onChange={(event, newValue) => setFilter({ ...filter, priceCategory: newValue })}
          aria-label="price category"
        >
          <ToggleButton value={1} sx={{ width: '70px', fontSize: '18px' }}>
            &#8364;
          </ToggleButton>
          <ToggleButton value={2} sx={{ width: '70px', fontSize: '18px' }}>
            &#8364; &#8364;
          </ToggleButton>
          <ToggleButton value={3} sx={{ width: '70px', fontSize: '18px' }}>
            &#8364; &#8364; &#8364;
          </ToggleButton>
        </ToggleButtonGroup>
      </FormControl>

      {/* Payment Method */}
      <FormControl component="fieldset" variant="standard" fullWidth>
        <SectionHeader
          icon={<PaymentIcon />}
          label={t('PAYMENT_METHOD')}
          show={isActive.paymentMethods}
          onReset={() => reset({ paymentMethods: [] })}
        />
        <FormGroup sx={{ padding: '0 0 0 3px' }}>
          {paymentMethodOptions.map((method) => (
            <FormControlLabel
              name="paymentMethods"
              key={method}
              control={<Checkbox checked={filter.paymentMethods.includes(method)} onChange={(event) => updateFilterArray(event, method)} />}
              label={t(method)}
              sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
            />
          ))}
        </FormGroup>
      </FormControl>

      {/* Drinks */}
      <FormControl component="fieldset" variant="standard" fullWidth>
        <SectionHeader icon={<CoffeeIcon />} label={t('DRINKS')} show={isActive.drinks} onReset={() => reset({ drinks: [] })} />
        <FormGroup sx={{ padding: '0 0 0 3px' }}>
          {drinkOptions.map((drink) => (
            <FormControlLabel
              name="drinks"
              key={drink}
              control={<Checkbox checked={filter.drinks.includes(drink)} onChange={(event) => updateFilterArray(event, drink)} />}
              label={t(drink)}
              sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
            />
          ))}
        </FormGroup>
      </FormControl>
    </Stack>
  );
};

export default Filter;
