import axios from 'axios';

const employeeUrl = `${process.env.REACT_APP_BACKEND_URL}/employees/`;

export const deleteEmployeeById = async (id) => {
  try {
    const response = await axios.delete(`${employeeUrl}${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response;
  } catch (err) {
    throw new Error('Could not delete employee');
  }
};

export const createEmployee = async (employee, enterpriseId) => {
  const config = {
    method: 'POST',
    params: { enterpriseId: enterpriseId },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  };
  try {
    const response = await axios.post(employeeUrl, employee, config);
    return response;
  } catch (err) {
    throw new Error('Could not create employee');
  }
}

export const updateStylist = async (id, employee) => {
  const config = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  };
  try {
    const response = await axios.put(`${employeeUrl}${id}`, employee, config);
    return response;
  } catch (err) {
    throw new Error('Could not delete employee');
  }
}
