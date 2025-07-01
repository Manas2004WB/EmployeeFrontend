import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"
const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5124/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const error = await response.text();
        alert(`Login failed: ${error}`);
        return;
      }

      const data = await response.json();
      localStorage.setItem("loggedInUser", JSON.stringify(data));
      onLogin(data);
      
      navigate('/'); // 🔁 Redirect to dashboard after login
    } catch (err) {
      console.error(err);
      alert("Something went wrong during login.");
    }
  };


return (
  <div className="login-container">
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      <button type="submit">Login</button>
    </form>
  </div>
);
}
export default Login;
