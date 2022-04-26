import { useTheme } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import {
  Article,
  Business,
  EmojiEvents,
  Group,
  Person,
  Settings,
} from "@mui/icons-material";
import { Content, Error, Header, Loader, Sidenav } from "../index";
import { logout, Role } from "../../services/security.service";
import { useGetUserContests } from "../../services/contest.service";
import { mapUserContestRoleToDropdownItem } from "../../helpers/contest.helper";
import { ListItem } from "../Sidenav/Sidenav";
import { globalContext, GlobalContext } from "../../helpers/context.helper";
import { DropdownItem } from "../Dropdown/Dropdown";
import { useCurrentUser } from "../../helpers/security.helper";

const Layout = () => {
  const navigate = useNavigate();
  const { toggleTheme } = useContext<GlobalContext>(globalContext);
  const { palette } = useTheme();
  const { currentContest, setCurrentContest } = useContext(globalContext);

  const currentUser = useCurrentUser(true);
  const userContests = useGetUserContests({
    enabled: currentUser.isSuccess,
  });

  useEffect(() => {
    if (userContests.isSuccess && currentContest !== null) {
      const currentUserContestRole = userContests.data.find(
        (userContestRole) =>
          userContestRole.contest.id === currentContest.contest.id,
      );

      if (currentUserContestRole) {
        setCurrentContest(currentUserContestRole);
      }
    }
  }, [userContests.status]);

  if (currentUser.isLoading || userContests.isLoading) {
    return <Loader />;
  }

  if (userContests.isError) {
    return <Error message="Could not fetch user contests." />;
  }

  const onSignOut = () => {
    logout();
    setCurrentContest(null);
    navigate("/signin");
  };

  const contests: DropdownItem[] = userContests.isSuccess
    ? userContests.data
        .filter(
          ({ role }) =>
            role === Role.ROLE_ADMIN || role === Role.ROLE_MODERATOR,
        )
        .map((userContestRole) =>
          mapUserContestRoleToDropdownItem(
            userContestRole,
            () => {
              setCurrentContest(userContestRole);
            },
            currentContest !== null &&
              userContestRole.contest.id === currentContest.contest.id,
          ),
        )
    : [];

  const manageEnabled =
    currentContest !== null &&
    (currentContest.role === Role.ROLE_MODERATOR ||
      currentContest.role === Role.ROLE_ADMIN);

  const sidenavItems: ListItem[] = [
    {
      id: "general",
      label: "General",
      path: "",
      enabled: currentUser.isSuccess && currentUser.data.admin,
      isActive: () => false,
      subitems: [
        {
          id: "contests",
          label: "Contests",
          path: "/dashboard/general/contests",
          subitems: [],
          enabled: true,
          icon: <EmojiEvents />,
          isActive: (path) => path.startsWith("/dashboard/general/contests"),
        },
        {
          id: "affiliations",
          label: "Affiliations",
          path: "/dashboard/general/affiliations",
          subitems: [],
          icon: <Business />,
          enabled: true,
          isActive: (path) =>
            path.startsWith("/dashboard/general/affiliations"),
        },
        {
          id: "problems",
          label: "Problems",
          path: "/dashboard/general/problems",
          subitems: [],
          icon: <Article />,
          enabled: true,
          isActive: (path) => path.startsWith("/dashboard/general/problems"),
        },
        {
          id: "users",
          label: "Users",
          path: "/dashboard/general/users",
          subitems: [],
          enabled: true,
          icon: <Person />,
          isActive: (path) => path.startsWith("/dashboard/general/users"),
        },
      ],
    },
    {
      id: "manage",
      label: "Manage",
      path: "",
      subitems: [
        {
          id: "settings",
          label: "Settings",
          path: "/dashboard/manage/settings",
          subitems: [],
          icon: <Settings />,
          enabled: true,
          isActive: (path) => path.startsWith("/dashboard/manage/settings"),
        },
        {
          id: "teams",
          label: "Teams",
          path: "/dashboard/manage/teams",
          subitems: [],
          icon: <Group />,
          enabled: true,
          isActive: (path) => path.startsWith("/dashboard/manage/teams"),
        },
      ],
      enabled: manageEnabled,
      isActive: () => false,
    },
    {
      id: "compete",
      label: "Compete",
      path: "",
      subitems: [],
      enabled: false,
      isActive: () => false,
    },
  ];

  return currentUser.isSuccess && userContests.isSuccess ? (
    <>
      <Header
        title="Project X"
        contests={contests}
        profile={[
          { id: "1", label: currentUser.data.username, selected: true },
          {
            id: "2",
            label: "Profile",
            selected: false,
            onClick: () => navigate("/dashboard/profile"),
          },
          {
            id: "3",
            label: palette.mode === "light" ? "Dark mode" : "Light mode",
            selected: false,
            onClick: toggleTheme,
          },
          { id: "4", label: "Sign out", selected: false, onClick: onSignOut },
        ]}
      />
      <Sidenav items={sidenavItems} />
      <Content>
        <Outlet />
      </Content>
    </>
  ) : null;
};

export default Layout;
