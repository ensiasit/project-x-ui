import { useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ReactNode, useContext, useEffect } from "react";
import { Content, Header, Loader, Sidenav } from "../index";
import { logout } from "../../services/security.service";
import { useGetUserContests } from "../../services/contest.service";
import { mapUserContestRoleToDropdownItem } from "../../helpers/contest.helper";
import { ListItem } from "../Sidenav/Sidenav";
import { globalContext, GlobalContext } from "../../helpers/context.helper";

interface DashboardProps {
  withCompetitionsList: boolean;
  sideNavItems: ListItem[];
  username: string;
  children: ReactNode;
}

const Layout = ({
  withCompetitionsList,
  sideNavItems,
  username,
  children,
}: DashboardProps) => {
  const { toggleTheme } = useContext<GlobalContext>(globalContext);
  const navigate = useNavigate();
  const { palette } = useTheme();
  const { contestId } = useParams();

  const getUserContests = useGetUserContests({
    enabled: withCompetitionsList,
  });

  const onSignOut = () => {
    logout();
    navigate("/signin");
  };

  useEffect(() => {
    if (
      withCompetitionsList &&
      getUserContests.isSuccess &&
      getUserContests.data.length > 0 &&
      !contestId
    ) {
      navigate(`/dashboard/${getUserContests.data[0].contest.id}`);
    }
  }, [contestId, getUserContests.status]);

  if (getUserContests.isLoading) {
    return <Loader />;
  }

  const competitions =
    withCompetitionsList && getUserContests.isSuccess
      ? getUserContests.data.map((contestDto) =>
          mapUserContestRoleToDropdownItem(
            contestDto,
            () => navigate(`/dashboard/${contestDto.contest.id}`),
            contestDto.contest.id === Number(contestId),
          ),
        )
      : [];

  return getUserContests.isSuccess || !withCompetitionsList ? (
    <>
      <Header
        title="Project X"
        competitions={competitions}
        profile={[
          { label: username, selected: true },
          {
            label: "Profile",
            selected: false,
            onClick: () => navigate("/dashboard/profile"),
          },
          {
            label: palette.mode === "light" ? "Dark mode" : "Light mode",
            selected: false,
            onClick: toggleTheme,
          },
          { label: "Sign out", selected: false, onClick: onSignOut },
        ]}
      />
      {sideNavItems.length > 0 && <Sidenav items={sideNavItems} />}
      <Content withSideNav={sideNavItems.length > 0}>{children}</Content>
    </>
  ) : null;
};

export default Layout;
