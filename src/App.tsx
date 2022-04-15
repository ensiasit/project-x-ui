import { Route, Routes } from "react-router-dom";

import { useState } from "react";
import { ThemeProvider } from "@mui/material";
import { Dashboard, Signin, Signup } from "./pages";
import { darkTheme, lightTheme } from "./helpers/theme.constans";

const App = () => {
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
      <Routes>
        <Route
          path="/dashboard"
          element={<Dashboard toggleTheme={toggleTheme} />}
        />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
