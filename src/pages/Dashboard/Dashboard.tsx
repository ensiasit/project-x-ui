import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Loader } from "../../components";
import { useGetCurrentUser } from "../../services/security.service";

const Dashboard = () => {
  const navigate = useNavigate();
  const getCurrentUser = useGetCurrentUser();

  useEffect(() => {
    if (getCurrentUser.isError) {
      navigate("/signin");
    }
  });

  if (getCurrentUser.isLoading) {
    return <Loader />;
  }

  return getCurrentUser.isSuccess ? (
    <Layout
      username={getCurrentUser.data.username}
      withCompetitionsList
      sideNavItems={[
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
    >
      <Typography>Content goes here</Typography>
    </Layout>
  ) : null;
};

export default Dashboard;
