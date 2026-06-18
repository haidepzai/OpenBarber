import { usersAPI } from '../api/apiClient';

export const getUserById = async (id) => {
  try {
    const userResponse = await usersAPI.getById(id);
    return userResponse.data;
  } catch (err) {
    throw new Error('Could not get user');
  }
};

export const updateUser = async (id, user) => {
  try {
    const response = await usersAPI.update(id, user);
    return response;
  } catch (err) {
    throw new Error('Could not update user');
  }
};

export const getUserByToken = async () => {
  try {
    const response = await usersAPI.getInfo();
    return response.data;
  } catch (err) {
    throw new Error('Could not find user');
  }
};
