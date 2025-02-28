import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  FC,
} from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

interface DialogContextType {
  openDialog: (config: DialogConfig) => void;
  closeDialog: () => void;
}

interface DialogConfig {
  title?: string;
  message?: string;
  body?: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface DialogProviderProps {
  children: ReactNode;
}

// Cria o contexto com um valor padrão que é imediatamente substituído pelo valor real no provider.
// Isso evita a necessidade de checagem nula toda vez que o contexto é consumido.
const DialogContext = createContext<DialogContextType>({} as DialogContextType);

export const useDialog = () => useContext(DialogContext);

export const DialogProvider: FC<DialogProviderProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [onConfirm, setOnConfirm] = useState<null | (() => void)>(null);
  const [onCancel, setOnCancel] = useState<null | (() => void)>(null);

  const openDialog = useCallback(
    ({ title = "", message = "", body, onConfirm, onCancel }: DialogConfig) => {
      setTitle(title);
      setMessage(message);
      setContent(body);
      if (onConfirm) {
        setOnConfirm(() => onConfirm);
      }
      if (onCancel) {
        setOnCancel(() => onCancel);
      }
      setOpen(true);
    },
    [],
  );

  const closeDialog = useCallback(() => {
    setOpen(false);
    // Opcional: limpar estado ao fechar
    setTimeout(() => {
      setContent(null);
      setTitle("");
      setOnConfirm(null);
      setOnCancel(null);
    }, 300); // Ajuste o timeout se necessário para coincidir com animações
  }, []);

  const handleCancel = () => {
    onCancel?.();
    closeDialog();
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="customized-dialog-title"
      >
        {title && (
          <DialogTitle id="customized-dialog-title">{title}</DialogTitle>
        )}
        <DialogContent dividers>
          {message && <Typography sx={{ mb: 2 }}>{message}</Typography>}
          {content}
        </DialogContent>
        {(onConfirm || onCancel) && (
          <DialogActions>
            <Button onClick={handleCancel}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={() => {
                onConfirm?.();
                closeDialog();
              }}
              autoFocus
            >
              Confirmar
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </DialogContext.Provider>
  );
};
