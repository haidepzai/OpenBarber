import React from 'react';
import { Checkbox, Divider, FormGroup, Slider, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import CoffeeIcon from '@mui/icons-material/Coffee';
import PaymentIcon from '@mui/icons-material/Payment';
import Face2Icon from '@mui/icons-material/Face2';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import GroupsIcon from '@mui/icons-material/Groups';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { useLocation } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const paymentMethodOptions = ['ON_SITE_CASH', 'ON_SITE_CARD', 'BANK_TRANSFER', 'PAYPAL'];
const drinkOptions = ['COFFEE', 'TEA', 'WATER', 'SOFT_DRINKS', 'BEER', 'CHAMPAGNE', 'SPARKLING_WINE'];

const Filter = ({ filter, setFilter }) => {
  /*const updateFilter = (topic, property) => {
    setFilter({
      ...filter,
      [topic]: {
        ...filter[topic],
        [property]: !filter[topic][property],
      },
    });
  };*/

  const updateTargetAudience = (event, newTA) => {
    setFilter({
      ...filter,
      targetAudience: newTA,
    });
  };

  const updateEmployeeCount = (event, newValue) => {
    setFilter({
      ...filter,
      employeeCount: newValue,
    });
  };

  const updateOpeningHour = (newValue) => {
    const changedValue = newValue.set('year', 2023).set('month', 0).set('date', 1);
    setFilter({
      ...filter,
      openingTime: changedValue.toISOString(),
    });
  };

  const updateClosingHour = (newValue) => {
    const changedValue = newValue.set('year', 2023).set('month', 0).set('date', 1);
    setFilter({
      ...filter,
      closingTime: changedValue.toISOString(),
    });
  };

  const updateFilterArray = (event, value) => {
    const name = event.target.name;
    const checked = event.target.checked;
    if (checked) {
      setFilter({
        ...filter,
        [name]: [...filter[name], value],
      });
    } else {
      setFilter({
        ...filter,
        [name]: filter[name].filter((el) => el !== value),
      });
    }
  };

  return (
    <Stack
      direction="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      spacing={3}
      sx={{ flex: '1 1 0', padding: '20px 20px' }}
      divider={<Divider orientation="horizontal" flexItem />}
    >
      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend" sx={{ display: 'flex', gap: '10px', fontWeight: '500', color: 'black', mb: '15px' }}>
          <PointOfSaleIcon />
          Price Range
        </FormLabel>
        <ToggleButtonGroup
          value={filter.priceCategory}
          onChange={(event, newValue) => setFilter({ ...filter, priceCategory: newValue })}
          aria-label="price category"
        >
          <ToggleButton value={1} aria-label="1" sx={{ width: '70px', fontSize: '18px' }}>
            &#8364;
          </ToggleButton>
          <ToggleButton value={2} aria-label="2" sx={{ width: '70px', fontSize: '18px' }}>
            &#8364; &#8364;
          </ToggleButton>
          <ToggleButton value={3} aria-label="3" sx={{ width: '70px', fontSize: '18px' }}>
            &#8364; &#8364; &#8364;
          </ToggleButton>
        </ToggleButtonGroup>
      </FormControl>

      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend" sx={{ display: 'flex', gap: '10px', fontWeight: '500', color: 'black', m: '15px 0' }}>
          <Face2Icon />
          Target Audience
        </FormLabel>
        <ToggleButtonGroup value={filter.targetAudience} onChange={updateTargetAudience} aria-label="target audience selection">
          <ToggleButton value="ALL" aria-label="other">
            ALL
          </ToggleButton>
          <ToggleButton value="MEN" aria-label="men">
            Men
          </ToggleButton>
          <ToggleButton value="WOMEN" aria-label="women">
            Women
          </ToggleButton>
          <ToggleButton value="KIDS" aria-label="kids">
            kids
          </ToggleButton>
        </ToggleButtonGroup>
      </FormControl>

      <FormControl component="fieldset" variant="standard" fullWidth>
        <FormLabel component="legend" sx={{ display: 'flex', gap: '10px', fontWeight: '500', color: 'black', m: '15px 0' }}>
          <GroupsIcon />
          Number of Hairdressers
        </FormLabel>
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
            sx={{ width: '100%' }}
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

      <FormControl component="fieldset" variant="standard" fullWidth>
        <FormLabel component="legend" sx={{ display: 'flex', gap: '10px', fontWeight: '500', color: 'black', m: '15px 0' }}>
          <QueryBuilderIcon />
          Opening Hours
        </FormLabel>
        <Stack direction="column" spacing={2}>
          <Stack direction="row" sx={{ '& > p': { flex: '1' } }} gap={2}>
            <Typography variant="body1">Opening Time</Typography>
            <Typography variant="body1">Closing Time</Typography>
          </Stack>
          <Stack direction="row" sx={{ '& > *': { flex: '1' } }} gap={2}>
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
          <Stack direction="row" sx={{ '& > p': { flex: '1' } }} gap={2}>
            <Typography variant="body1">(Or Earlier)</Typography>
            <Typography variant="body1">(Or Later)</Typography>
          </Stack>
        </Stack>
      </FormControl>

      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend" sx={{ display: 'flex', gap: '10px', fontWeight: '500', color: 'black' }}>
          <PaymentIcon />
          Payment Method
        </FormLabel>
        <FormGroup sx={{ padding: '6px 0 0 3px' }}>
          {paymentMethodOptions.map((method) => (
            <FormControlLabel
              name="paymentMethods"
              key={method}
              control={<Checkbox checked={filter.paymentMethods.includes(method)} onChange={(event) => updateFilterArray(event, method)} />}
              label={method
                .replace('ON_SITE_CASH', 'On Site (Cash)')
                .replace('ON_SITE_CARD', 'On Site (Card)')
                .replace('BANK_TRANSFER', 'Bank Transfer')
                .replace('PAYPAL', 'Paypal')}
              sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
            />
          ))}
        </FormGroup>
      </FormControl>

      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend" sx={{ display: 'flex', gap: '10px', fontWeight: '500', color: 'black' }}>
          <CoffeeIcon />
          Drinks
        </FormLabel>
        <FormGroup sx={{ padding: '6px 0 0 3px' }}>
          {drinkOptions.map((drink) => (
            <FormControlLabel
              name="drinks"
              key={drink}
              control={<Checkbox checked={filter.drinks.includes(drink)} onChange={(event) => updateFilterArray(event, drink)} />}
              label={drink.replace('_', ' ').toLowerCase()}
              sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
            />
          ))}
        </FormGroup>
      </FormControl>
    </Stack>
  );
};

export default Filter;
