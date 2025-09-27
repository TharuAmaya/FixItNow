import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function LOgin({ setRole }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const users = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "supplier1", password: "sup123", role: "supplier" },
    { username: "manager", password: "man123", role: "manager" },
    { username: "auditor", password: "audit123", role: "auditor" },
    { username: "supplier2", password: "sup456", role: "supplier" },
    { username: "coordinator", password: "co123", role: "coordinator" },
    { username: "technician", password: "tech123", role: "technician" },  
  ];

  const onSubmit = (e) => {
    e.preventDefault();

    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      setRole(foundUser.role); // updates state

      if (foundUser.role === "admin") navigate("/sidebar");
      else if (foundUser.role === "supplier") navigate("/profile");
      else if (foundUser.role === "coordinator") navigate("/dashboard");
      else if (foundUser.role === "technician") navigate("/tech-dashboard");
    } else {
      alert("Invalid username or password!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-brand">
        <img src="/logo.png" alt="App Logo" className="login-logo" />
        <span className="login-name">FIXITNOW</span>
      </div>

      <div className="login-box">
        <h2>Login</h2>
        <h6>Welcome Back! Please Login to your Account... </h6>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <h5>New User? Sign Up</h5>
        </form>
      </div>
    </div>
  );
}

export default LOgin;
