import axios from 'axios';

const API_URL = 'http://localhost:5124/api/Employees';

// View-only (no userId required for backend GET method)
export const getAllEmployees = (userId) => axios.get(`${API_URL}?userId=${userId}`);
export const getEmployeeById = (id) => axios.get(`${API_URL}/${id}`);

// Manager-only (must pass userId in query string)
export const addEmployee = (employee, userId) =>
  axios.post(`${API_URL}?userId=${userId}`, employee);

export const updateEmployee = (id, employee, userId) =>
  axios.put(`${API_URL}/${id}?userId=${userId}`, employee);

export const deleteEmployee = (id, userId) =>
  axios.delete(`${API_URL}/${id}?userId=${userId}`);
