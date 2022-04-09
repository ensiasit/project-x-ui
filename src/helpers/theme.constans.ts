import { createTheme, ThemeOptions } from "@mui/material";

const theme: Partial<ThemeOptions> = {
  typography: {
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
    button: {
      fontSize: "1rem",
    },
  },
};

export const lightTheme = createTheme({
  ...theme,
  palette: {
    mode: "light",
    background: {
      default: "white !important",
      paper: "white !important",
    },
  },
});

export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: "dark",
    background: {
      default: "black !important",
      paper: "black !important",
    },
  },
});
