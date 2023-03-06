import axios from 'axios';
import { makeRequest } from '../context/http-interceptor';

export const getUserById = async (id) => {
  try {
    const userResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`);
    const userData = await userResponse.json();
    return userData;
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
