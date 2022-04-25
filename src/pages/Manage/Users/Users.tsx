import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useContext, useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useCurrentUser } from "../../../helpers/security.helper";
import { Error, Loader, Table } from "../../../components";
import { TableColumn } from "../../../components/Table/Table";
import { filter } from "../../../helpers/table.helper";
import { useDeleteUser } from "../../../services/user.service";
import { globalContext } from "../../../helpers/context.helper";
import {
  useContestUsers,
  UserContestRole,
} from "../../../services/contest.service";
import UserRoleSelect from "./UserRoleSelect";
import { Role } from "../../../services/security.service";
import { useNotification } from "../../../helpers/notifications.helper";

const Users = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { currentContest } = useContext(globalContext);
  const { pushNotification } = useNotification();

  const [search, setSearch] = useState("");

  const currentUser = useCurrentUser(true);
  const users = useContestUsers(
    (currentContest as UserContestRole).contest.id,
    {
      enabled: currentUser.isSuccess && !!currentUser,
    },
  );
  const deleteUser = useDeleteUser({
    onSuccess: () => {
      queryClient.invalidateQueries("getUsers");
      pushNotification("User deleted with success", "success");
    },
    onError: () => {
      pushNotification("Could not delete user", "error");
    },
  });

  if (currentContest === null) {
    return <Error message="You must choose a contest to see this page" />;
  }

  if (currentUser.isLoading || users.isLoading) {
    return <Loader />;
  }

  if (users.isError) {
    return <Error message="Could not fetch users" />;
  }

  if (
    currentContest.role !== Role.ROLE_MODERATOR &&
    currentContest.role !== Role.ROLE_ADMIN
  ) {
    return <Error message="You don't have access." />;
  }

  const cols: TableColumn[] = [
    { id: "username", label: "Name", type: "string" },
    { id: "email", label: "Email", type: "string" },
    { id: "role", label: "Role", type: "custom" },
  ];

  const rows =
    currentUser.isSuccess && users.isSuccess
      ? users.data.map(({ role, user, contest }) => {
          return {
            ...user,
            user,
            contest,
            canEdit: currentUser.isSuccess && currentUser.data.admin,
            canDelete: currentUser.isSuccess && currentUser.data.admin,
            _role: role,
            role: {
              render: () => {
                return (
                  <UserRoleSelect
                    key={String(Math.random())}
                    userId={user.id}
                    initialRole={role}
                    currentUserId={currentUser.data.id}
                  />
                );
              },
            },
          };
        })
      : [];

  const filteredRows = filter(rows, search);

  const onRowDelete = (id: number) => {
    deleteUser.mutate(id);
  };

  const onRowUpdate = (id: number) => {
    navigate(`/dashboard/manage/users/edit/${id}`);
  };

  return currentUser.isSuccess && users.isSuccess ? (
    <Stack spacing={2}>
      <Box sx={{ display: "flex" }}>
        <TextField
          sx={{ flexGrow: 1, pr: 2 }}
          placeholder="Filter users"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          disabled={!currentUser.data.admin}
          variant="contained"
          onClick={() => navigate("/dashboard/manage/users/add")}
        >
          <Add fontSize="small" sx={{ mr: 1 }} />
          Add user
        </Button>
      </Box>
      <Table
        cols={cols}
        rows={filteredRows}
        onRowDelete={onRowDelete}
        onRowUpdate={onRowUpdate}
      />
    </Stack>
  ) : null;
};

export default Users;
