import { employeesAPI } from '../api/apiClient';

export const deleteEmployeeById = async (id) => {
  try {
    const response = await employeesAPI.delete(id);
    return response;
  } catch (err) {
    throw new Error('Could not delete employee');
  }
};

export const createEmployee = async (employee, enterpriseId) => {
  try {
    const response = await employeesAPI.create(employee, enterpriseId);
    return response;
  } catch (err) {
    throw new Error('Could not create employee');
  }
};

export const updateStylist = async (id, employee) => {
  try {
    const response = await employeesAPI.update(id, employee);
    return response;
  } catch (err) {
    throw new Error('Could not update employee');
  }
};
