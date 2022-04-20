import { ReactNode } from "react";
import { Box, Grid, Stack, useTheme } from "@mui/material";

interface FormContainerProps {
  children: ReactNode;
}

const FormContainer = ({ children }: FormContainerProps) => {
  const { palette } = useTheme();

  return (
    <Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
      <Grid container>
        <Grid item xs={1} md={2} lg={3} />
        <Grid item xs={10} md={8} lg={6} sx={{ alignItems: "center" }}>
          <Stack
            spacing={2}
            sx={{ backgroundColor: palette.background.paper, p: 4 }}
          >
            {children}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FormContainer;
