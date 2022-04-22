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
  Users,
  UsersAdd,
  UsersEdit,
} from "./pages";
import { darkTheme, lightTheme } from "./helpers/theme.constans";
import { GlobalContext, globalContext } from "./helpers/context.helper";
import ContestsEdit from "./pages/Manage/Contests/ContestsEdit";
import { Layout } from "./components";
import {
  getLocalStorageCurrentContest,
  setLocalStorageCurrentContest,
  UserContestRole,
} from "./services/contest.service";

const queryClient = new QueryClient();

const App = () => {
  const [theme, setTheme] = useState(lightTheme);
  const [currentContest, setCurrentContest] = useState<UserContestRole | null>(
    getLocalStorageCurrentContest(),
  );

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
      currentContest,
      setCurrentContest: (contest) => {
        setLocalStorageCurrentContest(contest);
        setCurrentContest(contest);
      },
    };
  }, [theme, currentContest]);

  return (
    <QueryClientProvider client={queryClient}>
      <globalContext.Provider value={globalContextValue}>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/dashboard" element={<Layout />}>
              <Route path="profile" element={<Profile />} />

              <Route path="manage/contests" element={<Contests />} />
              <Route path="manage/contests/add" element={<ContestsAdd />} />
              <Route
                path="manage/contests/edit/:contestId"
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

              <Route path="manage/users" element={<Users />} />
              <Route path="manage/users/add" element={<UsersAdd />} />
              <Route path="manage/users/edit/:userId" element={<UsersEdit />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </globalContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
