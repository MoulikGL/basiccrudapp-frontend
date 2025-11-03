import React from "react";
import "./Login.css";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="login-subtitle">Please log in to your account</p>

        <form className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          <p className="signup-text">
            Don’t have an account?{" "}
            <Link to="/signup">Sign up</Link> {/* 👈 Use Link here */}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
