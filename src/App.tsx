import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Products from "./pages/Products";
import UserList from "./pages/UserList";
import PageNotFound from "./pages/PageNotFound";
import { useAuth } from "./auth/AuthProvider";

const App: React.FC = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route 
          index 
          element={!user ? <Login /> : <Navigate to="/products" replace />} 
        />
        <Route 
          path="login" 
          element={!user ? <Login /> : <Navigate to="/products" replace />}
        />
        <Route 
          path="signup" 
          element={!user ? <Signup /> : <Navigate to="/products" replace />}
        />
        <Route
          path="products"
          element={user ? <Products /> : <Navigate to="/login" replace />}
        />
        <Route
          path="userlist"
          element={user ? <UserList /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default App;