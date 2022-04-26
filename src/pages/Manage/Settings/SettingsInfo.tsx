import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { DateTime } from "luxon";
import { LoadingButton } from "@mui/lab";
import { useQueryClient } from "react-query";
import {
  useGetContest,
  UserContestRole,
  useUpdateContest,
} from "../../../services/contest.service";
import { globalContext } from "../../../helpers/context.helper";
import { useNotification } from "../../../helpers/notifications.helper";
import { Error, Loader } from "../../../components";
import { formatToUTC } from "../../../helpers/date.helper";

const SettingsInfo = () => {
  const queryClient = useQueryClient();
  const { palette, typography } = useTheme();
  const { currentContest } = useContext(globalContext);
  const { pushNotification } = useNotification();

  const currentContestNotNull: UserContestRole =
    currentContest as UserContestRole;

  const contest = useGetContest(currentContestNotNull.contest.id);
  const updateContest = useUpdateContest({
    onSuccess: () => {
      queryClient.invalidateQueries("getUserContests");
      queryClient.invalidateQueries([
        "getContest",
        currentContestNotNull.contest.id,
      ]);
      pushNotification("Contest updated with success", "success");
    },
    onError: () => {
      pushNotification("Could not update contest", "error");
    },
  });

  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState(DateTime.utc());
  const [endTime, setEndTime] = useState(DateTime.utc());
  const [freezeTime, setFreezeTime] = useState(DateTime.utc());
  const [unfreezeTime, setUnfreezeTime] = useState(DateTime.utc());
  const [publicScoreboard, setPublicScoreboard] = useState(false);

  useEffect(() => {
    if (contest.isSuccess) {
      setName(contest.data.name);
      setStartTime(contest.data.startTime);
      setEndTime(contest.data.endTime);
      setFreezeTime(contest.data.freezeTime);
      setUnfreezeTime(contest.data.unfreezeTime);
      setPublicScoreboard(contest.data.publicScoreboard);
    }
  }, [contest.status]);

  if (contest.isLoading) {
    return <Loader />;
  }

  if (contest.isError) {
    return <Error message="Could not fetch contest" />;
  }

  const onUpdate = () => {
    updateContest.mutate({
      id: currentContestNotNull.contest.id,
      name,
      startTime,
      endTime,
      freezeTime,
      unfreezeTime,
      publicScoreboard,
    });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack gap={2}>
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
        <Grid container spacing={1}>
          <Grid item xs={6}>
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
                setStartTime(DateTime.fromISO(e.target.value, { zone: "UTC" }));
              }}
            />
          </Grid>
          <Grid item xs={6}>
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
                setEndTime(DateTime.fromISO(e.target.value, { zone: "UTC" }));
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={6}>
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
          </Grid>
          <Grid item xs={6}>
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
          </Grid>
        </Grid>
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
          onClick={onUpdate}
        >
          Update
        </LoadingButton>
      </Stack>
    </Paper>
  );
};

export default SettingsInfo;
