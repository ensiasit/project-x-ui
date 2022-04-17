import { Route, Routes } from "react-router-dom";

import { useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import { Dashboard, Profile, Signin, Signup } from "./pages";
import { darkTheme, lightTheme } from "./helpers/theme.constans";
import { GlobalContext, globalContext } from "./helpers/context.helper";

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

  const globalContextValue = useMemo<GlobalContext>(() => {
    return {
      toggleTheme,
    };
  }, [theme]);

  return (
    <globalContext.Provider value={globalContextValue}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/" element={<Signin />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/:contestId" element={<Dashboard />} />
          </Routes>
        </ThemeProvider>
      </QueryClientProvider>
    </globalContext.Provider>
  );
};

export default App;
