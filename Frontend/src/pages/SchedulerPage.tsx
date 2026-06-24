// @ts-nocheck
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
import { appointmentsAPI, employeesAPI, servicesAPI, shopsAPI } from '../api/apiClient';
import EmployeeSelect from '../components/Scheduler/EmployeeSelect';
import TimeTableCell from '../components/Scheduler/TimeTableCell';
import DayScaleCell from '../components/Scheduler/DayScaleCell';
import AppointmentContent from '../components/Scheduler/AppointmentContent';
import AppointmentTooltipComponent from '../components/Scheduler/AppointmentTooltip';
import AppointmentFormLayout from '../components/Scheduler/AppointmentFormLayout';
import TextEditor from '../components/Scheduler/TextEditor';
import { initialResources, getServiceInstances, getEmployeeInstances, grouping, allowDrag } from '../components/Scheduler/SchedulerConfig';

const SchedulerPage = () => {
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState(null);
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
  const normalizeId = (value) => (value === null || value === undefined || value === '' ? '' : String(value));
  const resolveServiceId = (serviceValue) => {
    if (serviceValue === null || serviceValue === undefined || serviceValue === '') {
      return null;
    }

    if (typeof serviceValue === 'object') {
      return serviceValue.id ?? serviceValue.value ?? serviceValue.serviceId ?? null;
    }

    const stringValue = String(serviceValue);
    const asId = allServices.find((service) => normalizeId(service.id) === stringValue);
    if (asId) {
      return asId.id;
    }

    const asTitle = allServices.find((service) => normalizeId(service.title) === stringValue);
    return asTitle ? asTitle.id : stringValue;
  };

  const normalizeServiceSelection = (services) => {
    if (!services) {
      return [];
    }

    const serviceList = Array.isArray(services) ? services : [services];
    return serviceList.map(resolveServiceId).filter((serviceId) => serviceId !== null && serviceId !== '');
  };
  const toLocalISOString = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const parseDateTime = (value) => {
    if (!value) {
      return new Date();
    }

    if (value instanceof Date) {
      return value;
    }

    if (Array.isArray(value)) {
      const [year, month, day, hour = 0, minute = 0, second = 0, nano = 0] = value;
      return new Date(year, month - 1, day, hour, minute, second, Math.floor(nano / 1000000));
    }

    if (typeof value === 'number') {
      return new Date(value);
    }

    // No timezone suffix → treat as local time (append no Z)
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const mapAppointmentToScheduler = (appointment) => {
    const startDate = parseDateTime(appointment.appointmentDateTime);
    let endDate;
    if (appointment.endDateTime) {
      endDate = parseDateTime(appointment.endDateTime);
    } else {
      const totalDuration = getTotalDuration(appointment.services);
      endDate = new Date(startDate.getTime() + (totalDuration || 60) * 60000);
    }

    return {
      ...appointment,
      employee: appointment.employeeId ?? appointment.employee?.id ?? '',
      services: normalizeServiceSelection(appointment.services),
      startDate,
      endDate,
      title: appointment.appointmentType === 'VACATION' ? '🏖 Urlaub' : appointment.customerName || 'Appointment',
      appointmentType: appointment.appointmentType ?? 'APPOINTMENT',
      customer: {
        firstName: appointment.customerName || '',
        lastName: '',
        phoneNumber: appointment.customerPhoneNumber || '',
        email: appointment.customerEmail || '',
      },
    };
  };

  const parseShopTime = (timeStr, referenceDate) => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':').map(Number);
    const d = new Date(referenceDate);
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  const mapSchedulerToAppointment = (appointment) => {
    let startDate = parseDateTime(appointment.startDate);
    let endDate = appointment.endDate ? parseDateTime(appointment.endDate) : null;

    if (appointment.allDay) {
      // Span shop opening hours; fallback to 08:00–20:00
      const openTime =
        parseShopTime(shop?.openingTime, startDate) ?? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 8, 0, 0);
      const closeTime =
        parseShopTime(shop?.closingTime, startDate) ?? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 20, 0, 0);
      startDate = openTime;
      endDate = closeTime;
    }

    return {
      appointmentType: appointment.appointmentType ?? 'APPOINTMENT',
      customerName:
        appointment.appointmentType === 'VACATION'
          ? ''
          : [appointment.customer?.firstName, appointment.customer?.lastName].filter(Boolean).join(' ').trim(),
      customerPhoneNumber: appointment.appointmentType === 'VACATION' ? '' : appointment.customer?.phoneNumber || '',
      customerEmail: appointment.appointmentType === 'VACATION' ? '' : appointment.customer?.email || '',
      appointmentDateTime: toLocalISOString(startDate),
      endDateTime: endDate ? toLocalISOString(endDate) : null,
      employeeId: appointment.employee?.id ?? appointment.employee ?? appointment.employeeId ?? '',
      services:
        appointment.appointmentType === 'VACATION' ? [] : normalizeServiceSelection(appointment.services).map((serviceId) => ({ id: serviceId })),
      paymentMethods: appointment.paymentMethods || [],
      confirmed: appointment.confirmed || false,
    };
  };

  const showSnack = (message, severity = 'error') => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  const loadSchedulerData = async (showLoadingState = false) => {
    if (showLoadingState) {
      setLoading(true);
    }

    try {
      const shopRes = await shopsAPI.getByUser();
      const shopData = shopRes.data;
      setShop(shopData);

      const [appointmentsResult, servicesResult, employeesResult] = await Promise.allSettled([
        appointmentsAPI.getByShop(shopData.id),
        servicesAPI.getByShop(shopData.id),
        employeesAPI.getByShop(shopData.id),
      ]);

      if (appointmentsResult.status === 'rejected') {
        showSnack(appointmentsResult.reason?.response?.data?.message || 'Failed to load appointments', 'error');
        console.error('Appointments error:', appointmentsResult.reason);
      }

      const appointments =
        appointmentsResult.status === 'fulfilled' ? appointmentsResult.value.data?.content ?? appointmentsResult.value.data ?? [] : [];
      const services = servicesResult.status === 'fulfilled' ? servicesResult.value.data || [] : [];
      const employees = employeesResult.status === 'fulfilled' ? employeesResult.value.data || [] : [];

      setData(appointments.map(mapAppointmentToScheduler));
      setAllServices(services);
      setAllEmployees(employees);

      const hasEmployees = employees.length > 0;
      if (!hasEmployees) {
        setGroupingMode(false);
      } else {
        // Auto-select first employee to avoid "All" grouping crash
        setCurrentEmployee((prev) => prev || String(employees[0].id));
      }

      const selectedEmpId = employees.length > 0 ? String(employees[0].id) : '';
      setResources([
        {
          ...initialResources[0],
          instances: getEmployeeInstances(employees).filter((e) => !selectedEmpId || String(e.id) === selectedEmpId),
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
      if (showLoadingState) {
        setLoading(false);
      }
    }
  };

  const filterAppointments = (appointments) =>
    appointments.filter(
      (appointment) =>
        appointment &&
        appointment.startDate instanceof Date &&
        !isNaN(appointment.startDate) &&
        (!currentEmployee || normalizeId(appointment.employee) === normalizeId(currentEmployee))
    );

  const changeCurrentEmployee = (newCurrentEmployee) => {
    const normalizedEmployeeId = normalizeId(newCurrentEmployee);
    const newResources = resources.map((resource) => {
      if (resource.fieldName === 'employee') {
        const found = normalizedEmployeeId
          ? getEmployeeInstances(allEmployees).filter((e) => normalizeId(e.id) === normalizedEmployeeId)
          : getEmployeeInstances(allEmployees);
        return { ...resource, instances: found };
      }
      return resource;
    });
    setCurrentEmployee(normalizedEmployeeId);
    setResources(newResources);
    // Grouping only works when a specific employee is selected
    // (appointments without an employee crash the grouping renderer)
    if (!normalizedEmployeeId) {
      setGroupingMode(false);
    } else if (allEmployees.length > 0) {
      setGroupingMode(true);
    }
  };

  const commitChanges = ({ added, changed, deleted }) => {
    setData((prevState) => {
      let data = prevState;
      if (added) {
        const selectedServiceIds = normalizeServiceSelection(added.services ?? added.service ?? added.serviceId);
        const schedulerAppointment = {
          ...added,
          services: selectedServiceIds,
          title: added.title
            ? added.title
            : allServices.find((service) => normalizeId(service.id) === normalizeId(selectedServiceIds[0]))?.title || 'Appointment',
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
          .create(shop.id, newAppointment)
          .then(() => {
            showSnack('Appointment created successfully', 'success');
            loadSchedulerData(false);
          })
          .catch((err) => {
            const errorMsg = err.response?.data?.message || 'Failed to create appointment';
            showSnack(errorMsg, 'error');
            setData((prevData) => prevData.filter((apt) => apt.id !== newAppointment.id));
          });
      }
      if (changed) {
        const changedId = Number(Object.keys(changed)[0]);
        const existingAppointment = data.find((a) => a.id === changedId) ?? {};
        const mergedAppointment = { ...existingAppointment, ...changed[changedId] };
        const newAppointment = mapSchedulerToAppointment(mergedAppointment);

        console.debug('[Scheduler] changed payload:', changed[changedId]);
        console.debug('[Scheduler] merged endDate:', mergedAppointment.endDate, '→ endDateTime:', newAppointment.endDateTime);

        data = data.map((appointment) => (appointment.id === changedId ? mergedAppointment : appointment));

        const savePromise = Object.keys(changed[changedId] ?? {}).includes('customer')
          ? appointmentsAPI.update(changedId, newAppointment)
          : appointmentsAPI.patch(changedId, newAppointment);

        savePromise
          .then((res) => {
            console.debug('[Scheduler] save response endDateTime:', res?.data?.endDateTime);
            showSnack('Appointment updated successfully', 'success');
            loadSchedulerData(false);
          })
          .catch((err) => {
            console.error('[Scheduler] save error:', err.response?.data);
            showSnack(err.response?.data?.message || 'Failed to update appointment', 'error');
          });
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
    loadSchedulerData(true);
  }, []);

  useEffect(() => {
    const refreshOnFocus = () => {
      if (!document.hidden) {
        loadSchedulerData(false);
      }
    };

    const refreshTimer = window.setInterval(() => {
      loadSchedulerData(false);
    }, 15000);

    window.addEventListener('focus', refreshOnFocus);
    document.addEventListener('visibilitychange', refreshOnFocus);

    return () => {
      window.clearInterval(refreshTimer);
      window.removeEventListener('focus', refreshOnFocus);
      document.removeEventListener('visibilitychange', refreshOnFocus);
    };
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
                      control={
                        <Switch
                          checked={groupingMode}
                          onChange={(event) => setGroupingMode(event.target.checked)}
                          disabled={allEmployees.length === 0}
                        />
                      }
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
              startDayHour={8}
              endDayHour={20}
              excludedDays={[0]}
              dayScaleCellComponent={DayScaleCell}
              timeTableCellComponent={TimeTableCell}
            />

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
