import React from 'react';
import { AppointmentTooltip as MUIAppointmentTooltip } from '@devexpress/dx-react-scheduler-material-ui';
import { Grid } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { displayData } from './SchedulerConfig';

const AppointmentTooltipComponent = ({ children, appointmentData, appointmentResources, ...restProps }) => {
  return (
    <MUIAppointmentTooltip.Content {...restProps} appointmentResources={displayData(appointmentResources)} appointmentData={appointmentData}>
      <Grid container alignItems="center">
        <Grid item xs={2} sx={{ height: '20px', textAlign: 'center' }}>
          <CircleIcon sx={{ color: 'orange' }} fontSize="small" />
        </Grid>
        <Grid item xs={10}>
          <div>
            Customer: {appointmentData.customer.firstName} {appointmentData.customer.lastName}
          </div>
        </Grid>
      </Grid>
      {appointmentData.customer.phoneNumber && (
        <Grid container alignItems="center" sx={{ mt: '5px' }}>
          <Grid item xs={2} />
          <Grid item xs={2} sx={{ height: '20px', textAlign: 'center' }}>
            <PhoneIcon fontSize="small" />
          </Grid>
          <Grid item xs={8}>
            <div>{appointmentData.customer.phoneNumber}</div>
          </Grid>
        </Grid>
      )}
      {appointmentData.customer.email && (
        <Grid container alignItems="center" sx={{ mt: '5px' }}>
          <Grid item xs={2} />
          <Grid item xs={2} sx={{ height: '20px', textAlign: 'center' }}>
            <EmailIcon fontSize="small" />
          </Grid>
          <Grid item xs={8}>
            <div>{appointmentData.customer.email}</div>
          </Grid>
        </Grid>
      )}
    </MUIAppointmentTooltip.Content>
  );
};

export default AppointmentTooltipComponent;
