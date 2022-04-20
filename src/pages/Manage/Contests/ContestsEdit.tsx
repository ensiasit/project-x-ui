import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { DateTime } from "luxon";
import { useQueryClient } from "react-query";
import {
  useGetContest,
  useUpdateContest,
} from "../../../services/contest.service";
import { Alert, Error, FormContainer, Loader } from "../../../components";
import { formatToUTC } from "../../../helpers/date.helper";
import { useCurrentUser } from "../../../helpers/security.helper";

const ContestsEdit = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { palette, typography } = useTheme();
  const { contestId } = useParams();

  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState(DateTime.utc());
  const [endTime, setEndTime] = useState(DateTime.utc());
  const [freezeTime, setFreezeTime] = useState(DateTime.utc());
  const [unfreezeTime, setUnfreezeTime] = useState(DateTime.utc());
  const [publicScoreboard, setPublicScoreboard] = useState(false);

  const currentUser = useCurrentUser(true);
  const contest = useGetContest(Number(contestId), {
    enabled: currentUser.isSuccess,
  });
  const updateContest = useUpdateContest({
    onSuccess: () => {
      queryClient.invalidateQueries("getContests");
      queryClient.invalidateQueries(["getContest", Number(contestId)]);
      navigate("/dashboard/manage/competitions?success=1");
    },
  });

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

  if (currentUser.isLoading || contest.isLoading) {
    return <Loader />;
  }

  if (contest.isError) {
    return <Error message="Could not fetch contest" />;
  }

  const onAdd = () => {
    updateContest.mutate({
      id: Number(contestId),
      name,
      startTime,
      endTime,
      freezeTime,
      unfreezeTime,
      publicScoreboard,
    });
  };

  return currentUser.isSuccess && contest.isSuccess ? (
    <FormContainer>
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
            setStartTime(DateTime.fromISO(e.target.value, { zone: "UTC" }));
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
            setEndTime(DateTime.fromISO(e.target.value, { zone: "UTC" }));
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
            setFreezeTime(DateTime.fromISO(e.target.value, { zone: "UTC" }));
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
            setUnfreezeTime(DateTime.fromISO(e.target.value, { zone: "UTC" }));
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
    </FormContainer>
  ) : null;
};

export default ContestsEdit;
