import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import EmployeeList from "../Components/EmployeeList";
import EmployeeForm from '../Components/EmployeeForm';
import { getAllEmployees } from '../services/employeeService';
import { ToastContainer } from 'react-toastify';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import '../App.css';

const Dashboard = ({ user,setUser }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigate = useNavigate(); // from react-router-dom

const handleLogout = () => {
  setUser(null); // clear session
   localStorage.removeItem("loggedInUser");
  navigate('/login');
};


  const fetchEmployees = async () => {
    try {
      const res = await getAllEmployees(user.id);
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
          <ToastContainer position="top-right" 
          autoClose={2000} 
          toastClassName="bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-md rounded-xl"
          bodyClassName="text-sm text-white"
          closeButton={false}/>
        <header className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <Button
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 text-white"
            variant="ghost"
          >
            Logout
          </Button>
        </header>

      <div className="max-w-7xl mx-auto h-[85vh] grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow h-full overflow-y-auto">
          <ScrollArea className="h-full pr-1">
          <EmployeeList
            employees={employees}
            fetchEmployees={fetchEmployees}
            onEdit={setSelectedEmployee}
            user={user}
          />
          </ScrollArea>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow h-fit max-h-[500px] overflow-hidden">
          <EmployeeForm
            fetchEmployees={fetchEmployees}
            selectedEmployee={selectedEmployee}
            clearSelectedEmployee={() => setSelectedEmployee(null)}
            user={user}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;