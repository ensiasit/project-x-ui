import { Typography, useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Content, Header, Loader, Sidenav } from "../../components";
import { logout, useGetCurrentUser } from "../../services/security.service";
import { useGetUserContests } from "../../services/contest.service";
import { mapUserContestRoleToDropdownItem } from "../../helpers/contest.helper";

interface DashboardProps {
  toggleTheme: () => void;
}

const Dashboard = ({ toggleTheme }: DashboardProps) => {
  const navigate = useNavigate();
  const { palette } = useTheme();
  const { contestId } = useParams();

  const getCurrentUser = useGetCurrentUser();
  const getUserContests = useGetUserContests({
    enabled: getCurrentUser.isSuccess,
  });

  const onSignOut = () => {
    logout();
    navigate("/signin");
  };

  useEffect(() => {
    if (getCurrentUser.isError) {
      navigate("/signin");
    }

    if (
      getUserContests.isSuccess &&
      getUserContests.data.length > 0 &&
      !contestId
    ) {
      navigate(`/dashboard/${getUserContests.data[0].contest.id}`);
    }
  }, [contestId, getCurrentUser.status, getUserContests.status]);

  if (getUserContests.isLoading) {
    return <Loader />;
  }

  return getCurrentUser.isSuccess && getUserContests.isSuccess ? (
    <>
      <Header
        title="Project X"
        competitions={getUserContests.data.map((contestDto) =>
          mapUserContestRoleToDropdownItem(
            contestDto,
            () => navigate(`/dashboard/${contestDto.contest.id}`),
            contestDto.contest.id === Number(contestId),
          ),
        )}
        profile={[
          { label: getCurrentUser.data.username, selected: true },
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
      <Sidenav
        items={[
          {
            label: "Category 1",
            path: "#",
            subitems: [
              {
                label: "Category 1.1",
                path: "",
                subitems: [],
              },
            ],
          },
          {
            label: "Category 2",
            path: "",
            subitems: [
              {
                label: "Category 2.1",
                path: "/",
                subitems: [],
              },
              {
                label: "Category 2.2",
                path: "",
                subitems: [],
              },
            ],
          },
        ]}
      />
      <Content>
        <Typography>Content goes here</Typography>
      </Content>
    </>
  ) : null;
};

export default Dashboard;
