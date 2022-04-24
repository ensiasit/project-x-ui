import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormContainer, Loader } from "../../components";
import { useUpdateUser } from "../../services/user.service";
import { useCurrentUser } from "../../helpers/security.helper";
import { useNotification } from "../../helpers/notifications.helper";

const Profile = () => {
  const navigate = useNavigate();
  const { palette, typography } = useTheme();
  const { pushNotification } = useNotification();

  const currentUser = useCurrentUser(true);
  const updateUser = useUpdateUser({
    onSuccess: () => {
      navigate(-1);
      pushNotification("Profile updated with success", "success");
    },
    onError: () => {
      pushNotification("Could not update profile", "error");
    },
  });

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (currentUser.isSuccess) {
      setUsername(currentUser.data.username);
      setEmail(currentUser.data.email);
    }
  }, [currentUser.status]);

  if (currentUser.isLoading) {
    return <Loader />;
  }

  const onUpdate = () => {
    updateUser.mutate({
      id: 0,
      username,
      email,
      password,
      admin: false,
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
      <Grid container>
        <Grid xs={6} item sx={{ pr: 1 }}>
          <LoadingButton
            loading={updateUser.isLoading}
            variant="contained"
            fullWidth
            onClick={onUpdate}
          >
            Update
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

export default Profile;
