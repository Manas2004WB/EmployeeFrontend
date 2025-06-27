import React, { useState,useEffect } from 'react'
import EmployeeList from './Components/EmployeeList'
import EmployeeForm from './Components/EmployeeForm';
import { getAllEmployees } from './services/employeeService';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css"
const app = () => {
  const[employees,setEmployees] = useState([])
  const[selectedEmployee,setSelectedEmployee] = useState(null)

    // Fetch employees when app loads
    useEffect(() => {
      fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
      try {
        const response = await getAllEmployees();
        setEmployees(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
  return (
    <div className='App'>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="nav">
        <h1>Employee Management System</h1>
      </div>
      <div className="main">
        <div className="listContainer">
            <EmployeeList employees={employees} fetchEmployees={fetchEmployees} onEdit={setSelectedEmployee}/>
        </div>
        <div className="form">
            <EmployeeForm
            fetchEmployees={fetchEmployees}
            selectedEmployee={selectedEmployee} 
            clearSelectedEmployee={() => setSelectedEmployee(null)}
            />
        </div>
      </div>   
      
    </div>
  )
}

export default app;