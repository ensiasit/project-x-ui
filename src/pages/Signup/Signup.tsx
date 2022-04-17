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
import { useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import {
  useGetContests,
  useGetUserContests,
} from "../../services/contest.service";
import { Loader, Alert } from "../../components";
import { mapContestDtoToMenuItem } from "../../helpers/contest.helper";
import { Role, useRegister } from "../../services/security.service";

const Signup = () => {
  const navigate = useNavigate();

  const { palette, typography } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contest, setContest] = useState("");

  const getUserContests = useGetUserContests({ retry: 1, retryDelay: 0 });
  const register = useRegister();
  const getContests = useGetContests();

  const contests = useMemo(
    () => (getContests.data || []).map(mapContestDtoToMenuItem),
    [getContests],
  );

  const onSignup = () => {
    register.mutate({
      name,
      email,
      password,
      contestId: contest,
      role: Role.ROLE_USER,
    });
  };

  if (getUserContests.isSuccess) {
    navigate("/dashboard");
  }

  if (getUserContests.isLoading) {
    return <Loader />;
  }

  if (register.isSuccess) {
    navigate("/signin?fromSignup=1");
  }

  if (getContests.isError) {
    return <Alert severity="error">Could not fetch contests</Alert>;
  }

  if (getContests.isLoading) {
    return <Loader />;
  }

  return getUserContests.isError ? (
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
