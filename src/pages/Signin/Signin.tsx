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
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Loader } from "../../components";
import { useLogin } from "../../services/security.service";
import { useCurrentUser } from "../../helpers/security.helper";
import { useNotification } from "../../helpers/notifications.helper";

const Signin = () => {
  const navigate = useNavigate();
  const { palette, typography } = useTheme();
  const { pushNotification } = useNotification();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const currentUser = useCurrentUser(false);
  const login = useLogin({
    onSuccess: () => {
      navigate("/dashboard");
    },
    onError: () => {
      pushNotification("Wrong email or password", "error");
    },
  });

  const onSignin = () => {
    login.mutate({ email, password });
  };

  if (currentUser.isLoading) {
    return <Loader />;
  }

  return currentUser.isError ? (
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
