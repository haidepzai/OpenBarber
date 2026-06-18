import React from 'react';
import { Appointments } from '@devexpress/dx-react-scheduler-material-ui';

const AppointmentContent = ({ data, ...restProps }) => {
  const options = { hour: 'numeric', minute: 'numeric' };
  const difference = Math.floor((new Date(data.endDate) - new Date(data.startDate)) / (1000 * 60));
  return (
    <Appointments.AppointmentContent {...restProps} data={data}>
      <div style={{ overflow: 'hidden' }}>
        <div style={{ fontWeight: '500' }}>
          {data.customer.firstName && <span>{data.customer.firstName}</span>}
          {data.customer.lastName && <span> {data.customer.lastName}</span>}
        </div>
        {difference > 30 && (
          <>
            <div>{new Date(data.startDate).toLocaleTimeString('en-US', options) + ' - '}</div>
            <div>{new Date(data.endDate).toLocaleTimeString('en-US', options)}</div>
          </>
        )}
        <div>{data.title}</div>
      </div>
    </Appointments.AppointmentContent>
  );
};

export default AppointmentContent;
