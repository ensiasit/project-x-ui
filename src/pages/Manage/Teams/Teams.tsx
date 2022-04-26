import { Box, Button, Stack, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../../helpers/security.helper";
import { Error, Loader, Table } from "../../../components";
import { TableColumn } from "../../../components/Table/Table";
import { filter } from "../../../helpers/table.helper";
import { globalContext } from "../../../helpers/context.helper";
import { Role } from "../../../services/security.service";

const Teams = () => {
  const navigate = useNavigate();
  const { currentContest } = useContext(globalContext);

  const [search, setSearch] = useState("");

  const currentUser = useCurrentUser(true, {
    enabled: currentContest !== null,
  });

  if (currentContest === null) {
    return <Error message="Select a contest." />;
  }

  if (currentUser.isLoading) {
    return <Loader />;
  }

  if (
    currentContest.role !== Role.ROLE_ADMIN &&
    currentContest.role !== Role.ROLE_MODERATOR
  ) {
    return <Error message="You don't have access." />;
  }

  const cols: TableColumn[] = [{ id: "name", label: "Name", type: "string" }];

  const rows: any[] = [];

  const filteredRows = filter(rows, search);

  const onRowDelete = (id: number) => {
    console.log("Delete team");
  };

  const onRowUpdate = (id: number) => {
    navigate(`/dashboard/manage/teams/edit/${id}`);
  };

  return currentUser.isSuccess ? (
    <Stack spacing={2}>
      <Box sx={{ display: "flex" }}>
        <TextField
          sx={{ flexGrow: 1, pr: 2 }}
          placeholder="Filter teams"
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
          Add team
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

export default Teams;
