import { Box, TextField, Typography, useTheme } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import { Alert, Error, FormContainer } from "../../../components";
import { useCurrentUser } from "../../../helpers/security.helper";
import { useCreateUser } from "../../../services/user.service";
import { globalContext } from "../../../helpers/context.helper";
import { UserContestRole } from "../../../services/contest.service";

const UsersAdd = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { palette, typography } = useTheme();
  const { currentContest } = useContext(globalContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const currentUser = useCurrentUser(true);
  const addUser = useCreateUser({
    onSuccess: () => {
      queryClient.invalidateQueries([
        "getContestUsers",
        Number((currentContest as UserContestRole).contest.id),
      ]);

      navigate("/dashboard/manage/users");
    },
  });

  if (currentContest === null) {
    return <Error message="You must choose a contest to see this page" />;
  }

  if (currentUser.isSuccess && !currentUser.data.admin) {
    return <Error message="You don't have access." />;
  }

  const onUpdate = () => {
    addUser.mutate({
      id: 0,
      username,
      email,
      password,
      admin: false,
    });
  };

  return (
    <FormContainer>
      {addUser.isError && (
        <Alert severity="error">{addUser.error.message}</Alert>
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
        loading={addUser.isLoading}
        variant="contained"
        fullWidth
        onClick={onUpdate}
      >
        Add
      </LoadingButton>
    </FormContainer>
  );
};

export default UsersAdd;
