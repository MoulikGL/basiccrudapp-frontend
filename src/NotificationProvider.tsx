import { createContext, useContext, useState, type ReactNode } from "react";
import { Snackbar, Alert } from "@mui/material";

type Severity = "success" | "error";
type ShowFn = (message: string, severity?: Severity) => void;

const NotificationContext = createContext<{ show: ShowFn }>({ show: () => {} });

export function useNotification() {
  return useContext(NotificationContext);
}

export default function NotificationProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [sev, setSev] = useState<Severity>("success");

  const show: ShowFn = (message, severity = "success") => {
    setMsg(message);
    setSev(severity);
    setOpen(true);
  };

  const handleClose = (_: any, reason?: string) => {
    if (reason !== "clickaway") setOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ show }}>
      {children}
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
        <Alert onClose={handleClose} severity={sev} sx={{ display: "flex", alignItems: "center" }}>
          {msg}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}