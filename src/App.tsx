import { Route, Routes } from "react-router-dom";

import { useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  Affiliations,
  AffiliationsAdd,
  AffiliationsEdit,
  Contests,
  ContestsAdd,
  Profile,
  Signin,
  Signup,
} from "./pages";
import { darkTheme, lightTheme } from "./helpers/theme.constans";
import { GlobalContext, globalContext } from "./helpers/context.helper";
import ContestsEdit from "./pages/Manage/Contests/ContestsEdit";
import { Layout } from "./components";

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
    <QueryClientProvider client={queryClient}>
      <globalContext.Provider value={globalContextValue}>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/dashboard" element={<Layout />}>
              <Route path=":contestId" element={null} />

              <Route path="profile" element={<Profile />} />

              <Route path="manage/competitions" element={<Contests />} />
              <Route path="manage/competitions/add" element={<ContestsAdd />} />
              <Route
                path="manage/competitions/edit/:contestId"
                element={<ContestsEdit />}
              />

              <Route path="manage/affiliations" element={<Affiliations />} />
              <Route
                path="manage/affiliations/add"
                element={<AffiliationsAdd />}
              />
              <Route
                path="manage/affiliations/edit/:affiliationId"
                element={<AffiliationsEdit />}
              />
            </Route>
          </Routes>
        </ThemeProvider>
      </globalContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
