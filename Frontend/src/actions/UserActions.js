import axios from 'axios';
import { makeRequest } from '../context/interceptor';

export const getUserById = async (id) => {
  try {
    const userResponse = await makeRequest(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`);
    return userResponse;
  } catch (err) {
    throw new Error('Could not get user');
  }
};

export const updateUser = async (id, user) => {
  try {
    const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, JSON.stringify(user), {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response;
  } catch (err) {
    throw new Error('Could not update user');
  }
};

export const getUserByToken = async () => {
  try {
    const response = await makeRequest(`${process.env.REACT_APP_BACKEND_URL}/users/info/`);
    return response;
  } catch (err) {
    throw new Error('Could not find user');
  }
};
