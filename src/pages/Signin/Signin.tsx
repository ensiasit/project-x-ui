import {
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Alert, Loader } from "../../components";
import { useLogin } from "../../services/security.service";
import { useGetUserContests } from "../../services/contest.service";

const Signin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { palette, typography } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getUserContests = useGetUserContests({ retry: 1, retryDelay: 0 });
  const login = useLogin();

  const onSignin = () => {
    login.mutate({ email, password });
  };

  if (getUserContests.isSuccess) {
    navigate("/dashboard");
  }

  if (getUserContests.isLoading) {
    return <Loader />;
  }

  if (login.isSuccess) {
    navigate("/dashboard");
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
            {searchParams.get("fromSignup") && (
              <Alert severity="success">You are registered with success</Alert>
            )}
            {login.isError && (
              <Alert severity="error">Incorrect email or password</Alert>
            )}
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
            <Grid container>
              <Grid item xs={6} sx={{ pr: 1 }}>
                <LoadingButton
                  loading={login.isLoading}
                  variant="contained"
                  fullWidth
                  onClick={onSignin}
                >
                  Sign in
                </LoadingButton>
              </Grid>
              <Grid item xs={6} sx={{ pl: 1 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  ) : null;
};

export default Signin;
