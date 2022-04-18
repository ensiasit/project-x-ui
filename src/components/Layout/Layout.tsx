import { useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ReactNode, useContext } from "react";
import { Content, Header, Loader, Sidenav } from "../index";
import { logout } from "../../services/security.service";
import { useGetUserContests } from "../../services/contest.service";
import { mapUserContestRoleToDropdownItem } from "../../helpers/contest.helper";
import { ListItem } from "../Sidenav/Sidenav";
import { globalContext, GlobalContext } from "../../helpers/context.helper";
import { UserDto } from "../../services/user.service";
import { DropdownItem } from "../Dropdown/Dropdown";

interface DashboardProps {
  withCompetitionsList: boolean;
  sideNavItems: ListItem[];
  currentUser: UserDto;
  children: ReactNode;
}

const Layout = ({
  withCompetitionsList,
  sideNavItems,
  currentUser,
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

  if (getUserContests.isLoading) {
    return <Loader />;
  }

  const competitions: DropdownItem[] =
    withCompetitionsList && getUserContests.isSuccess
      ? getUserContests.data.map((contestDto, index) =>
          mapUserContestRoleToDropdownItem(
            contestDto,
            () => navigate(`/dashboard/${contestDto.contest.id}`),
            contestId
              ? contestDto.contest.id === Number(contestId)
              : index === 0,
          ),
        )
      : [];

  return getUserContests.isSuccess || !withCompetitionsList ? (
    <>
      <Header
        title="Project X"
        competitions={competitions}
        profile={[
          { label: currentUser.username, selected: true },
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
