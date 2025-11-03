import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root path to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Sign Up page */}
        <Route path="/signup" element={<SignUp />} />

        {/* Catch-all 404 */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;