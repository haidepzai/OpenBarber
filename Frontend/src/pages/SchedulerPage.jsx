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
import { useEffect, useState } from 'react';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FormGroup, Snackbar, Alert } from '@mui/material';
import { appointmentsAPI, employeesAPI, servicesAPI, enterprisesAPI } from '../api/apiClient.js';
import EmployeeSelect from '../components/Scheduler/EmployeeSelect';
import TimeTableCell from '../components/Scheduler/TimeTableCell';
import DayScaleCell from '../components/Scheduler/DayScaleCell';
import AppointmentContent from '../components/Scheduler/AppointmentContent';
import AppointmentTooltipComponent from '../components/Scheduler/AppointmentTooltip';
import AppointmentFormLayout from '../components/Scheduler/AppointmentFormLayout';
import TextEditor from '../components/Scheduler/TextEditor';
import {
  initialResources,
  getServiceInstances,
  getEmployeeInstances,
  grouping,
  allowDrag,
} from '../components/Scheduler/SchedulerConfig';

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
  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState('success');
  const [snackOpen, setSnackOpen] = useState(false);

  const getTotalDuration = (services = []) => services.reduce((total, service) => total + Number(service?.durationInMin || 0), 0);

  const mapAppointmentToScheduler = (appointment) => {
    const startDate = appointment.appointmentDateTime ? new Date(appointment.appointmentDateTime) : new Date();
    const totalDuration = getTotalDuration(appointment.services);
    const endDate = new Date(startDate.getTime() + totalDuration * 60000);

    return {
      ...appointment,
      employee: appointment.employeeId,
      services: appointment.services || [],
      startDate,
      endDate,
      title: appointment.customerName || 'Appointment',
      customer: {
        firstName: appointment.customerName || '',
        lastName: '',
        phoneNumber: appointment.customerPhoneNumber || '',
        email: appointment.customerEmail || '',
      },
    };
  };

  const mapSchedulerToAppointment = (appointment) => ({
    customerName: [appointment.customer?.firstName, appointment.customer?.lastName].filter(Boolean).join(' ').trim(),
    customerPhoneNumber: appointment.customer?.phoneNumber || '',
    customerEmail: appointment.customer?.email || '',
    appointmentDateTime: appointment.startDate instanceof Date ? appointment.startDate.toISOString() : new Date(appointment.startDate).toISOString(),
    employee: { id: appointment.employee },
    services: (appointment.services || []).map((serviceId) => ({ id: serviceId })),
    paymentMethods: appointment.paymentMethods || [],
    confirmed: appointment.confirmed || false,
  });

  const showSnack = (message, severity = 'error') => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

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
    setData((prevState) => {
      let data = prevState;
      if (added) {
        const schedulerAppointment = {
          ...added,
          title: added.title ? added.title : allServices.find((service) => service.id === added.services?.[0])?.title || 'Appointment',
          customer: added.customer || {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
          },
        };
        const newAppointment = mapSchedulerToAppointment(schedulerAppointment);
        data = [...data, schedulerAppointment];

        appointmentsAPI
          .create(enterprise.id, newAppointment)
          .then(() => {
            showSnack('Appointment created successfully', 'success');
          })
          .catch((err) => {
            const errorMsg = err.response?.data?.message || 'Failed to create appointment';
            showSnack(errorMsg, 'error');
            setData((prevData) => prevData.filter((apt) => apt.id !== newAppointment.id));
          });
      }
      if (changed) {
        const changedId = Number(Object.keys(changed)[0]);
        if (Object.keys(Object.values(changed)[0]).includes('customer')) {
          const schedulerAppointment = changed[changedId];
          const newAppointment = mapSchedulerToAppointment(schedulerAppointment);
          data = data.map((appointment) => (appointment.id === changedId ? schedulerAppointment : appointment));
          appointmentsAPI
            .update(changedId, newAppointment)
            .then(() => {
              showSnack('Appointment updated successfully', 'success');
            })
            .catch((err) => {
              const errorMsg = err.response?.data?.message || 'Failed to update appointment';
              showSnack(errorMsg, 'error');
            });
        } else {
          const newProps = changed[changedId];
          const schedulerAppointment = data.find((appointment) => appointment.id === changedId);
          const updatedSchedulerAppointment = schedulerAppointment ? { ...schedulerAppointment, ...newProps } : newProps;
          const newAppointment = mapSchedulerToAppointment(updatedSchedulerAppointment);
          data = data.map((appointment) => (appointment.id === changedId ? updatedSchedulerAppointment : appointment));
          appointmentsAPI
            .patch(changedId, newAppointment)
            .then(() => {
              showSnack('Appointment updated successfully', 'success');
            })
            .catch((err) => {
              const errorMsg = err.response?.data?.message || 'Failed to update appointment';
              showSnack(errorMsg, 'error');
            });
        }
      }
      if (deleted !== undefined) {
        data = data.filter((appointment) => appointment.id !== deleted);
        appointmentsAPI
          .delete(deleted)
          .then(() => {
            showSnack('Appointment deleted successfully', 'success');
          })
          .catch((err) => {
            const errorMsg = err.response?.data?.message || 'Failed to delete appointment';
            showSnack(errorMsg, 'error');
            setData((prevData) => [...prevData, prevState.find((apt) => apt.id === deleted)]);
          });
      }
      return data;
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const enterpriseRes = await enterprisesAPI.getByUser();
        const enterpriseData = enterpriseRes.data;
        setEnterprise(enterpriseData);

        const [appointmentsRes, servicesRes, employeesRes] = await Promise.all([
          appointmentsAPI.getByEnterprise(enterpriseData.id),
          servicesAPI.getByEnterprise(enterpriseData.id),
          employeesAPI.getByEnterprise(enterpriseData.id),
        ]);

        const appointments = appointmentsRes.data || [];
        const services = servicesRes.data || [];
        const employees = employeesRes.data || [];

        setData(appointments.map(mapAppointmentToScheduler));
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
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to load scheduler data';
        showSnack(errorMsg, 'error');
        console.error('Error loading scheduler data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <Paper sx={{ width: currentViewName === 'Day' ? '70%' : '100%', margin: '0 auto' }}>
          <Scheduler data={filterAppointments(data)}>
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

            <WeekView startDayHour={8} endDayHour={20} excludedDays={[0]} dayScaleCellComponent={DayScaleCell} timeTableCellComponent={TimeTableCell} />

            <DayView startDayHour={8} endDayHour={20} />

            <ViewSwitcher />
            <DateNavigator />
            <TodayButton />
            <Appointments appointmentContentComponent={AppointmentContent} />

            <Resources data={resources} mainResourceName="employee" />

            {groupingMode && <IntegratedGrouping />}

            <IntegratedEditing />
            <ConfirmationDialog />

            <AppointmentTooltip showOpenButton showCloseButton showDeleteButton contentComponent={AppointmentTooltipComponent} />

            <AppointmentForm basicLayoutComponent={AppointmentFormLayout} textEditorComponent={TextEditor} />

            {groupingMode && <GroupingPanel />}

            <DragDropProvider allowDrag={allowDrag} />
          </Scheduler>
        </Paper>
      )}
      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{ width: '100%' }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SchedulerPage;
