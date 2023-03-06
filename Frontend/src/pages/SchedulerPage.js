import * as React from 'react';
import Paper from '@mui/material/Paper';
import { ViewState, EditingState, IntegratedEditing, GroupingState, IntegratedGrouping } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  DayView,
  Appointments,
  Toolbar,
  ViewSwitcher,
  DateNavigator,
  TodayButton,
  AppointmentTooltip,
  AppointmentForm,
  ConfirmationDialog,
  DragDropProvider,
  Resources,
  GroupingPanel,
} from '@devexpress/dx-react-scheduler-material-ui';
import { styled, alpha } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FormGroup, Stack, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import axios from 'axios';

/*
 *  Doppelklick auf Zelle --> Add
 */

const initialResources = [
  {
    fieldName: 'employee',
    title: 'Employee',
    instances: [],
  },
  {
    fieldName: 'services',
    title: 'Service',
    allowMultiple: true,
    instances: [],
  },
];

/*const getServiceInstances = (data) => [...new Map(data.map((appointment) => (appointment.services.map((service) => ({id: service.id, text: service.title, color: 'blue'})))).flat().map((e) => [e.id, e])).values()]*/
/*const getCustomerInstances = (appointments) => [...new Map(appointments.map((appointment) => ({ id: appointment.customer.id, text: appointment.customer.name })).map((e) => [e.id, e])).values()]*/
const getServiceInstances = (services) => [
  ...new Map(services.map((service) => ({ id: service.id, text: service.title, color: 'blue' })).map((e) => [e.id, e])).values(),
];
const getEmployeeInstances = (employees) => [
  ...new Map(employees.map((employee) => ({ id: employee.id, text: employee.name })).map((e) => [e.id, e])).values(),
];

const grouping = [{ resourceName: 'employee' }];

const PREFIX = 'Demo';
const classes = {
  today: `${PREFIX}-today`,
  todayCell: `${PREFIX}-todayCell`,
  flexibleSpace: `${PREFIX}-flexibleSpace`,
  /*weekend: `${PREFIX}-weekend`,
    weekendCell: `${PREFIX}-weekendCell`,*/
};

const EmployeeSelect = ({ value, handleChange, options }) => {
  return (
    <FormControl sx={{ minWidth: 200, marginLeft: '30px' }} size="small">
      <InputLabel id="demo-simple-select-label">Hairdresser</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label="Hairdresser"
        onChange={(event) => handleChange(event.target.value)}
      >
        <MenuItem value={0}>
          <em>All</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.text}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const StyledWeekViewTimeTableCell = styled(WeekView.TimeTableCell)(({ theme }) => ({
  [`&.${classes.todayCell}`]: {
    backgroundColor: alpha(theme.palette.primary.main, 0.06),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.14),
    },
    '&:focus': {
      backgroundColor: alpha(theme.palette.primary.main, 0.18),
    },
  },
  /*[`&.${classes.weekendCell}`]: {
        backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
        '&:hover': {
            backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
        },
        '&:focus': {
            backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
        },
    },*/
}));

const StyledWeekViewDayScaleCell = styled(WeekView.DayScaleCell)(({ theme }) => ({
  [`&.${classes.today}`]: {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  /*[`&.${classes.weekend}`]: {
        backgroundColor: alpha(theme.palette.action.disabledBackground, 0.06),
    },*/
}));

const TimeTableCell = (props) => {
  const { startDate, today } = props;
  const date = new Date(startDate);

  if (date.getDate() === new Date().getDate()) {
    return <StyledWeekViewTimeTableCell {...props} className={classes.todayCell} />;
  }
  /*if (date.getDay() === 0 || date.getDay() === 6) {
        return <StyledWeekViewTimeTableCell {...props} className={classes.weekendCell} />;
    } */
  return <StyledWeekViewTimeTableCell {...props} />;
};

const DayScaleCell = (props) => {
  const { startDate, today } = props;

  if (today) {
    return <StyledWeekViewDayScaleCell {...props} className={classes.today} />;
  }
  /*if (startDate.getDay() === 0 || startDate.getDay() === 6) {
        return <StyledWeekViewDayScaleCell {...props} className={classes.weekend} />;
    } */
  return <StyledWeekViewDayScaleCell {...props} />;
};

const appointmentContentComponent = ({ data, ...restProps }) => {
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

const displayData = (appointmentResources) =>
  appointmentResources.map((r) => {
    if (r.fieldName === 'employee') {
      return { ...r, text: `${r.title}: ${r.text}` };
    } else {
      return r;
    }
  });

const appointmentTooltipContentComponent = ({ children, appointmentData, appointmentResources, ...restProps }) => {
  return (
    <AppointmentTooltip.Content {...restProps} appointmentResources={displayData(appointmentResources)} appointmentData={appointmentData}>
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
    </AppointmentTooltip.Content>
  );
};

const draftAppointmentComponent = ({ children, style, ...restProps }) => (
  <DragDropProvider.DraftAppointment
    {...restProps}
    style={{
      ...style,
      backgroundColor: '#6D5344',
      transform: 'scale(1.1)',
    }}
  >
    {children}
  </DragDropProvider.DraftAppointment>
);

/* TODO: Abschicken blockieren wenn firstName leer ist ODER keine Services & kein Titel gesetzt ist, sonst Error */
const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
  useEffect(() => {
    console.log(appointmentData);
  }, [appointmentData]);

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
      <AppointmentForm.Label text="Customer" type="titleLabel" sx={{ margin: '10px 0' }} />
      {/*<AppointmentForm.Select
                value={appointmentData.customer?.formOfAddress}
                onValueChange={(nextValue) => onCustomFieldChange("formOfAddressName", nextValue)}
                availableOptions={[
                    { id: 0, text: "None" },
                    { id: 1, text: "Mr." },
                    { id: 2, text: "Mrs." }
                ]}
                type="outlinedSelect"
                placeholder="Form Of Address"
            />*/}
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
    </AppointmentForm.BasicLayout>
  );
};

