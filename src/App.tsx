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
  Problems,
  Profile,
  Settings,
  Signin,
  Signup,
  Teams,
  Users,
  UsersAdd,
  UsersEdit,
} from "./pages";
import { darkTheme, lightTheme } from "./helpers/theme.constans";
import { GlobalContext, globalContext } from "./helpers/context.helper";
import ContestsEdit from "./pages/General/Contests/ContestsEdit";
import { Layout, NotificationProvider } from "./components";
import {
  setLocalStorageCurrentContest,
  UserContestRole,
} from "./services/contest.service";

const queryClient = new QueryClient();

const App = () => {
  const [theme, setTheme] = useState(lightTheme);
  const [currentContest, setCurrentContest] = useState<UserContestRole | null>(
    null,
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
          <NotificationProvider>
            <Routes>
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />

              <Route path="/dashboard" element={<Layout />}>
                <Route path="profile" element={<Profile />} />

                <Route path="general/contests" element={<Contests />} />
                <Route path="general/contests/add" element={<ContestsAdd />} />
                <Route
                  path="general/contests/edit/:contestId"
                  element={<ContestsEdit />}
                />

                <Route path="general/affiliations" element={<Affiliations />} />
                <Route
                  path="general/affiliations/add"
                  element={<AffiliationsAdd />}
                />
                <Route
                  path="general/affiliations/edit/:affiliationId"
                  element={<AffiliationsEdit />}
                />

                <Route path="general/users" element={<Users />} />
                <Route path="general/users/add" element={<UsersAdd />} />
                <Route
                  path="general/users/edit/:userId"
                  element={<UsersEdit />}
                />

                <Route path="general/problems" element={<Problems />} />

                <Route path="manage/settings" element={<Settings />} />

                <Route path="manage/teams" element={<Teams />} />
              </Route>
            </Routes>
          </NotificationProvider>
        </ThemeProvider>
      </globalContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
