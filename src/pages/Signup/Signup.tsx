import {
  Box,
  Button,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useGetContests } from "../../services/contest.service";
import { Alert, Loader } from "../../components";
import { mapContestDtoToMenuItem } from "../../helpers/contest.helper";
import {
  Role,
  useGetCurrentUser,
  useRegister,
} from "../../services/security.service";

const Signup = () => {
  const navigate = useNavigate();

  const { palette, typography } = useTheme();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contest, setContest] = useState("");

  const getCurrentUser = useGetCurrentUser();
  const getContests = useGetContests({ enabled: getCurrentUser.isError });
  const register = useRegister({
    onSuccess: () => {
      navigate("/signin?success=1");
    },
  });

  const contests = useMemo(
    () => (getContests.data || []).map(mapContestDtoToMenuItem),
    [getContests],
  );

  const onSignup = () => {
    register.mutate({
      username,
      email,
      password,
      contestId: contest,
      role: Role.ROLE_USER,
    });
  };

  useEffect(() => {
    if (getCurrentUser.isSuccess) {
      navigate("/dashboard");
    }
  }, [getCurrentUser.status, register.status]);

  if (getCurrentUser.isLoading) {
    return <Loader />;
  }

  if (getContests.isError) {
    return <Alert severity="error">Could not fetch contests</Alert>;
  }

  if (getContests.isLoading) {
    return <Loader />;
  }

  return getCurrentUser.isError ? (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography sx={{ fontSize: typography.h6, textAlign: "center", mb: 4 }}>
        Project X
      </Typography>
      <Grid container>
        <Grid item xs={2} md={3} lg={4} />
        <Grid item xs={8} md={6} lg={4}>
          <Stack spacing={2}>
            {register.isError && (
              <Alert severity="error">{register.error.message}</Alert>
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                Email
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                Password
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  color:
                    password === confirmPassword
                      ? palette.text.secondary
                      : palette.error.main,
                  fontSize: typography.body2,
                  mb: 1,
                }}
              >
                Confirm password
              </Typography>
              <TextField
                fullWidth
                type="password"
                size="small"
                value={confirmPassword}
                error={password !== confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                Contest
              </Typography>
              <TextField
                fullWidth
                select
                size="small"
                value={contest}
                onChange={(e) => setContest(e.target.value)}
              >
                {contests.map(({ label, value }) => (
                  <MenuItem key={nanoid()} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Grid container>
              <Grid item xs={6} sx={{ pr: 1 }}>
                <LoadingButton
                  loading={register.isLoading}
                  variant="contained"
                  fullWidth
                  onClick={onSignup}
                >
                  Sign up
                </LoadingButton>
              </Grid>
              <Grid item xs={6} sx={{ pl: 1 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => navigate("/signin")}
                >
                  Sign in
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  ) : null;
};

export default Signup;
