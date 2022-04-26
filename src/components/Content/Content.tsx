import React from "react";
import { Box, useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
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
      {children}
    </Box>
  );
};

export default Content;
