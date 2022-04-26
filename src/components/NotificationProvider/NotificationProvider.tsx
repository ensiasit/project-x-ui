import { ReactNode } from "react";
import { CheckCircle, Error, Info, Warning } from "@mui/icons-material";
import { SnackbarProvider } from "notistack";
import { useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { pathname } = useLocation();
  const { palette } = useTheme();

  return (
    <SnackbarProvider
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
      maxSnack={4}
      iconVariant={{
        success: <CheckCircle sx={{ mr: 1, color: palette.success.main }} />,
        info: <Info sx={{ mr: 1, color: palette.info.main }} />,
        warning: <Warning sx={{ mr: 1, color: palette.warning.main }} />,
        error: <Error sx={{ mr: 1, color: palette.error.main }} />,
      }}
      classes={{
        variantSuccess: `snackbar-success-${palette.mode}`,
        variantInfo: `snackbar-info-${palette.mode}`,
        variantWarning: `snackbar-warning-${palette.mode}`,
        variantError: `snackbar-error-${palette.mode}`,
        containerRoot: `snackbar-root${
          pathname.startsWith("/sign") ? "" : "-margin-top"
        }`,
      }}
    >
      {children}
    </SnackbarProvider>
  );
};

export default NotificationProvider;
