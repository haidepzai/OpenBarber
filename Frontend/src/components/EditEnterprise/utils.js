import { API_ENDPOINTS } from '../config/constants.js';

export const loadEnterpriseData = async (email) => {
  try {
    const response = await fetch(API_ENDPOINTS.ENTERPRISE_BY_EMAIL(email), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to load enterprise');
    return response.json();
  } catch (error) {
    console.error('Error loading enterprise:', error);
    return null;
  }
};

export const saveEnterpriseData = async (enterprise) => {
  try {
    const response = await fetch(API_ENDPOINTS.ENTERPRISE_DETAIL(enterprise.id), {
      method: 'PUT',
      body: JSON.stringify(enterprise),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to save enterprise');
    return true;
  } catch (error) {
    console.error('Error saving enterprise:', error);
    return false;
  }
};

export const loadUserData = async (userId) => {
  try {
    const response = await fetch(API_ENDPOINTS.USER(userId), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to load user');
    return response.json();
  } catch (error) {
    console.error('Error loading user:', error);
    return null;
  }
};
