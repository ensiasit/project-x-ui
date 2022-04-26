import {
  Autocomplete,
  Box,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { globalContext } from "../../../helpers/context.helper";
import {
  useContestUsers,
  UserContestRole,
  useUpdateUserContestRole,
} from "../../../services/contest.service";
import { Error, Loader } from "../../../components";
import { Role } from "../../../services/security.service";
import { UserDto } from "../../../services/user.service";
import { useNotification } from "../../../helpers/notifications.helper";

interface ModeratorItem {
  label: string;
  user: UserDto;
}

const SettingsModerators = () => {
  const queryClient = useQueryClient();
  const { currentContest } = useContext(globalContext);
  const { pushNotification } = useNotification();

  const currentContestNotNull: UserContestRole =
    currentContest as UserContestRole;

  const users = useContestUsers(currentContestNotNull.contest.id);
  const updateRole = useUpdateUserContestRole({
    onSuccess: () => {
      queryClient.invalidateQueries([
        "getContestUsers",
        currentContestNotNull.contest.id,
      ]);
    },
  });

  const [moderators, setModerators] = useState<UserDto[]>([]);
  const [notModerators, setNotModerators] = useState<ModeratorItem[]>([]);

  useEffect(() => {
    if (users.isSuccess) {
      setModerators(
        users.data
          .filter(({ role }) => role === Role.ROLE_MODERATOR)
          .map(({ user }) => user),
      );

      setNotModerators(
        users.data
          .filter(({ role }) => role === Role.ROLE_USER)
          .map(({ user }) => ({ label: user.email, user })),
      );
    }
  }, [users.status]);

  if (users.isLoading) {
    return <Loader />;
  }

  if (users.isError) {
    return <Error message="Could not fetch users." />;
  }

  const onDelete = (user: UserDto) => {
    updateRole.mutate(
      {
        userId: user.id,
        contestId: currentContestNotNull.contest.id,
        role: Role.ROLE_USER,
      },
      {
        onSuccess: () => {
          setModerators(
            moderators.filter((moderator) => moderator.id !== user.id),
          );
          setNotModerators([...notModerators, { label: user.email, user }]);
          pushNotification("Moderator deleted with success", "success");
        },
      },
    );
  };

  const onChange = (moderatorItem: ModeratorItem | null) => {
    if (moderatorItem !== null) {
      updateRole.mutate(
        {
          userId: moderatorItem.user.id,
          contestId: currentContestNotNull.contest.id,
          role: Role.ROLE_MODERATOR,
        },
        {
          onSuccess: () => {
            setModerators([...moderators, moderatorItem.user]);
            setNotModerators(
              notModerators.filter(
                ({ user: { id } }) => id !== moderatorItem.user.id,
              ),
            );
            pushNotification("Moderator added with success", "success");
          },
        },
      );
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack gap={2}>
        <Typography>Moderators</Typography>
        <Autocomplete
          size="small"
          renderInput={(params) => <TextField {...params} />}
          options={notModerators}
          onChange={(_e, value) => onChange(value)}
        />
        <Box>
          {moderators.map((user) => (
            <Chip
              sx={{ mr: 1 }}
              label={user.email}
              onDelete={() => onDelete(user)}
            />
          ))}
        </Box>
      </Stack>
    </Paper>
  );
};

export default SettingsModerators;
