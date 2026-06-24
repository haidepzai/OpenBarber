// Configuration and constants for Scheduler component
import { alpha } from '@mui/material/styles';

export const initialResources = [
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

export const getServiceInstances = (services) => [
  ...new Map(services.map((service) => ({ id: service.id, text: service.title, color: 'blue' })).map((e) => [e.id, e])).values(),
];

export const getEmployeeInstances = (employees) => [
  ...new Map(employees.map((employee) => ({ id: employee.id, text: employee.name })).map((e) => [e.id, e])).values(),
];

export const grouping = [{ resourceName: 'employee' }];

export const PREFIX = 'Demo';

export const classes = {
  today: `${PREFIX}-today`,
  todayCell: `${PREFIX}-todayCell`,
  flexibleSpace: `${PREFIX}-flexibleSpace`,
};

export const dragDisabledIds = new Set([1]);

export const allowDrag = ({ id }) => !dragDisabledIds.has(id);

export const getStyledTimeTableCellStyles = (theme) => ({
  [`&.${classes.todayCell}`]: {
    backgroundColor: alpha(theme.palette.primary.main, 0.06),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.14),
    },
    '&:focus': {
      backgroundColor: alpha(theme.palette.primary.main, 0.18),
    },
  },
});

export const getStyledDayScaleCellStyles = (theme) => ({
  [`&.${classes.today}`]: {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
});

export const displayData = (appointmentResources) =>
  appointmentResources.map((r) => {
    if (r.fieldName === 'employee') {
      return { ...r, text: `${r.title}: ${r.text}` };
    } else {
      return r;
    }
  });
