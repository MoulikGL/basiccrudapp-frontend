import { Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { People, Inventory, Login, PersonAdd } from "@mui/icons-material";
import { useAuth } from "./auth/AuthProvider";

const NavSidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const items = user
    ? [
        { to: "/userlist", label: "Users", icon: <People /> },
        { to: "/products", label: "Products", icon: <Inventory /> }
      ]
    : [
        { to: "/login", label: "Login", icon: <Login /> },
        { to: "/signup", label: "Signup", icon: <PersonAdd /> }
      ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#02203C",
          color: "white",
          mt: 8,
        },
      }}
    >
      <List>
        {items.map((it) => (
          <ListItem key={it.to} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={it.to}
              sx={{
                color: "white",
                backgroundColor:
                  location.pathname === it.to ? "#6A6D70" : "transparent",
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                {it.icon}
              </ListItemIcon>
              <ListItemText primary={it.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default NavSidebar;