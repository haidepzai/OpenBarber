import { appointmentsAPI } from '../api/apiClient';

export const createAppointment = async (appointment, shopId, captchaToken = null) => {
  return appointmentsAPI.create(shopId, appointment, captchaToken);
};

export const confirmAppointment = async (id, confirmationCode) => {
  return appointmentsAPI.confirm(id, confirmationCode);
};

export const cancelAppointment = async (id, confirmationCode) => {
  return appointmentsAPI.cancel(id, confirmationCode);
};