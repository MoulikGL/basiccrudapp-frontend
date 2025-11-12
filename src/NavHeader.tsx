import React from "react";
import { AppBar, Toolbar, Typography, Box, Button, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthProvider";
import { useNotification } from "./NotificationProvider";

const NavHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { show } = useNotification();

  const handleLogout = () => {
    logout();
    show(`See you soon, ${user?.fullName}!`, "success"); 
    navigate("/");
  };

  const initials = user?.fullName
    ? user.fullName.split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase()
    : "?";

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#02203C",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
          Basic CRUD App
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {user ? (
            <>
              <Avatar sx={{ width: 32, height: 32 }}>{initials}</Avatar>
              <Typography variant="body1" sx={{ mr: 2 }}>
                {user.fullName}
              </Typography>

              <Button
                variant="contained"
                color="error"
                onClick={handleLogout}
                size="small"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate("/login")}
              size="small"
            >
              Login
            </Button>
          )}
      </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavHeader;