import { Box, Button, Stack, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { Error, Loader, Table } from "../../../components";
import {
  useDeleteContest,
  useGetContests,
} from "../../../services/contest.service";
import { TableColumn } from "../../../components/Table/Table";
import { filter } from "../../../helpers/table.helper";
import { useCurrentUser } from "../../../helpers/security.helper";
import { useNotification } from "../../../helpers/notifications.helper";

const Contests = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pushNotification } = useNotification();

  const [search, setSearch] = useState("");

  const currentUser = useCurrentUser(true);
  const contests = useGetContests({ enabled: currentUser.isSuccess });
  const deleteContest = useDeleteContest({
    onSuccess: () => {
      queryClient.invalidateQueries("getContests");
      pushNotification("Contest deleted with success", "success");
    },
    onError: () => {
      pushNotification("Could not delete contest", "error");
    },
  });

  if (currentUser.isLoading || contests.isLoading) {
    return <Loader />;
  }

  if (contests.isError) {
    return <Error message="Could not fetch contests" />;
  }

  if (currentUser.isSuccess && !currentUser.data.admin) {
    return <Error message="You don't have access." />;
  }

  const cols: TableColumn[] = [
    { id: "name", label: "Name", type: "string" },
    { id: "startTime", label: "Start time (UTC)", type: "date" },
    { id: "endTime", label: "End time (UTC)", type: "date" },
    { id: "freezeTime", label: "Freeze time (UTC)", type: "date" },
    { id: "unfreezeTime", label: "Unfreeze time (UTC)", type: "date" },
    { id: "publicScoreboard", label: "Public scoreboard", type: "boolean" },
  ];

  const rows = contests.isSuccess
    ? contests.data.map((contest) => {
        return {
          ...contest,
          canEdit: true,
          canDelete: true,
        };
      })
    : [];

  const filteredRows = filter(rows, search);

  const onRowDelete = (id: number) => {
    deleteContest.mutate(id);
  };

  const onRowUpdate = (id: number) => {
    navigate(`/dashboard/general/contests/edit/${id}`);
  };

  return currentUser.isSuccess && contests.isSuccess ? (
    <Stack spacing={2}>
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
          onClick={() => navigate("/dashboard/general/contests/add")}
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
