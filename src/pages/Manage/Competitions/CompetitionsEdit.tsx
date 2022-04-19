import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { DateTime } from "luxon";
import { useQueryClient } from "react-query";
import { useGetCurrentUser } from "../../../services/security.service";
import {
  useGetContest,
  useUpdateContest,
} from "../../../services/contest.service";
import { Alert, Loader } from "../../../components";
import { Dashboard } from "../../index";
import { formatToUTC } from "../../../helpers/date.helper";

const CompetitionsEdit = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { palette, typography } = useTheme();
  const { competitionId } = useParams();

  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState(DateTime.utc());
  const [endTime, setEndTime] = useState(DateTime.utc());
  const [freezeTime, setFreezeTime] = useState(DateTime.utc());
  const [unfreezeTime, setUnfreezeTime] = useState(DateTime.utc());
  const [publicScoreboard, setPublicScoreboard] = useState(false);

  const currentUser = useGetCurrentUser();
  const getContest = useGetContest(Number(competitionId), {
    enabled: currentUser.isSuccess,
  });
  const updateContest = useUpdateContest({
    onSuccess: () => {
      queryClient.invalidateQueries("getContests");
      queryClient.invalidateQueries(["getContest", Number(competitionId)]);
      navigate("/dashboard/manage/competitions?success=1");
    },
  });

  useEffect(() => {
    if (currentUser.isError) {
      navigate("/signin");
    }

    if (getContest.isSuccess) {
      setName(getContest.data.name);
      setStartTime(getContest.data.startTime);
      setEndTime(getContest.data.endTime);
      setFreezeTime(getContest.data.freezeTime);
      setUnfreezeTime(getContest.data.unfreezeTime);
      setPublicScoreboard(getContest.data.publicScoreboard);
    }
  }, [currentUser.status, getContest.status]);

  const onAdd = () => {
    updateContest.mutate({
      id: Number(competitionId),
      name,
      startTime,
      endTime,
      freezeTime,
      unfreezeTime,
      publicScoreboard,
    });
  };

  if (currentUser.isLoading || getContest.isLoading) {
    return <Loader />;
  }

  if (getContest.isError) {
    return <Alert severity="error">Could not fetch contest</Alert>;
  }

  return currentUser.isSuccess && getContest.isSuccess ? (
    <Dashboard>
      <Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
        <Grid container>
          <Grid item xs={1} md={2} lg={3} />
          <Grid item xs={10} md={8} lg={6}>
            <Stack
              spacing={2}
              sx={{ backgroundColor: palette.background.paper, p: 4 }}
            >
              {updateContest.isError && (
                <Alert severity="error">{updateContest.error.message}</Alert>
              )}
              <Box>
                <Typography
                  sx={{
                    color: palette.text.secondary,
                    fontSize: typography.body2,
                    mb: 1,
                  }}
                >
                  Name
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: palette.text.secondary,
                    fontSize: typography.body2,
                    mb: 1,
                  }}
                >
                  Start time (UTC)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="datetime-local"
                  value={formatToUTC(startTime)}
                  onChange={(e) => {
                    setStartTime(
                      DateTime.fromISO(e.target.value, { zone: "UTC" }),
                    );
                  }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: palette.text.secondary,
                    fontSize: typography.body2,
                    mb: 1,
                  }}
                >
                  End time (UTC)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="datetime-local"
                  value={formatToUTC(endTime)}
                  onChange={(e) => {
                    setEndTime(
                      DateTime.fromISO(e.target.value, { zone: "UTC" }),
                    );
                  }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: palette.text.secondary,
                    fontSize: typography.body2,
                    mb: 1,
                  }}
                >
                  Scoreboard freeze time (UTC)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="datetime-local"
                  value={formatToUTC(freezeTime)}
                  onChange={(e) => {
                    setFreezeTime(
                      DateTime.fromISO(e.target.value, { zone: "UTC" }),
                    );
                  }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: palette.text.secondary,
                    fontSize: typography.body2,
                    mb: 1,
                  }}
                >
                  Scoreboard unfreeze time (UTC)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="datetime-local"
                  value={formatToUTC(unfreezeTime)}
                  onChange={(e) => {
                    setUnfreezeTime(
                      DateTime.fromISO(e.target.value, { zone: "UTC" }),
                    );
                  }}
                />
              </Box>
              <Box>
                <FormControlLabel
                  sx={{
                    color: palette.text.secondary,
                  }}
                  control={
                    <Checkbox
                      checked={publicScoreboard}
                      onChange={() => setPublicScoreboard(!publicScoreboard)}
                    />
                  }
                  label="Public scoreboard"
                />
              </Box>
              <LoadingButton
                loading={updateContest.isLoading}
                variant="contained"
                fullWidth
                onClick={onAdd}
              >
                Update
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Dashboard>
  ) : null;
};

export default CompetitionsEdit;
