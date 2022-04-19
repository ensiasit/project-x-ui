import { useQueryClient } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Dashboard } from "../../index";
import { useGetCurrentUser } from "../../../services/security.service";
import { Alert, Loader, Table } from "../../../components";
import { TableColumn } from "../../../components/Table/Table";
import { filter } from "../../../helpers/table.helper";
import {
  useDeleteAffiliation,
  useGetAffiliations,
} from "../../../services/affiliation.service";

const Affiliations = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");

  const currentUser = useGetCurrentUser();
  const getAffiliations = useGetAffiliations({
    enabled: currentUser.isSuccess,
  });
  const deleteAffiliation = useDeleteAffiliation({
    onSuccess: () => {
      queryClient.invalidateQueries("getAffiliations");
    },
  });

  useEffect(() => {
    if (currentUser.isError) {
      navigate("/signin");
    }
  }, [currentUser.status, deleteAffiliation.status]);

  if (currentUser.isLoading || deleteAffiliation.isLoading) {
    return <Loader />;
  }

  if (getAffiliations.isError) {
    return <Alert severity="error">Could not fetch contests</Alert>;
  }

  const cols: TableColumn[] = [
    { id: "name", label: "Name", type: "string" },
    { id: "country", label: "Country", type: "country" },
    { id: "logo", label: "Logo", type: "image" },
  ];

  const rows = getAffiliations.isSuccess
    ? getAffiliations.data.map((affiliation) => {
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

  return currentUser.isSuccess && getAffiliations.isSuccess ? (
    <Dashboard>
      <Stack spacing={2}>
        {deleteAffiliation.isSuccess && (
          <Alert severity="success">Competition deleted with success.</Alert>
        )}
        {deleteAffiliation.isError && (
          <Alert severity="error">Could not delete competition.</Alert>
        )}
        {searchParams.get("success") && (
          <Alert severity="success">Affiliation created with success.</Alert>
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
    </Dashboard>
  ) : null;
};

export default Affiliations;
