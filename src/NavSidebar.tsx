import { Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { FaUser, FaSimCard, FaUserCheck, FaHistory } from "react-icons/fa";

const items = [
  { to: "/login", label: "Login", icon: <FaUserCheck /> },
  { to: "/signup", label: "Signup", icon: <FaUser /> },
  { to: "/products", label: "Products", icon: <FaSimCard /> },
  { to: "/userlist", label: "User List", icon: <FaHistory /> },
];

const NavSidebar: React.FC = () => {
  const location = useLocation();

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
                backgroundColor: location.pathname === it.to ? "#6A6D70" : "transparent",
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