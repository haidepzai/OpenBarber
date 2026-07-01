// @ts-nocheck
import React from 'react';
import { Stack, TextField, Typography, Divider, ToggleButton, ToggleButtonGroup, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const paymentMethodOptions = ['ON_SITE_CASH', 'ON_SITE_CARD', 'BANK_TRANSFER', 'PAYPAL'];
const drinkOptions = ['COFFEE', 'TEA', 'WATER', 'SOFT_DRINKS', 'BEER', 'CHAMPAGNE', 'SPARKLING_WINE'];
const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const rowSx = {
  alignItems: { xs: 'stretch', md: 'center' },
  gap: { xs: 1, md: 3 },
  '& > *:first-of-type': {
    width: { xs: '100%', md: 180 },
    flexShrink: 0,
    fontWeight: 500,
  },
  '& > *:last-child': {
    flex: 1,
    minWidth: 0,
  },
};

const PersonalInfoForm = ({ shop, handleShopChange, handleShopArrayChange }) => {
  const { t } = useTranslation();

  return (
    <Stack direction="column" spacing={3} divider={<Divider orientation="horizontal" flexItem />} sx={{ py: 3, px: { xs: 2, sm: 3, md: 4 } }}>
      <Stack direction={{ xs: 'column', md: 'row' }} sx={rowSx}>
        <Typography variant="body1">{t('NAME')}</Typography>
        <TextField
          InputLabelProps={{ shrink: false }}
          name="name"
          placeholder={t('NAME_SHOP')}
          value={shop.name === null ? '' : shop.name}
          onChange={handleShopChange}
          fullWidth
        />
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} sx={rowSx}>
        <Typography variant="body1">{t('ADDRESS')}</Typography>
        <TextField
          InputLabelProps={{ shrink: false }}
          name="address"
          placeholder={t('ADDRESS_EXAMPLE')}
          value={shop.address === null ? '' : shop.address}
          onChange={handleShopChange}
          fullWidth
        />
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} sx={rowSx}>
        <Typography variant="body1">{t('PHONE_NUMBER')}</Typography>
        <TextField
          InputLabelProps={{ shrink: false }}
          name="phoneNumber"
          placeholder={t('PHONE_NUMBER_EXAMPLE')}
          value={shop.phoneNumber === null ? '' : shop.phoneNumber}
          onChange={handleShopChange}
          fullWidth
          type="number"
        />
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} sx={rowSx}>
        <Typography variant="body1">{t('WEBSITE')}</Typography>
        <TextField
          InputLabelProps={{ shrink: false }}
          name="website"
          placeholder={t('WEBSITE_EXAMPLE')}
          value={shop.website === null ? '' : shop.website}
          onChange={handleShopChange}
          fullWidth
        />
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} sx={rowSx}>
        <Typography variant="body1">{t('EMAIL_ADDRESS')}</Typography>
        <TextField
          InputLabelProps={{ shrink: false }}
          name="email"
          placeholder={t('EMAIL_ADDRESS_EXAMPLE')}
          value={shop.email === null ? '' : shop.email}
          onChange={handleShopChange}
          fullWidth
        />
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} sx={rowSx}>
        <Typography variant="body1">{t('OPENING_HOURS')}</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
          <Stack direction="column" spacing={1} sx={{ flex: 1 }}>
            <Typography variant="body1">{t('OPENING_TIME')}</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                name="open"
                label={!shop.openingTime && 'Open'}
                value={shop.openingTime ? dayjs(shop.openingTime, 'HH:mm') : null}
                onChange={(newValue) => {
                  handleShopChange({
                    target: {
                      name: 'openingTime',
                      value: newValue ? newValue.format('HH:mm') : null,
                    },
                  });
                }}
                renderInput={(params) => <TextField {...params} InputLabelProps={{ shrink: false }} fullWidth />}
              />
            </LocalizationProvider>
          </Stack>
          <Stack direction="column" spacing={1} sx={{ flex: 1 }}>
            <Typography variant="body1">{t('CLOSING_TIME')}</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                name="close"
                label={!shop.closingTime && 'Close'}
                value={shop.closingTime ? dayjs(shop.closingTime, 'HH:mm') : null}
                onChange={(newValue) => {
                  handleShopChange({
                    target: {
                      name: 'closingTime',
                      value: newValue ? newValue.format('HH:mm') : null,
                    },
                  });
                }}
                renderInput={(params) => <TextField {...params} InputLabelProps={{ shrink: false }} fullWidth />}
              />
            </LocalizationProvider>
          </Stack>
        </Stack>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} sx={rowSx}>
        <Typography variant="body1">{t('OPENING_DAYS')}</Typography>
        <ToggleButtonGroup
          value={shop.openingDays || []}
          onChange={(event, newDays) => {
            handleShopChange({
              target: { name: 'openingDays', value: newDays },
            });
          }}
          aria-label="Opening days"
          sx={{ flexWrap: 'wrap', gap: 0.5, width: '100%' }}
        >
          {DAYS_OF_WEEK.map((day) => (
            <ToggleButton key={day} value={day} aria-label={day} sx={{ minWidth: '48px', fontSize: '13px', padding: '6px 10px' }}>
              {t(day)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} sx={rowSx}>
        <Typography variant="body1">{t('PRICE_CATEGORY')}</Typography>
        <ToggleButtonGroup
          name="priceCategory"
          value={shop.priceCategory === null ? '' : shop.priceCategory}
          exclusive
          onChange={(event, value) => {
            handleShopChange({
              target: {
                name: 'priceCategory',
                value,
              },
            });
          }}
          aria-label="Price category"
          sx={{ '& > button': { minWidth: '70px', fontSize: '18px' }, flexWrap: 'wrap', gap: 1 }}
        >
          <ToggleButton value={1} aria-label="1">
            &#8364;
          </ToggleButton>
          <ToggleButton value={2} aria-label="2">
            &#8364; &#8364;
          </ToggleButton>
          <ToggleButton value={3} aria-label="3">
            &#8364; &#8364; &#8364;
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} sx={rowSx}>
        <Typography variant="body1">{t('PAYMENT_METHOD')}</Typography>
        <FormGroup>
          {paymentMethodOptions.map((method) => (
            <FormControlLabel
              name="paymentMethods"
              key={method}
              control={<Checkbox checked={shop.paymentMethods.includes(method)} onChange={(event) => handleShopArrayChange(event, method)} />}
              label={t(method)}
              sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
            />
          ))}
        </FormGroup>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} sx={rowSx}>
        <Typography variant="body1">{t('DRINKS')}</Typography>
        <FormGroup>
          {drinkOptions.map((drink) => (
            <FormControlLabel
              name="drinks"
              key={drink}
              control={<Checkbox checked={shop.drinks.includes(drink)} onChange={(event) => handleShopArrayChange(event, drink)} />}
              label={t(drink)}
              sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
            />
          ))}
        </FormGroup>
      </Stack>
    </Stack>
  );
};

export default PersonalInfoForm;
