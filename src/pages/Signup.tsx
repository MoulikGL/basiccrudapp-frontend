import React, { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../NotificationProvider";

const Signup: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { show } = useNotification(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      show("Passwords do not match!", "error"); 
      return;
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const response = await fetch(`${apiUrl}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, phoneNumber, address, company, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      show("Signup successful!", "success");
      navigate("/login");
    } else {
      show(data.message || "Signup failed", "error"); 
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box">
        <h2 className="signup-title">Create Account ✨</h2>
        <p className="signup-subtitle">Join us and get started today!</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              placeholder="Enter your company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="signup-button">
            Sign Up
          </button>

          <p className="login-text">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;