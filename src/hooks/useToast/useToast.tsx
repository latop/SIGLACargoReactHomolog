import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React, { createContext } from "react";
import { atom, useRecoilState } from "recoil";

interface SnackbarMessage {
  id: string;
  message: string;
  options?: {
    autoHideDuration?: number;
    type?: "success" | "error";
    vertical?: "top" | "bottom";
    horizontal?: "center" | "left" | "right";
  };
}

const snackbarState = atom<SnackbarMessage[]>({
  key: "snackbarState",
  default: [],
});

export interface ToastContextType {
  addToast: (message: string, options?: SnackbarMessage["options"]) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} {...props} />;
  },
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [snackbars, setSnackbars] = useRecoilState(snackbarState);

  const addToast = (message: string, options?: SnackbarMessage["options"]) => {
    setSnackbars((prev) => [
      ...prev,
      { id: String(new Date().getTime()), message, options },
    ]);
  };

  const removeToast = (key: string) => {
    setSnackbars((prev) => prev.filter((snackbar) => snackbar.id !== key));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {snackbars.map((snackbar) => (
        <Snackbar
          key={snackbar.id}
          anchorOrigin={{
            vertical: snackbar.options?.vertical || "top",
            horizontal: snackbar.options?.horizontal || "right",
          }}
          open
          autoHideDuration={snackbar.options?.autoHideDuration || 3000}
          onClose={() => removeToast(snackbar.id)}
        >
          <Alert
            onClose={() => removeToast(snackbar.id)}
            severity={snackbar.options?.type}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
