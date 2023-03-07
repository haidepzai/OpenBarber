import axios from 'axios';

const serviceUrl = `${process.env.REACT_APP_BACKEND_URL}/services/`;

export const deleteServiceById = async (id) => {
  try {
    const response = await axios.delete(`${serviceUrl}${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response;
  } catch (err) {
    throw new Error('Could not delete service');
  }
};

export const createService = async (service, enterpriseId) => {
  const config = {
    method: 'POST',
    params: { enterpriseId: enterpriseId },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  };
  try {
    const response = await axios.post(`${serviceUrl}`, service, config);
    return response;
  } catch (err) {
    throw new Error('Could not delete service');
  }
}

export const updateService = async (id, service) => {
  const config = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  };
  try {
    const response = await axios.put(`${serviceUrl}${id}`, service, config);
    return response;
  } catch (err) {
    throw new Error('Could not delete service');
  }
}