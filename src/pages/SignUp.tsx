import React from "react";
import "./SignUp.css";
import { Link } from "react-router-dom";

const SignUp: React.FC = () => {
  return (
    <div className="signup-page">
      <div className="signup-box">
        <h2 className="signup-title">Create Account ✨</h2>
        <p className="signup-subtitle">Join us and get started today!</p>

        <form className="signup-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your full name" required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Create a password" required />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" placeholder="Re-enter password" required />
          </div>

          <button type="submit" className="signup-button">
            Sign Up
          </button>

          <p className="login-text">
            Already have an account?  <Link to="/login">Log In</Link> {/* 👈 Use Link here */}
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
