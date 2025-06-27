import axios from 'axios';

const API_URL =  'http://localhost:5124/api/Employees'; 

export const getAllEmployees = () => axios.get(API_URL);
export const getEmployeeById = (id) => axios.get(`${API_URL}/${id}`);
export const addEmployee = (employee) => axios.post(API_URL, employee);
export const updateEmployee = (id, employee) => axios.put(`${API_URL}/${id}`, employee);
export const deleteEmployee = (id) => axios.delete(`${API_URL}/${id}`);



