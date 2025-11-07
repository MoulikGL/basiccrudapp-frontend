import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Products from "./pages/Products";
import UserList from "./pages/UserList";
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <nav style={{ padding: "1rem", background: "white" }}>
        <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
        <Link to="/signup" style={{ marginRight: 10 }}>Sign Up</Link>
        <Link to="/products" style={{ marginRight: 10 }}>Products</Link>
        <Link to="/userlist">UserList</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<Products />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;