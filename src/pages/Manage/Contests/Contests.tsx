import { Box, Button, Stack, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { Role } from "../../../services/security.service";
import { Alert, Error, Loader, Table } from "../../../components";
import {
  useDeleteContest,
  useGetUserContests,
} from "../../../services/contest.service";
import { TableColumn } from "../../../components/Table/Table";
import { filter } from "../../../helpers/table.helper";
import { useCurrentUser } from "../../../helpers/security.helper";

const Contests = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const currentUser = useCurrentUser(true);
  const userContests = useGetUserContests({ enabled: currentUser.isSuccess });
  const deleteContest = useDeleteContest({
    onSuccess: () => {
      queryClient.invalidateQueries("getUserContests");
    },
  });

  if (currentUser.isLoading || userContests.isLoading) {
    return <Loader />;
  }

  if (userContests.isError) {
    return <Error message="Could not fetch contests" />;
  }

  const cols: TableColumn[] = [
    { id: "name", label: "Name", type: "string" },
    { id: "startTime", label: "Start time (UTC)", type: "date" },
    { id: "endTime", label: "End time (UTC)", type: "date" },
    { id: "freezeTime", label: "Freeze time (UTC)", type: "date" },
    { id: "unfreezeTime", label: "Unfreeze time (UTC)", type: "date" },
    { id: "publicScoreboard", label: "Public scoreboard", type: "boolean" },
  ];

  const rows = userContests.isSuccess
    ? userContests.data
        .filter(({ role }) => role !== Role.ROLE_NOTHING)
        .map(({ role, contest }) => {
          return {
            ...contest,
            canEdit: role === Role.ROLE_ADMIN || role === Role.ROLE_MODERATOR,
            canDelete: role === Role.ROLE_ADMIN || role === Role.ROLE_MODERATOR,
          };
        })
    : [];

  const filteredRows = filter(rows, search);

  const onRowDelete = (id: number) => {
    deleteContest.mutate(id);
  };

  const onRowUpdate = (id: number) => {
    navigate(`/dashboard/manage/contests/edit/${id}`);
  };

  return currentUser.isSuccess && userContests.isSuccess ? (
    <Stack spacing={2}>
      {deleteContest.isError && (
        <Alert severity="error">Could not delete contests.</Alert>
      )}
      <Box sx={{ display: "flex" }}>
        <TextField
          sx={{ flexGrow: 1, pr: 2 }}
          placeholder="Filter contests"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          disabled={!currentUser.data.admin}
          variant="contained"
          onClick={() => navigate("/dashboard/manage/contests/add")}
        >
          <Add fontSize="small" sx={{ mr: 1 }} />
          Add contest
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

export default Contests;
