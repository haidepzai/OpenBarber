import React from 'react';
import { Stack, TextField, Typography, Divider, ToggleButton, ToggleButtonGroup, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useTranslation } from 'react-i18next';

const paymentMethodOptions = ['ON_SITE_CASH', 'ON_SITE_CARD', 'BANK_TRANSFER', 'PAYPAL'];
const drinkOptions = ['COFFEE', 'TEA', 'WATER', 'SOFT_DRINKS', 'BEER', 'CHAMPAGNE', 'SPARKLING_WINE'];

const PersonalInfoForm = ({ enterprise, handleEnterpriseChange, handleEnterpriseArrayChange }) => {
  const { t } = useTranslation();

  return (
    <>
      <Stack
        direction="column"
        spacing={3}
        divider={<Divider orientation="horizontal" flexItem />}
        sx={{
          padding: '24px 0',
          '& > *': {
            padding: '0 48px',
          },
          '& > * > *': {
            flex: '1',
          },
          '& > * > p': {
            fontWeight: '500',
          },
          '& > * > * > p': {
            fontWeight: '500',
          },
        }}
      >
        <Stack direction="row">
          <Typography variant="body1">{t('NAME')}</Typography>
          <TextField
            InputLabelProps={{ shrink: false }}
            name="name"
            placeholder={t('NAME_ENTERPRISE')}
            value={enterprise.name === null ? '' : enterprise.name}
            onChange={handleEnterpriseChange}
            fullWidth
          />
        </Stack>

        <Stack direction="row">
          <Typography variant="body1">{t('ADDRESS')}</Typography>
          <TextField
            InputLabelProps={{ shrink: false }}
            name="address"
            placeholder={t('ADDRESS_EXAMPLE')}
            value={enterprise.address === null ? '' : enterprise.address}
            onChange={handleEnterpriseChange}
            fullWidth
          />
        </Stack>

        <Stack direction="row">
          <Typography variant="body1">{t('PHONE_NUMBER')}</Typography>
          <TextField
            InputLabelProps={{ shrink: false }}
            name="phoneNumber"
            placeholder={t('PHONE_NUMBER_EXAMPLE')}
            value={enterprise.phoneNumber === null ? '' : enterprise.phoneNumber}
            onChange={handleEnterpriseChange}
            fullWidth
            type="number"
          />
        </Stack>

        <Stack direction="row">
          <Typography variant="body1">{t('WEBSITE')}</Typography>
          <TextField
            InputLabelProps={{ shrink: false }}
            name="website"
            placeholder={t('WEBSITE_EXAMPLE')}
            value={enterprise.website === null ? '' : enterprise.website}
            onChange={handleEnterpriseChange}
            fullWidth
          />
        </Stack>

        <Stack direction="row">
          <Typography variant="body1">{t('EMAIL_ADDRESS')}</Typography>
          <TextField
            InputLabelProps={{ shrink: false }}
            name="email"
            placeholder={t('EMAIL_ADDRESS_EXAMPLE')}
            value={enterprise.email === null ? '' : enterprise.email}
            onChange={handleEnterpriseChange}
            fullWidth
          />
        </Stack>

        <Stack direction="row">
          <Stack direction="column" spacing={1}>
            <Typography variant="body1">{t('OPENING_TIME')}</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                name="open"
                label={!enterprise.openingTime && 'Open'}
                value={enterprise.openingTime === null ? '' : enterprise.openingTime}
                onChange={(newValue) => {
                  handleEnterpriseChange({
                    target: {
                      name: 'openingTime',
                      value: newValue.format('HH:mm'),
                    },
                  });
                }}
                renderInput={(params) => <TextField {...params} InputLabelProps={{ shrink: false }} sx={{ paddingRight: '48px' }} />}
              />
            </LocalizationProvider>
          </Stack>
          <Stack direction="column" spacing={1}>
            <Typography variant="body1">{t('CLOSING_TIME')}</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                name="close"
                label={!enterprise.closingTime && 'Close'}
                value={enterprise.closingTime === null ? '' : enterprise.closingTime}
                onChange={(newValue) => {
                  handleEnterpriseChange({
                    target: {
                      name: 'closingTime',
                      value: newValue.format('HH:mm'),
                    },
                  });
                }}
                renderInput={(params) => <TextField {...params} InputLabelProps={{ shrink: false }} />}
              />
            </LocalizationProvider>
          </Stack>
        </Stack>

        <Stack direction="row">
          <Typography variant="body1">{t('PRICE_CATEGORY')}</Typography>
          <ToggleButtonGroup
            name="priceCategory"
            value={enterprise.priceCategory === null ? '' : enterprise.priceCategory}
            exclusive
            onChange={(event, value) => {
              handleEnterpriseChange({
                target: {
                  name: 'priceCategory',
                  value,
                },
              });
            }}
            aria-label="Price category"
            sx={{ '& > button': { width: '70px', fontSize: '18px' } }}
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

        <Stack direction="row">
          <Typography variant="body1">{t('PAYMENT_METHOD')}</Typography>
          <FormGroup>
            {paymentMethodOptions.map((method) => (
              <FormControlLabel
                name="paymentMethods"
                key={method}
                control={
                  <Checkbox
                    checked={enterprise.paymentMethods.includes(method)}
                    onChange={(event) => handleEnterpriseArrayChange(event, method)}
                  />
                }
                label={t(method)}
                sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
              />
            ))}
          </FormGroup>
        </Stack>

        <Stack direction="row">
          <Typography variant="body1">{t('DRINKS')}</Typography>
          <FormGroup>
            {drinkOptions.map((drink) => (
              <FormControlLabel
                name="drinks"
                key={drink}
                control={
                  <Checkbox checked={enterprise.drinks.includes(drink)} onChange={(event) => handleEnterpriseArrayChange(event, drink)} />
                }
                label={t(drink)}
                sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
              />
            ))}
          </FormGroup>
        </Stack>
      </Stack>
    </>
  );
};

export default PersonalInfoForm;
