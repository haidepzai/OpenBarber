import React, { useEffect } from 'react';
import { Checkbox, Divider, FormGroup, Slider, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
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

const Filter = ({ filter, setFilter }) => {
  const { state } = useLocation();

  const updateFilter = (topic, property) => {
    setFilter({
      ...filter,
      [topic]: {
        ...filter[topic],
        [property]: !filter[topic][property],
      },
    });
  };

  const updateGenders = (event, newGenders) => {
    setFilter({
      ...filter,
      genders: newGenders,
    });
  };

  const updateStylistCount = (event, newValue) => {
    setFilter({
      ...filter,
      stylistCount: newValue,
    });
  };

  const updateOpeningHours = (event, newValue) => {
    setFilter({
      ...filter,
      openingHours: newValue,
    });
  };

  useEffect(() => {
    console.log(filter);
  }, [filter]);

  useEffect(() => {
    if (state !== null) {
      const { location } = state;
      console.log(location);
    }
  }, []);

  return (
    <Stack direction="column" alignItems="flex-start" justifyContent="flex-start" spacing={3} sx={{ flex: '1 1 0', padding: '20px 20px' }}>
      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend" sx={{ display: 'flex', gap: '10px', fontWeight: '500', color: 'black', mb: '15px' }}>
          <PointOfSaleIcon />
          Price Range
        </FormLabel>
        <ToggleButtonGroup
          value={filter.priceCategory}
          onChange={(event, newGenders) => setFilter({ ...filter, priceCategory: newGenders })}
          aria-label="price category"
        >
          <ToggleButton value="1" aria-label="1" sx={{ width: '70px', fontSize: '18px' }}>
            &#8364;
          </ToggleButton>
          <ToggleButton value="2" aria-label="2" sx={{ width: '70px', fontSize: '18px' }}>
            &#8364; &#8364;
          </ToggleButton>
          <ToggleButton value="3" aria-label="3" sx={{ width: '70px', fontSize: '18px' }}>
            &#8364; &#8364; &#8364;
          </ToggleButton>
        </ToggleButtonGroup>
      </FormControl>

      <Divider sx={{ width: '100%' }} />

      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend" sx={{ display: 'flex', gap: '10px', fontWeight: '500', color: 'black', m: '15px 0' }}>
          <Face2Icon />
          Gender
        </FormLabel>
        <ToggleButtonGroup value={filter.genders} onChange={updateGenders} aria-label="gender selection">
          <ToggleButton value="man" aria-label="man">
            Man
          </ToggleButton>
          <ToggleButton value="woman" aria-label="woman">
            Woman
          </ToggleButton>
          <ToggleButton value="kids" aria-label="kids">
            kids
          </ToggleButton>
          <ToggleButton value="other" aria-label="other">
            Other
          </ToggleButton>
        </ToggleButtonGroup>
      </FormControl>

      <Divider sx={{ width: '100%' }} />

      <FormControl component="fieldset" variant="standard" fullWidth>
        <FormLabel component="legend" sx={{ display: 'flex', gap: '10px', fontWeight: '500', color: 'black', m: '15px 0' }}>
          <GroupsIcon />
          Number of Hairdressers
        </FormLabel>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={4} sx={{ p: '0 12px' }}>
          <Slider
            getAriaLabel={() => 'Number of Hairdressers'}
            value={filter.stylistCount}
            onChange={updateStylistCount}
            step={1}
            min={0}
            max={50}
            valueLabelDisplay="auto"
            getAriaValueText={() => filter.stylistCount}
            sx={{ width: '100%' }}
          />
          <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap' }}>
            {filter.stylistCount[0] + ' - ' + filter.stylistCount[1]}
          </Typography>
        </Stack>
      </FormControl>

      <Divider sx={{ width: '100%' }} />

      <FormControl component="fieldset" variant="standard" fullWidth>
        <FormLabel component="legend" sx={{ display: 'flex', gap: '10px', fontWeight: '500', color: 'black', m: '15px 0' }}>
          <QueryBuilderIcon />
          Opening Hours
        </FormLabel>
        <Stack direction="column" alignItems="center" spacing={2} sx={{ p: '0 12px' }}>
          <Slider
            getAriaLabel={() => 'Opening Hours'}
            value={filter.openingHours}
            onChange={updateOpeningHours}
            step={1}
            min={6}
            max={12}
            valueLabelDisplay="auto"
            getAriaValueText={() => filter.openingHours}
            sx={{ width: '100%' }}
          />
          <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap' }}>
            {filter.openingHours[0] + ' AM - ' + filter.openingHours[1] + ' PM'}
          </Typography>
        </Stack>
      </FormControl>

      <Divider sx={{ width: '100%' }} />

      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend" sx={{ display: 'flex', gap: '10px', fontWeight: '500', color: 'black' }}>
          <PaymentIcon />
          Payment Method
        </FormLabel>
        <FormGroup sx={{ padding: '6px 0 0 3px' }}>
          {Object.keys(filter.paymentMethods).map((method) => (
            <FormControlLabel
              key={method}
              control={<Checkbox checked={filter.paymentMethods[method]} onChange={() => updateFilter('paymentMethods', method)} name={method} />}
              label={method.replace('onSiteCash', 'On Site (Cash)').replace('onSiteCard', 'On Site (Card)').replace('_', ' ')}
              sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
            />
          ))}
        </FormGroup>
      </FormControl>

      <Divider sx={{ width: '100%' }} />

      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend" sx={{ display: 'flex', gap: '10px', fontWeight: '500', color: 'black' }}>
          <CoffeeIcon />
          Drinks
        </FormLabel>
        <FormGroup sx={{ padding: '6px 0 0 3px' }}>
          {Object.keys(filter.drinks).map((drink) => (
            <FormControlLabel
              key={drink}
              control={<Checkbox checked={filter.drinks[drink]} onChange={() => updateFilter('drinks', drink)} name={drink} />}
              label={drink.replace('_', ' ')}
              sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
            />
          ))}
        </FormGroup>
      </FormControl>
    </Stack>
  );
};

export default Filter;
