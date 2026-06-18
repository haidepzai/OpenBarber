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
import { FormGroup } from '@mui/material';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/constants.js';
import { appointmentsAPI } from '../api/apiClient.js';
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
        delete added.allDay;
        const newAppointment = {
          ...added,
          title: added.title ? added.title : allServices.find((service) => service.id === added.services[0]).title,
        };
        data = [...data, newAppointment];
        (async () => {
          await appointmentsAPI.create(enterprise.id, newAppointment);
        })();
      }
      if (changed) {
        const changedId = Number(Object.keys(changed)[0]);
        if (Object.keys(Object.values(changed)[0]).includes('customer')) {
          const newAppointment = changed[changedId];
          data = data.map((appointment) => (appointment.id === changedId ? newAppointment : appointment));
          appointmentsAPI.update(changedId, newAppointment).catch((err) => console.log(err));
        } else {
          const newProps = changed[changedId];
          data = data.map((appointment) => (appointment.id === changedId ? { ...appointment, ...newProps } : appointment));
          appointmentsAPI.patch(changedId, newProps).catch((err) => console.log(err));
        }
      }
      if (deleted !== undefined) {
        data = data.filter((appointment) => appointment.id !== deleted);
        appointmentsAPI.delete(deleted).catch((err) => console.log(err));
      }
      return data;
    });
  };

  useEffect(() => {
    const loadData = async () => {
      const tokenConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      };

      let res = await axios.get(API_ENDPOINTS.ENTERPRISES_BY_USER, tokenConfig);
      let enterprise = res.data;
      setEnterprise(enterprise);

      let appointments = [];
      res = await axios.get(API_ENDPOINTS.APPOINTMENTS(enterprise.id), tokenConfig);
      if (res.status === 200) appointments = res.data;

      let services = [];
      res = await axios.get(API_ENDPOINTS.SERVICES(enterprise.id), tokenConfig);
      if (res.status === 200) services = res.data;

      let employees = [];
      res = await axios.get(API_ENDPOINTS.EMPLOYEES_BY_ENTERPRISE(enterprise.id), tokenConfig);
      if (res.status === 200) employees = res.data;

      const maped_appointments = appointments.map((appointment) => ({
        ...appointment,
        title: appointment.customerName,
      }));
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
    </>
  );
};

export default SchedulerPage;
