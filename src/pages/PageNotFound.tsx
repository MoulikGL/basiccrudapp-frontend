import { Box, CardMedia, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import notFoundImg from "../assets/404.png";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: "center", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column"  }} >
      <CardMedia component="img" image={notFoundImg} sx={{ maxWidth: 400 }} />
      <Button variant="outlined" onClick={() => navigate("/")} sx={{ color: "blue", borderColor: "blue" }} >
        Please Login Again
      </Button>
    </Box>
  );
}