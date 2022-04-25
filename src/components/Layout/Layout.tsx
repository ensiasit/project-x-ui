import { useTheme } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useQueryClient } from "react-query";
import { Business, EmojiEvents, Person } from "@mui/icons-material";
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
  const queryClient = useQueryClient();

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
    navigate("/signin");
  };

  const contests: DropdownItem[] = userContests.isSuccess
    ? userContests.data
        .filter(({ role }) => role !== Role.ROLE_NOTHING)
        .map((userContestRole) =>
          mapUserContestRoleToDropdownItem(
            userContestRole,
            () => {
              setCurrentContest(userContestRole);
              queryClient.invalidateQueries([
                "getContestUsers",
                userContestRole.contest.id,
              ]);
            },
            currentContest !== null &&
              userContestRole.contest.id === currentContest.contest.id,
          ),
        )
    : [];

  const manageEnabled =
    currentUser.isSuccess &&
    (currentUser.data.admin ||
      (userContests.isSuccess &&
        !!userContests.data.find(
          ({ role }) =>
            role === Role.ROLE_MODERATOR || role === Role.ROLE_ADMIN,
        )));

  const usersEnabled =
    currentContest?.role === Role.ROLE_MODERATOR ||
    currentContest?.role === Role.ROLE_ADMIN;

  const sidenavItems: ListItem[] = [
    {
      id: "manage",
      label: "Manage",
      path: "",
      subitems: [
        {
          id: "contests",
          label: "Contests",
          path: "/dashboard/manage/contests",
          subitems: [],
          enabled: true,
          icon: <EmojiEvents />,
          isActive: (path) => path.startsWith("/dashboard/manage/contests"),
        },
        {
          id: "affiliations",
          label: "Affiliations",
          path: "/dashboard/manage/affiliations",
          subitems: [],
          icon: <Business />,
          enabled: currentUser.isSuccess && currentUser.data.admin,
          isActive: (path) => path.startsWith("/dashboard/manage/affiliations"),
        },
        {
          id: "users",
          label: "Users",
          path: "/dashboard/manage/users",
          subitems: [],
          enabled: usersEnabled,
          icon: <Person />,
          isActive: (path) => path.startsWith("/dashboard/manage/users"),
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
      enabled: true,
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
