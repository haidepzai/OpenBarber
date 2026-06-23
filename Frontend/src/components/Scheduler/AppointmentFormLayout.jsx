import React from 'react';
import { AppointmentForm } from '@devexpress/dx-react-scheduler-material-ui';
import { FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';

const APPOINTMENT_TYPES = [
  { value: 'APPOINTMENT', label: 'Appointment' },
  { value: 'VACATION', label: 'Urlaub / Blocker' },
];

const AppointmentFormLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
  const isVacation = appointmentData.appointmentType === 'VACATION';

  const onCustomFieldChange = (field, nextValue) => {
    onFieldChange({
      ...appointmentData,
      customer: {
        ...appointmentData.customer,
        [field]: nextValue,
      },
    });
  };

  return (
    <AppointmentForm.BasicLayout appointmentData={appointmentData} onFieldChange={onFieldChange} {...restProps}>
      <AppointmentForm.Label text="Type" type="titleLabel" sx={{ mt: 2, mb: 1 }} />
      <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
        <InputLabel>Typ</InputLabel>
        <Select
          value={appointmentData.appointmentType ?? 'APPOINTMENT'}
          label="Typ"
          onChange={(e) => onFieldChange({ ...appointmentData, appointmentType: e.target.value })}
        >
          {APPOINTMENT_TYPES.map((t) => (
            <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {!isVacation && (
        <>
          <AppointmentForm.Label text="Customer" type="titleLabel" sx={{ margin: '10px 0' }} />
          <Stack direction="row" spacing={3} sx={{ mt: '25px' }}>
            <Stack direction="column" spacing={0.5}>
              <AppointmentForm.TextEditor
                value={appointmentData.customer?.firstName}
                onValueChange={(nextValue) => onCustomFieldChange('firstName', nextValue)}
                placeholder="First Name"
              />
              {!appointmentData.customer?.firstName && (
                <Typography variant="body1" sx={{ fontSize: '12px', fontWeight: '500', color: 'red', pl: '12px' }}>
                  Can't be empty!
                </Typography>
              )}
            </Stack>
            <AppointmentForm.TextEditor
              value={appointmentData.customer?.lastName}
              onValueChange={(nextValue) => onCustomFieldChange('lastName', nextValue)}
              placeholder="Last Name"
            />
          </Stack>
          <AppointmentForm.TextEditor
            value={appointmentData.customer?.phoneNumber}
            onValueChange={(nextValue) => onCustomFieldChange('phoneNumber', nextValue)}
            placeholder="Phone Number"
            sx={{ '&.MuiFormControl-root': { marginTop: !appointmentData.customer?.firstName ? '3px' : '25px' } }}
          />
          <AppointmentForm.TextEditor
            value={appointmentData.customer?.email}
            onValueChange={(nextValue) => onCustomFieldChange('email', nextValue)}
            placeholder="E-Mail"
            sx={{ '&.MuiFormControl-root': { marginTop: '25px' } }}
          />
        </>
      )}
    </AppointmentForm.BasicLayout>
  );
};

export default AppointmentFormLayout;
