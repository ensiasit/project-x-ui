import { Grid } from "@mui/material";
import { useContext } from "react";
import { useCurrentUser } from "../../../helpers/security.helper";
import { Error, Loader } from "../../../components";
import { globalContext } from "../../../helpers/context.helper";
import SettingsInfo from "./SettingsInfo";
import SettingsModerators from "./SettingsModerators";
import SettingsProblems from "./SettingsProblems";
import { Role } from "../../../services/security.service";

const Settings = () => {
  const { currentContest } = useContext(globalContext);

  const currentUser = useCurrentUser(true, {
    enabled: currentContest !== null,
  });

  if (currentContest === null) {
    return <Error message="Select a contest." />;
  }

  if (currentUser.isLoading) {
    return <Loader />;
  }

  if (
    currentContest.role !== Role.ROLE_ADMIN &&
    currentContest.role !== Role.ROLE_MODERATOR
  ) {
    return <Error message="You don't have access." />;
  }

  return currentUser.isSuccess ? (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <SettingsInfo />
      </Grid>
      <Grid item xs={4}>
        <SettingsModerators />
      </Grid>
      <Grid item xs={12}>
        <SettingsProblems />
      </Grid>
    </Grid>
  ) : null;
};

export default Settings;
