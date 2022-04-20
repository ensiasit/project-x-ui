import { useTheme } from "@mui/material";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { useContext } from "react";
import { Content, Error, Header, Loader, Sidenav } from "../index";
import { logout } from "../../services/security.service";
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
  const { contestId } = useParams();

  const currentUser = useCurrentUser(true);
  const getUserContests = useGetUserContests({
    enabled: currentUser.isSuccess,
  });

  if (currentUser.isLoading || getUserContests.isLoading) {
    return <Loader />;
  }

  if (getUserContests.isError) {
    return <Error message="Could not fetch user contests." />;
  }

  const onSignOut = () => {
    logout();
    navigate("/signin");
  };

  const competitions: DropdownItem[] = getUserContests.isSuccess
    ? getUserContests.data.map((userContestRole) =>
        mapUserContestRoleToDropdownItem(
          userContestRole,
          () => navigate(`/dashboard/${userContestRole.contest.id}`),
          userContestRole.contest.id === Number(contestId),
        ),
      )
    : [];

  const sidenavItems: ListItem[] = [
    {
      id: "manage",
      label: "Manage",
      path: "",
      subitems: [
        {
          id: "competitions",
          label: "Competitions",
          path: "/dashboard/manage/competitions",
          subitems: [],
        },
        {
          id: "affiliations",
          label: "Affiliations",
          path: "/dashboard/manage/affiliations",
          subitems: [],
        },
      ],
    },
  ];

  return currentUser.isSuccess && getUserContests.isSuccess ? (
    <>
      <Header
        title="Project X"
        competitions={competitions}
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