const TextEditor = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  if (props.type === 'multilineTextEditor') {
    return null;
  }
  return <AppointmentForm.TextEditor {...props} />;
};

const dragDisabledIds = new Set([1]);

const allowDrag = ({ id }) => !dragDisabledIds.has(id);

const SchedulerPage = () => {
  const [loading, setLoading] = useState(true);

  const [enterprise, setEnterprise] = useState(null);

  const [allServices, setAllServices] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);

  const [data, setData] = useState([]);
  const [resources, setResources] = useState(initialResources);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentViewName, setCurrentViewName] = useState('Week');
  const [currentEmployee, setCurrentEmployee] = useState('');

  const [groupingMode, setGroupingMode] = useState(true);

  const filterAppointments = (appointments) => appointments.filter((appointment) => !currentEmployee || appointment.employee === currentEmployee);

  const changeCurrentEmployee = (newCurrentEmployee) => {
    const newResources = resources.map((resource) => {
      if (resource.fieldName === 'employee') {
        return {
          ...resource,
          instances: newCurrentEmployee
            ? [getEmployeeInstances(allEmployees).find((e) => e.id === newCurrentEmployee)]
            : getEmployeeInstances(allEmployees),
        };
      } else {
        return resource;
      }
    });
    setCurrentEmployee(newCurrentEmployee);
    setResources(newResources);
  };

  const commitChanges = ({ added, changed, deleted }) => {
    console.error('COMMIT CHANGES');

    setData((prevState) => {
      let data = prevState;
      // added = { [key: string]: any }
      if (added) {
        delete added.allDay;
        const newId = prevState.length > 0 ? prevState[prevState.length - 1].id + 1 : 0;
        const newAppointment = {
          // id: newId,
          ...added,
          title: added.title ? added.title : allServices.find((service) => service.id === added.services[0]).title,
        };
        console.log({ data, newAppointment });
        data = [...data, newAppointment];
        console.log({ data, newAppointment });

        (async () => {
          // form data config
          const customConfig = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
          };

          const res = await axios.post('http://localhost:8080/api/appointments?enterpriseId=' + enterprise.id, newAppointment, customConfig);
          console.log(res);
        })();
      }
      // changed = { [key: string]: any }
      // key = appointment ID
      if (changed) {
        const changedId = Number(Object.keys(changed)[0]);
        const changedUrl = `http://localhost:8080/api/appointments/${changedId}`;
        // falls User das "customer"-Objekt ändert
        if (Object.keys(Object.values(changed)[0]).includes('customer')) {
          // REPLACE
          const newAppointment = changed[changedId];
          data = data.map((appointment) => (appointment.id === changedId ? newAppointment : appointment));
          axios
            .put(changedUrl, JSON.stringify(newAppointment), {
              headers: {
                'Content-type': 'application/json',
              },
            })
            .catch((err) => console.log(err));
        } else {
          // UPDATE
          const newProps = changed[changedId];
          data = data.map((appointment) => (appointment.id === changedId ? { ...appointment, ...newProps } : appointment));
          axios
            .patch(changedUrl, JSON.stringify(newProps), {
              headers: {
                'Content-type': 'application/json',
              },
            })
            .catch((err) => console.log(err));
        }
      }
      // number | string
      // "!== undefined" da undefined ja auch 0 sein kann
      if (deleted !== undefined) {
        data = data.filter((appointment) => appointment.id !== deleted);
        axios.delete(`http://localhost:8080/api/appointments/${deleted}`).catch((err) => console.log(err));
      }
      return data;
    });
  };

  useEffect(() => {
    const loadData = async () => {
      const basicConfig = { headers: { 'Content-type': 'application/json' } };
      const tokenConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
      };
      console.log(tokenConfig);

      let res = await axios.get('http://localhost:8080/api/enterprises/user', tokenConfig);
      let enterprise = res.data;
      setEnterprise(enterprise);

      let appointments = [];
      res = await axios.get('http://localhost:8080/api/appointments?enterpriseId=' + enterprise.id, tokenConfig);
      if (res.status === 200) appointments = res.data;

      let services = [];
      res = await axios.get('http://localhost:8080/api/services?enterpriseId=' + enterprise.id, tokenConfig);
      if (res.status === 200) services = res.data;

      let employees = [];
      res = await axios.get('http://localhost:8080/api/employees?enterpriseId=' + enterprise.id, tokenConfig);
      if (res.status === 200) employees = res.data;

      console.log({ enterprise, appointments, services, employees });

      const maped_appointments = appointments.map((appointment) => ({
        ...appointment,
        title: appointment.title ? appointment.title : services.find((service) => service.id === appointment.services[0]).title,
      }));
      console.log('mapped', maped_appointments);
      setData(maped_appointments);

      setAllServices(services);
      setAllEmployees(employees);

      setResources([
        {
          ...initialResources[0],
          instances: getEmployeeInstances(employees),
        },
        {
          ...initialResources[1],
          instances: getServiceInstances(services),
        },
      ]);
    };
    loadData().then(() => setLoading(false));
  }, []);

  return (
    <>
      {/*<ResourceSwitcher
                resources={resources}
                mainResourceName={mainResourceName}
                onChange={(newMainResourceName) => setMainResourceName(newMainResourceName)}
            />*/}
      {loading ? (
        <></>
      ) : (
        <Paper
          sx={{
            width: currentViewName === 'Day' ? '70%' : '100%',
            margin: '0 auto',
          }}
        >
          <Scheduler
            data={filterAppointments(data)}
            /*height={660}*/
          >
            <Toolbar
              flexibleSpaceComponent={() => (
                <Toolbar.FlexibleSpace style={{ margin: '0 auto 0 0', display: 'flex', gap: '40px', alignItems: 'center' }}>
                  <EmployeeSelect value={currentEmployee} handleChange={changeCurrentEmployee} options={getEmployeeInstances(allEmployees)} />
                  <FormGroup>
                    <FormControlLabel
                      sx={{ whiteSpace: 'nowrap' }}
                      control={<Switch checked={groupingMode} onChange={(event) => setGroupingMode(event.target.checked)} />}
                      label="Group by Hairdresser"
                    />
                  </FormGroup>
                </Toolbar.FlexibleSpace>
              )}
            />

            <ViewState
              currentDate={currentDate}
              onCurrentDateChange={(newDate) => setCurrentDate(newDate)}
              defaultCurrentViewName={currentViewName}
              onCurrentViewNameChange={(newViewName) => setCurrentViewName(newViewName)}
            />

            <EditingState onCommitChanges={commitChanges} />

            {groupingMode && <GroupingState grouping={grouping} />}

            <WeekView
              // shop öffnungszeit
              startDayHour={8}
              // shop Schließungszeit
              endDayHour={20}
              // geschlossene Tage (Sonntag)
              excludedDays={[0]}
              // style - heutiger Tag (Tagesanzeige oben)
              dayScaleCellComponent={DayScaleCell}
              // style - heutiger Tag (Zelle)
              timeTableCellComponent={TimeTableCell}
            />

            <DayView startDayHour={8} endDayHour={20} />

            <ViewSwitcher />
            <DateNavigator />
            <TodayButton />
            <Appointments
              /*appointmentComponent={appointmentComponent}*/
              appointmentContentComponent={appointmentContentComponent}
            />

            <Resources data={resources} mainResourceName="employee" />

            {groupingMode && <IntegratedGrouping />}

            <IntegratedEditing />
            <ConfirmationDialog />

            <AppointmentTooltip showOpenButton showCloseButton showDeleteButton contentComponent={appointmentTooltipContentComponent} />

            <AppointmentForm basicLayoutComponent={BasicLayout} textEditorComponent={TextEditor} />

            {groupingMode && <GroupingPanel />}

            <DragDropProvider
              allowDrag={allowDrag}
              /*draftAppointmentComponent={draftAppointmentComponent}*/
              /*sourceAppointmentComponent*/
            />
          </Scheduler>
        </Paper>
      )}
    </>
  );
};

/* sonstiges:
 *
 * AllDayPanel / Appointments
 * Recurring & Zero-Duration Appointments
 *
 *
 *
 * */

export default SchedulerPage;
