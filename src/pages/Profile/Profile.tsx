import { Box, TextField, Typography, useTheme } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { Alert, FormContainer, Loader } from "../../components";
import { useUpdateUser } from "../../services/user.service";
import { useCurrentUser } from "../../helpers/security.helper";

const Profile = () => {
  const { palette, typography } = useTheme();

  const currentUser = useCurrentUser(true);
  const updateUser = useUpdateUser();

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
    updateUser.mutate({ username, email, password, admin: false });
  };

  return currentUser.isSuccess ? (
    <FormContainer>
      {updateUser.isSuccess && (
        <Alert severity="success">Information updated with success</Alert>
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
    </FormContainer>
  ) : null;
};

export default Profile;
