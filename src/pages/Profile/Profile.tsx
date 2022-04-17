import {
  Box,
  Grid,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Layout, Loader } from "../../components";
import { useGetCurrentUser } from "../../services/security.service";
import { useUpdateUser } from "../../services/user.service";

const Profile = () => {
  const navigate = useNavigate();
  const { palette, typography } = useTheme();

  const getCurrentUser = useGetCurrentUser();
  const updateUser = useUpdateUser();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (getCurrentUser.isError) {
      navigate("/signin");
    }

    if (getCurrentUser.isSuccess) {
      setUsername(getCurrentUser.data.username);
      setEmail(getCurrentUser.data.email);
    }
  }, [getCurrentUser.status]);

  const onUpdate = () => {
    updateUser.mutate({ username, email, password });
  };

  if (getCurrentUser.isLoading) {
    return <Loader />;
  }

  return getCurrentUser.isSuccess ? (
    <Layout
      username={getCurrentUser.data.username}
      sideNavItems={[]}
      withCompetitionsList={false}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid container>
          <Grid item xs={2} md={3} lg={4} />
          <Grid item xs={8} md={6} lg={4}>
            <Stack spacing={2}>
              {updateUser.isSuccess && (
                <Alert severity="success">
                  Information updated with success
                </Alert>
              )}
              {updateUser.isError && (
                <Alert severity="error">{updateUser.error.message}</Alert>
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
                  New password
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
              <LoadingButton
                loading={updateUser.isLoading}
                variant="contained"
                fullWidth
                onClick={onUpdate}
              >
                Update
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  ) : null;
};

export default Profile;
