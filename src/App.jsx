import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import EmployeeList from './Components/EmployeeList';
import EmployeeForm from './Components/EmployeeForm';
import { getAllEmployees } from './services/employeeService';
import { ToastContainer } from 'react-toastify';
import './App.css';

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
    <div className='App'>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="nav">
        <h1>Employee Management System</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="main">
        <div className="listContainer">
          <EmployeeList
            employees={employees}
            fetchEmployees={fetchEmployees}
            onEdit={setSelectedEmployee}
            user={user}
          />
        </div>
        <div className="form">
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

function App() {
  const [user, setUser] = useState(() => {
  const storedUser = localStorage.getItem("loggedInUser");
  return storedUser ? JSON.parse(storedUser) : null;
});
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route
          path="/"
          element={
            user ? <Dashboard user={user} setUser={setUser}/> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/dashboard"
          element={
            user ? <Dashboard user={user} setUser={setUser}/> : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
