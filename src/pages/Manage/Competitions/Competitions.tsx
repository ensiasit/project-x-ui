import { Box, Button, Stack, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { Dashboard } from "../../index";
import { Role, useGetCurrentUser } from "../../../services/security.service";
import { Alert, Loader, Table } from "../../../components";
import {
  useDeleteContest,
  useGetUserContests,
} from "../../../services/contest.service";
import { TableColumn } from "../../../components/Table/Table";
import { filter } from "../../../helpers/table.helper";

const Competitions = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");

  const currentUser = useGetCurrentUser();
  const userContests = useGetUserContests({ enabled: currentUser.isSuccess });
  const deleteContest = useDeleteContest();

  useEffect(() => {
    if (currentUser.isError) {
      navigate("/signin");
    }

    if (deleteContest.isSuccess) {
      queryClient.invalidateQueries("getUserContests");
    }
  }, [currentUser.status, deleteContest.status]);

  if (currentUser.isLoading || userContests.isLoading) {
    return <Loader />;
  }

  if (userContests.isError) {
    return <Alert severity="error">Could not fetch contests</Alert>;
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
    ? userContests.data.map(({ role, contest }) => {
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
    navigate(`/dashboard/manage/competitions/edit/${id}`);
  };

  return currentUser.isSuccess && userContests.isSuccess ? (
    <Dashboard>
      <Stack spacing={2}>
        {deleteContest.isSuccess && (
          <Alert severity="success">Competition deleted with success.</Alert>
        )}
        {deleteContest.isError && (
          <Alert severity="error">Could not delete competition.</Alert>
        )}
        {searchParams.get("success") && (
          <Alert severity="success">Competition create with success.</Alert>
        )}
        {currentUser.data.admin && (
          <Box sx={{ display: "flex" }}>
            <TextField
              sx={{ flexGrow: 1, pr: 2 }}
              placeholder="Filter competitions"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => navigate("/dashboard/manage/competitions/add")}
            >
              <Add fontSize="small" sx={{ mr: 1 }} />
              Add contest
            </Button>
          </Box>
        )}
        <Table
          cols={cols}
          rows={filteredRows}
          onRowDelete={onRowDelete}
          onRowUpdate={onRowUpdate}
        />
      </Stack>
    </Dashboard>
  ) : null;
};

export default Competitions;
