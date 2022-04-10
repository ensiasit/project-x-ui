import { useState } from "react";
import { ThemeProvider, Typography } from "@mui/material";

import { lightTheme, darkTheme } from "../../helpers/theme.constans";
import { Header, Sidenav, Content } from "../../components";

const Main = () => {
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    if (theme === lightTheme) {
      setTheme(darkTheme);
    } else {
      setTheme(lightTheme);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Header
        title="Project X"
        competitions={[
          { label: "ITHOLIC CPC 2022", path: "#", selected: true },
          { label: "ITHOLIC CPC 2021", path: "#", selected: false },
          { label: "ITHOLIC CPC 2023", path: "#", selected: false },
        ]}
        profile={[
          { label: "John Doe", path: "#", selected: true },
          { label: "Profile", path: "#", selected: false },
          {
            label: theme.palette.mode === "light" ? "Dark mode" : "Light mode",
            path: "#",
            selected: false,
            onClick: toggleTheme,
          },
          { label: "Sign out", path: "#", selected: false },
        ]}
      />
      <Sidenav
        items={[
          {
            label: "Category 1",
            path: "#",
            subitems: [
              {
                label: "Category 1.1",
                path: "",
                subitems: [],
              },
            ],
          },
          {
            label: "Category 2",
            path: "",
            subitems: [
              {
                label: "Category 2.1",
                path: "/",
                subitems: [],
              },
              {
                label: "Category 2.2",
                path: "",
                subitems: [],
              },
            ],
          },
        ]}
      />
      <Content>
        <Typography>Content goes here</Typography>
      </Content>
    </ThemeProvider>
  );
};

export default Main;
