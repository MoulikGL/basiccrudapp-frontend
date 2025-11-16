import React, { useState } from "react";
import { Box, Container, Paper, Typography, TextField, Button, Link as MuiLink } from "@mui/material";
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
      show("Passwords do not match.", "error");
      return;
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const response = await fetch(`${apiUrl}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, phoneNumber, address, company, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      show("Signup successful!", "success");
      navigate("/login");
    } else {
      show(data.message || "Signup failed.", "error");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Paper elevation={6} sx={{ width: "100%", p: 4, borderRadius: 2 }}>
        <Typography variant="h6" align="center" sx={{ fontWeight: 600 }}>
          Create Account ✨
        </Typography>
        <Typography align="center" color="grey" sx={{ mb: 2 }}>
          Join us and get started today!
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <TextField
            label="Phone Number"
            type="number"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />

          <TextField
            label="Address"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <TextField
            label="Company"
            placeholder="Enter your company name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />

          <TextField
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <TextField
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="contained" size="large">
            Sign Up
          </Button>

          <Typography align="center" variant="body2">
            Already have an account?{" "}
            <MuiLink component={Link} to="/login" underline="hover">
              Log In
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signup;