import {
  Alert as MUIAlert,
  AlertColor,
  Collapse,
  IconButton,
} from "@mui/material";
import { ReactNode, useState } from "react";
import { Close } from "@mui/icons-material";

interface AlertProps {
  severity: AlertColor;
  children: ReactNode;
}

const Alert = ({ severity, children }: AlertProps) => {
  const [open, setOpen] = useState(true);

  return (
    <Collapse in={open}>
      <MUIAlert
        severity={severity}
        action={
          <IconButton size="small" onClick={() => setOpen(false)}>
            <Close fontSize="inherit" />
          </IconButton>
        }
      >
        {children}
      </MUIAlert>
    </Collapse>
  );
};

export default Alert;
