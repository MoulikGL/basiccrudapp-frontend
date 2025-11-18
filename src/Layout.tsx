import { Box, Toolbar } from "@mui/material";
import NavHeader from "./NavHeader";
import NavSidebar from "./NavSidebar";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <Box>
      {/* <NavHeader /> */}
      {/* <NavSidebar /> */}
      <Box component="main" sx={{ p: 4, ml: 0, minHeight: "100vh", background: "linear-gradient(135deg, #ce93d8, #512da8)" }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;