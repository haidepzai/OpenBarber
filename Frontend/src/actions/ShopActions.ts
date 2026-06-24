import axios from 'axios';
import { API_ENDPOINTS } from '../config/constants';
import { getAccessToken } from '../context/tokenStorage';

export const getShops = async (page = 0, size = 12) => {
  try {
    const response = await axios.get(API_ENDPOINTS.SHOPS, { params: { page, size } });
    return response.data;
  } catch (error) {
    throw new Error('Could not fetch shops');
  }
};

export const getShopsWithinRadius = async (lat, lng, page = 0, size = 12) => {
  try {
    const radius = 5;
    const response = await axios.get(API_ENDPOINTS.SHOPS_RADIUS, {
      params: { lat, lng, radius, page, size },
    });
    return response.data;
  } catch (error) {
    throw new Error('Could not fetch shops');
  }
};

export const getShop = async (id) => {
  try {
    const response = await axios.get(API_ENDPOINTS.SHOP_DETAIL(id));
    return response.data;
  } catch (error) {
    throw new Error('Could not fetch shops');
  }
};

export const getShopByEmail = async (email) => {
  const config = {
    method: 'GET',
    params: { email },
  };
  try {
    const response = await axios.get(API_ENDPOINTS.SHOPS_BY_EMAIL, config);
    return response.data;
  } catch (error) {
    throw new Error('Could not fetch shops');
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
    const response = await axios.get(API_ENDPOINTS.SHOPS_BY_USER, config);
    return response.data;
  } catch (error) {
    throw new Error('Could not fetch shops');
  }
};

export const createShop = async (createShopReq, customConfig) => {
  try {
    const res = await axios.post(API_ENDPOINTS.SHOPS_CREATE, createShopReq, customConfig);
    return res;
  } catch (error) {
    throw new Error('Could not create Shop');
  }
};
