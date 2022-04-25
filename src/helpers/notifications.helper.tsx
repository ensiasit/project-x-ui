import {
  SnackbarKey,
  SnackbarMessage,
  useSnackbar,
  VariantType,
} from "notistack";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

export const useNotification = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const action = (key: SnackbarKey) => (
    <IconButton onClick={() => closeSnackbar(key)}>
      {" "}
      <Close fontSize="small" />{" "}
    </IconButton>
  );

  return {
    pushNotification: (message: SnackbarMessage, variant: VariantType) => {
      enqueueSnackbar(message, { variant, action });
    },
  };
};
