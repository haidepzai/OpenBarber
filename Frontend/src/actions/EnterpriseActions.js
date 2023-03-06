import axios from 'axios';

export const getEnterprises = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/enterprises`);
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw new Error('Could not fetch enterprises');
  }
};

export const getShop = async (id) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/enterprises/` + id);

    return response.data;
  } catch (error) {
    throw new Error('Could not fetch enterprises');
  }
};

export const getShopByEmail = async (email) => {
  const config = {
    method: 'GET',
    params: { email: email },
  };
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/enterprises/email`, config);
    return response.data;
  } catch (error) {
    throw new Error('Could not fetch enterprises');
  }
};

export const getShopByUser = async () => {
  const config = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  };
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/enterprises/`, config);

    return response.data;
  } catch (error) {
    throw new Error('Could not fetch enterprises');
  }
};

export const createEnterprise = async (createEnterpriseReq, customConfig) => {
  try {
    const res = await axios.post('http://localhost:8080/api/enterprises', createEnterpriseReq, customConfig);
    return res;
  } catch (error) {
    throw new Error('Could not create Enterprise');
  }
};
