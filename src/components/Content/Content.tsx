import React from "react";
import { Box, useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

interface ContentProps {
  children: React.ReactNode;
}

const Content = ({ children }: ContentProps) => {
  const { palette } = useTheme();

  return (
    <Box
      sx={{
        marginLeft: "260px",
        p: 3,
        height: "calc(100% - 65px - 24px - 24px)",
        backgroundColor: palette.mode === "light" ? grey[100] : grey[900],
        color: palette.text.primary,
      }}
    >
      {children}
    </Box>
  );
};

export default Content;
