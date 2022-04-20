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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useGetContests } from "../../services/contest.service";
import { Alert, Error, Loader } from "../../components";
import { Role, useRegister } from "../../services/security.service";
import { useCurrentUser } from "../../helpers/security.helper";
import { mapContestDtoToMenuItem } from "../../helpers/contest.helper";

const Signup = () => {
  const navigate = useNavigate();
  const { palette, typography } = useTheme();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contest, setContest] = useState("");

  const currentUser = useCurrentUser(false);
  const contests = useGetContests({ enabled: currentUser.isError });
  const register = useRegister({
    onSuccess: () => {
      navigate("/signin?success=1");
    },
  });

  if (currentUser.isLoading || contests.isLoading) {
    return <Loader />;
  }

  if (contests.isError) {
    return <Error message="Could not fetch contests" />;
  }

  const onSignup = () => {
    register.mutate({
      username,
      email,
      password,
      contestId: contest,
      role: Role.ROLE_USER,
    });
  };

  return currentUser.isError && contests.isSuccess ? (
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
                {contests.data
                  .map(mapContestDtoToMenuItem)
                  .map(({ label, value }) => (
                    <MenuItem key={value} value={value}>
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
