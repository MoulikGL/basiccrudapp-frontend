import { Box, Toolbar } from "@mui/material";
import NavHeader from "./NavHeader";
import NavSidebar from "./NavSidebar";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <Box>
      <NavHeader />
      <NavSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: "240px", background: "linear-gradient(135deg, #ff758c 0%, #9295c7 100%)" }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;