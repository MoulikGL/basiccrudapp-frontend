import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Products from "./pages/Products";
import UserList from "./pages/UserList";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="products" element={<Products />} />
        <Route path="userlist" element={<UserList />} />
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Route>
    </Routes>
  );
};

export default App;