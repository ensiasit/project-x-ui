import { createTheme, ThemeOptions } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Shadows } from "@mui/material/styles/shadows";

export const HEADER_HEIGHT = "64px";
export const SIDENAV_WIDTH = "260px";

const theme: Partial<ThemeOptions> = {
  typography: {
    fontFamily: "'Open Sans', sans-serif ",
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
    button: {
      fontSize: "1rem",
      textTransform: "none",
    },
  },
  shadows: new Array(25).fill("none") as Shadows,
  shape: {
    borderRadius: 0,
  },
};

export const lightTheme = createTheme({
  ...theme,
  palette: {
    mode: "light",
    background: {
      default: "white",
      paper: "white",
    },
    primary: {
      main: "#0f62fe",
    },
    secondary: {
      main: grey[800],
    },
  },
});

export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: "dark",
    background: {
      default: "black",
      paper: "black",
    },
    divider: grey[800],
    primary: {
      main: "#0f62fe",
    },
    secondary: {
      main: grey[700],
    },
  },
});
