import React, { useState } from "react";
import { Box, Container, Paper, Typography, TextField, Button, Link as MuiLink } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../NotificationProvider";
import { useAuth } from "../auth/AuthProvider";

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { show } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const response = await fetch(`${apiUrl}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      login(data.user, data.token);
      show(`Welcome back, ${data.user.fullName}!`, "success");
      navigate("/products");
    } else {
      show(data.message || "Login failed.", "error");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Paper elevation={6} sx={{ width: "100%", p: 4, borderRadius: 2 }}>
        <Typography variant="h6" align="center" sx={{ fontWeight: 600 }}>
          Welcome Back 👋
        </Typography>
        <Typography align="center" color="grey" sx={{ mb: 2 }}>
          Please log in to your account.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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

          <Button type="submit" variant="contained" size="large">
            Log In
          </Button>

          <Typography align="center" variant="body2">
            Don’t have an account?{" "}
            <MuiLink component={Link} to="/signup" underline="hover">
              Sign Up
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;