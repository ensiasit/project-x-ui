import { Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Content, Header, Loader, Sidenav } from "../../components";
import { logout } from "../../services/security.service";
import { useGetUserContests } from "../../services/contest.service";

interface DashboardProps {
  toggleTheme: () => void;
}

const Dashboard = ({ toggleTheme }: DashboardProps) => {
  const navigate = useNavigate();
  const { palette } = useTheme();

  const getUserContests = useGetUserContests({ retry: 1, retryDelay: 0 });

  const onSignOut = () => {
    logout();
    navigate("/signin");
  };

  if (getUserContests.isError) {
    navigate("/signin");
  }

  if (getUserContests.isLoading) {
    return <Loader />;
  }

  return getUserContests.isSuccess ? (
    <>
      <Header
        title="Project X"
        competitions={[
          { label: "ITHOLIC CPC 2022", path: "#", selected: true },
          { label: "ITHOLIC CPC 2021", path: "#", selected: false },
          { label: "ITHOLIC CPC 2023", path: "#", selected: false },
        ]}
        profile={[
          { label: "John Doe", path: "#", selected: true },
          { label: "Profile", path: "#", selected: false },
          {
            label: palette.mode === "light" ? "Dark mode" : "Light mode",
            path: "#",
            selected: false,
            onClick: toggleTheme,
          },
          { label: "Sign out", path: "#", selected: false, onClick: onSignOut },
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
