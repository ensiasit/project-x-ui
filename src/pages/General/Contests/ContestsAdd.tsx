import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { DateTime } from "luxon";
import { useQueryClient } from "react-query";
import { Error, FormContainer, Loader } from "../../../components";
import { useCreateContest } from "../../../services/contest.service";
import { formatToUTC } from "../../../helpers/date.helper";
import { useCurrentUser } from "../../../helpers/security.helper";
import { useNotification } from "../../../helpers/notifications.helper";

const ContestsAdd = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { palette, typography } = useTheme();
  const { pushNotification } = useNotification();

  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState(DateTime.utc());
  const [endTime, setEndTime] = useState(DateTime.utc());
  const [freezeTime, setFreezeTime] = useState(DateTime.utc());
  const [unfreezeTime, setUnfreezeTime] = useState(DateTime.utc());
  const [publicScoreboard, setPublicScoreboard] = useState(false);

  const currentUser = useCurrentUser(true);
  const createContest = useCreateContest({
    onSuccess: () => {
      queryClient.invalidateQueries("getUserContests");
      navigate("/dashboard/general/contests");
      pushNotification("Contest added with success", "success");
    },
    onError: () => {
      pushNotification("Could not add contest", "error");
    },
  });

  if (currentUser.isLoading) {
    return <Loader />;
  }

  if (currentUser.isSuccess && !currentUser.data.admin) {
    return <Error message="You don't have access." />;
  }

  const onAdd = () => {
    createContest.mutate({
      id: 0,
      name,
      startTime,
      endTime,
      freezeTime,
      unfreezeTime,
      publicScoreboard,
    });
  };

  return currentUser.isSuccess ? (
    <FormContainer>
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
      <Grid container>
        <Grid xs={6} item sx={{ pr: 1 }}>
          <LoadingButton
            loading={createContest.isLoading}
            variant="contained"
            fullWidth
            onClick={onAdd}
          >
            Add
          </LoadingButton>
        </Grid>
        <Grid xs={6} item sx={{ pl: 1 }}>
          <Button
            color="secondary"
            variant="contained"
            fullWidth
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </FormContainer>
  ) : null;
};

export default ContestsAdd;
