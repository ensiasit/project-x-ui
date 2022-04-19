import { Route, Routes } from "react-router-dom";

import { useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  Affiliations,
  AffiliationsAdd,
  AffiliationsEdit,
  Competitions,
  CompetitionsAdd,
  Dashboard,
  Profile,
  Signin,
  Signup,
} from "./pages";
import { darkTheme, lightTheme } from "./helpers/theme.constans";
import { GlobalContext, globalContext } from "./helpers/context.helper";
import CompetitionsEdit from "./pages/Manage/Competitions/CompetitionsEdit";

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
            <Route
              path="/dashboard/manage/competitions"
              element={<Competitions />}
            />
            <Route
              path="/dashboard/manage/competitions/add"
              element={<CompetitionsAdd />}
            />
            <Route
              path="/dashboard/manage/competitions/edit/:competitionId"
              element={<CompetitionsEdit />}
            />
            <Route
              path="/dashboard/manage/affiliations"
              element={<Affiliations />}
            />
            <Route
              path="/dashboard/manage/affiliations/add"
              element={<AffiliationsAdd />}
            />
            <Route
              path="/dashboard/manage/affiliations/edit/:affiliationId"
              element={<AffiliationsEdit />}
            />
            <Route path="/dashboard/:contestId" element={<Dashboard />} />
          </Routes>
        </ThemeProvider>
      </QueryClientProvider>
    </globalContext.Provider>
  );
};

export default App;
