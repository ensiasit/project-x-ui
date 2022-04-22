import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Alert, Error, Loader, Table } from "../../../components";
import { TableColumn } from "../../../components/Table/Table";
import { filter } from "../../../helpers/table.helper";
import {
  useDeleteAffiliation,
  useGetAffiliations,
} from "../../../services/affiliation.service";
import { useCurrentUser } from "../../../helpers/security.helper";

const Affiliations = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const currentUser = useCurrentUser(true);
  const affiliations = useGetAffiliations({
    enabled: currentUser.isSuccess,
  });
  const deleteAffiliation = useDeleteAffiliation({
    onSuccess: () => {
      queryClient.invalidateQueries("getAffiliations");
    },
  });

  if (currentUser.isLoading || deleteAffiliation.isLoading) {
    return <Loader />;
  }

  if (affiliations.isError) {
    return <Error message="Could not fetch contests" />;
  }

  if (currentUser.isSuccess && !currentUser.data.admin) {
    return <Error message="You don't have access." />;
  }

  const cols: TableColumn[] = [
    { id: "name", label: "Name", type: "string" },
    { id: "country", label: "Country", type: "country" },
    { id: "logo", label: "Logo", type: "image" },
  ];

  const rows = affiliations.isSuccess
    ? affiliations.data.map((affiliation) => {
        return {
          ...affiliation,
          canEdit: currentUser.isSuccess ? currentUser.data.admin : false,
          canDelete: currentUser.isSuccess ? currentUser.data.admin : false,
        };
      })
    : [];

  const filteredRows = filter(rows, search);

  const onRowDelete = (id: number) => {
    deleteAffiliation.mutate(id);
  };

  const onRowUpdate = (id: number) => {
    navigate(`/dashboard/manage/affiliations/edit/${id}`);
  };

  return currentUser.isSuccess && affiliations.isSuccess ? (
    <Stack spacing={2}>
      {deleteAffiliation.isError && (
        <Alert severity="error">Could not delete contests.</Alert>
      )}
      {currentUser.data.admin && (
        <Box sx={{ display: "flex" }}>
          <TextField
            sx={{ flexGrow: 1, pr: 2 }}
            placeholder="Filter affiliations"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => navigate("/dashboard/manage/affiliations/add")}
          >
            <Add fontSize="small" sx={{ mr: 1 }} />
            Add affiliation
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
  ) : null;
};

export default Affiliations;
