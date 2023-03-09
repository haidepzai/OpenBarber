import axios from 'axios';

const appointmentUrl = `${process.env.REACT_APP_BACKEND_URL}/appointments/`;

export const createAppointment = async (appointment, enterpriseId) => {
  const config = {
    method: 'POST',
    params: { enterpriseId: enterpriseId },
    headers: {
      'Content-type': 'application/json',
    },
  };
  try {
    const response = await axios.post(appointmentUrl, appointment, config);
    return response;
  } catch (err) {
    throw new Error('Could not create appointment');
  }
};

export const confirmAppointment = async (id, confirmationCode) => {
  const config = {
    method: 'PUT',
    params: { confirmationCode: confirmationCode },
    headers: {
      'Content-type': 'application/json',
    },
  };
  try {
    const response = await axios.put(`${appointmentUrl}confirmation/${id}`, {}, config);
    return response;
  } catch (err) {
    throw new Error('Could not confirm appointment');
  }
}