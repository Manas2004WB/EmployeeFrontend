import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import EmployeeList from './Components/EmployeeList';
import EmployeeForm from './Components/EmployeeForm';
import { getAllEmployees } from './services/employeeService';
import { ToastContainer } from 'react-toastify';
import './App.css';
import Dashboard from './pages/Dashbord';



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
