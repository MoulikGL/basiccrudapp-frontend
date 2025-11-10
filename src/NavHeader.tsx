import { AppBar, Toolbar, Typography } from "@mui/material";

const NavHeader: React.FC = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#02203C",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight="bold">
          Basic CRUD App
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default NavHeader;