import React from "react";
import { Box, useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

import { SnackbarProvider } from "notistack";
import { CheckCircle, Error, Info, Warning } from "@mui/icons-material";
import { HEADER_HEIGHT, SIDENAV_WIDTH } from "../../helpers/theme.constans";

interface ContentProps {
  children: React.ReactNode;
}

const Content = ({ children }: ContentProps) => {
  const { palette } = useTheme();

  return (
    <Box
      sx={{
        marginLeft: SIDENAV_WIDTH,
        overflowY: "auto",
        p: 3,
        // ${2 * (8 * 3)}px is for top and bottom padding. NB: p: 3 <=> p: (3 * 8)px.
        // Doesn't work without additional 1px retrieval :(
        height: `calc(100% - ${HEADER_HEIGHT} - ${2 * (8 * 3)}px - 1px)`,
        backgroundColor: palette.mode === "light" ? grey[100] : grey[900],
        color: palette.text.primary,
      }}
    >
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
        }}
      >
        {children}
      </SnackbarProvider>
    </Box>
  );
};

export default Content;
