// @ts-nocheck
const getTotalDuration = (services = []) => services.reduce((total, service) => total + Number(service?.durationInMin || 0), 0);
const normalizeId = (value) => (value === null || value === undefined || value === '' ? '' : String(value));

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

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const resolveServiceId = (serviceValue, services = []) => {
  if (serviceValue === null || serviceValue === undefined || serviceValue === '') {
    return null;
  }

  if (typeof serviceValue === 'object') {
    return serviceValue.id ?? serviceValue.value ?? serviceValue.serviceId ?? null;
  }

  const stringValue = String(serviceValue);
  const asId = services.find((service) => normalizeId(service.id) === stringValue);
  if (asId) {
    return asId.id;
  }

  const asTitle = services.find((service) => normalizeId(service.title) === stringValue);
  return asTitle ? asTitle.id : stringValue;
};

const normalizeServiceSelection = (selectedServices, services = []) => {
  if (!selectedServices) {
    return [];
  }

  const serviceList = Array.isArray(selectedServices) ? selectedServices : [selectedServices];
  return serviceList.map((serviceValue) => resolveServiceId(serviceValue, services)).filter((serviceId) => serviceId !== null && serviceId !== '');
};

export const mapAppointmentToScheduler = (appointment, services = []) => {
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
    services: normalizeServiceSelection(appointment.services, services),
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

export const parseShopTime = (shop, referenceDate, isOpening) => {
  const timeStr = isOpening ? shop?.openingTime : shop?.closingTime;
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date(referenceDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export const mapSchedulerToAppointment = (appointment, employees = [], services = [], shop = null) => {
  void employees;

  let startDate = parseDateTime(appointment.startDate);
  let endDate = appointment.endDate ? parseDateTime(appointment.endDate) : null;

  if (appointment.allDay) {
    const openTime = parseShopTime(shop, startDate, true) ?? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 8, 0, 0);
    const closeTime = parseShopTime(shop, startDate, false) ?? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 20, 0, 0);
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
      appointment.appointmentType === 'VACATION'
        ? []
        : normalizeServiceSelection(appointment.services, services).map((serviceId) => ({ id: serviceId })),
    paymentMethods: appointment.paymentMethods || [],
    confirmed: appointment.confirmed || false,
  };
};
