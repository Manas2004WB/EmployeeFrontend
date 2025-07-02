import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5124/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      alert("Login failed");
      return;
    }

    const data = await response.json();
    localStorage.setItem("loggedInUser", JSON.stringify(data));
    onLogin(data);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl">
        <CardContent className="p-8">
          <h2 className="text-white text-3xl font-semibold mb-6 text-center">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              autoComplete="off"
              className="bg-white/10 text-white placeholder:text-white/60 border border-white/30 focus:ring-2 focus:ring-primary"
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              autoComplete="off"
              className="bg-white/10 text-white placeholder:text-white/60 border border-white/30 focus:ring-2 focus:ring-primary"
            />

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
