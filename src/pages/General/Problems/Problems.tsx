import { Box, Button, Stack, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../../helpers/security.helper";
import { Error, Loader, Table } from "../../../components";
import { TableColumn } from "../../../components/Table/Table";
import { filter } from "../../../helpers/table.helper";

const Problems = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const currentUser = useCurrentUser(true);

  if (currentUser.isLoading) {
    return <Loader />;
  }

  if (currentUser.isSuccess && !currentUser.data.admin) {
    return <Error message="You don't have access." />;
  }

  const cols: TableColumn[] = [{ id: "name", label: "Name", type: "string" }];

  const rows: any[] = [];

  const filteredRows = filter(rows, search);

  const onRowDelete = (id: number) => {
    console.log("Delete problem");
  };

  const onRowUpdate = (id: number) => {
    navigate(`/dashboard/general/problems/edit/${id}`);
  };

  return currentUser.isSuccess ? (
    <Stack spacing={2}>
      <Box sx={{ display: "flex" }}>
        <TextField
          sx={{ flexGrow: 1, pr: 2 }}
          placeholder="Filter problems"
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
          Add problem
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

export default Problems;
