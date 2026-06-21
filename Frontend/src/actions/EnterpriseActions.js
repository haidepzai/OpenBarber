import axios from 'axios';
import { API_ENDPOINTS } from '../config/constants';
import { getAccessToken } from '../context/tokenStorage';

export const getEnterprises = async (page = 0, size = 12) => {
  try {
    const response = await axios.get(API_ENDPOINTS.ENTERPRISES, { params: { page, size } });
    return response.data;
  } catch (error) {
    throw new Error('Could not fetch enterprises');
  }
};

export const getEnterprisesWithinRadius = async (lat, lng, page = 0, size = 12) => {
  try {
    const radius = 5;
    const response = await axios.get(API_ENDPOINTS.ENTERPRISES_RADIUS, {
      params: { lat, lng, radius, page, size },
    });
    return response.data;
  } catch (error) {
    throw new Error('Could not fetch enterprises');
  }
};

export const getShop = async (id) => {
  try {
    const response = await axios.get(API_ENDPOINTS.ENTERPRISE_DETAIL(id));
    return response.data;
  } catch (error) {
    throw new Error('Could not fetch enterprises');
  }
};

export const getShopByEmail = async (email) => {
  const config = {
    method: 'GET',
    params: { email },
  };
  try {
    const response = await axios.get(API_ENDPOINTS.ENTERPRISES_BY_EMAIL, config);
    return response.data;
  } catch (error) {
    throw new Error('Could not fetch enterprises');
  }
};

export const getShopByUser = async () => {
  const config = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  };
  try {
    const response = await axios.get(API_ENDPOINTS.ENTERPRISES_BY_USER, config);
    return response.data;
  } catch (error) {
    throw new Error('Could not fetch enterprises');
  }
};

export const createEnterprise = async (createEnterpriseReq, customConfig) => {
  try {
    const res = await axios.post(API_ENDPOINTS.ENTERPRISES_CREATE, createEnterpriseReq, customConfig);
    return res;
  } catch (error) {
    throw new Error('Could not create Enterprise');
  }
};
