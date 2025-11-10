import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import App from "./App";
import NotificationProvider from "./NotificationProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <NotificationProvider>
    <BrowserRouter>
      <CssBaseline />
      <App />
    </BrowserRouter>
  </NotificationProvider>
);