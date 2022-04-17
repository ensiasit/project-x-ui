import { Route, Routes } from "react-router-dom";

import { useState } from "react";
import { ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import { Dashboard, Signin, Signup } from "./pages";
import { darkTheme, lightTheme } from "./helpers/theme.constans";

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default App;
