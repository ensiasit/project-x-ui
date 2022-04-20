import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Loader } from "../../components";
import { useGetCurrentUser } from "../../services/security.service";

interface DashboardProps {
  children?: ReactNode;
}

const Dashboard = ({ children }: DashboardProps) => {
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
      currentUser={getCurrentUser.data}
      withCompetitionsList
      sideNavItems={[
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
      ]}
    >
      {children}
    </Layout>
  ) : null;
};

export default Dashboard;
