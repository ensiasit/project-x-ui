import { Box, TextField, Typography, useTheme } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import { Alert, Error, FormContainer, Loader } from "../../../components";
import { useCurrentUser } from "../../../helpers/security.helper";
import { useGetUser, useUpdateUserById } from "../../../services/user.service";
import { globalContext } from "../../../helpers/context.helper";
import { UserContestRole } from "../../../services/contest.service";

const UsersEdit = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { palette, typography } = useTheme();
  const { userId } = useParams();
  const { currentContest } = useContext(globalContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const currentUser = useCurrentUser(true);
  const user = useGetUser(Number(userId), { enabled: currentUser.isSuccess });
  const updateUser = useUpdateUserById({
    onSuccess: () => {
      queryClient.invalidateQueries(["getUser", Number(userId)]);
      queryClient.invalidateQueries([
        "getContestUsers",
        Number((currentContest as UserContestRole).contest.id),
      ]);

      navigate("/dashboard/manage/users");
    },
  });

  useEffect(() => {
    if (user.isSuccess) {
      setUsername(user.data.username);
      setEmail(user.data.email);
    }
  }, [user.status]);

  if (currentContest === null) {
    return <Error message="You must choose a contest to see this page" />;
  }

  if (user.isError) {
    return <Error message="Could not fetch user." />;
  }

  if (currentUser.isSuccess && !currentUser.data.admin) {
    return <Error message="You don't have access." />;
  }

  if (user.isLoading) {
    return <Loader />;
  }

  const onUpdate = () => {
    updateUser.mutate({
      id: Number(userId),
      username,
      email,
      password,
      admin: false,
    });
  };

  return user.isSuccess ? (
    <FormContainer>
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

export default UsersEdit;
