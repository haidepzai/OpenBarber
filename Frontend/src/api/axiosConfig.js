import axios from 'axios';
const apiCall = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});
export default apiCall;
