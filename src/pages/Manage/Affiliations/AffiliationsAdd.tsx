import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { nanoid } from "nanoid";
import ReactCountryFlag from "react-country-flag";
import { useGetCurrentUser } from "../../../services/security.service";
import { Alert, Loader } from "../../../components";
import { Dashboard } from "../../index";
import { useCreateAffiliation } from "../../../services/affiliation.service";
import { Country } from "../../../helpers/country.helper";

const AffiliationsAdd = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { palette, typography } = useTheme();

  const [name, setName] = useState("");
  const [country, setCountry] = useState("MA");
  const [logo, setLogo] = useState<File | null>(null);

  const currentUser = useGetCurrentUser();
  const createAffiliation = useCreateAffiliation({
    onSuccess: () => {
      queryClient.invalidateQueries("getAffiliations");
      navigate("/dashboard/manage/affiliations?success=1");
    },
  });

  useEffect(() => {
    if (currentUser.isError) {
      navigate("/signin");
    }
  }, [currentUser.status]);

  const onAdd = () => {
    createAffiliation.mutate({
      id: 0,
      name,
      country,
      logo,
    });
  };

  if (currentUser.isLoading) {
    return <Loader />;
  }

  return currentUser.isSuccess ? (
    <Dashboard>
      <Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
        <Grid container>
          <Grid item xs={1} md={2} lg={3} />
          <Grid item xs={10} md={8} lg={6} sx={{ alignItems: "center" }}>
            <Stack
              spacing={2}
              sx={{ backgroundColor: palette.background.paper, p: 4 }}
            >
              {createAffiliation.isError && (
                <Alert severity="error">
                  {createAffiliation.error.message}
                </Alert>
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  Country
                </Typography>
                <Select
                  fullWidth
                  size="small"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {Object.entries(Country).map(([key, value]) => (
                    <MenuItem key={nanoid()} value={key}>
                      <ReactCountryFlag
                        countryCode={key}
                        style={{ marginRight: "5px" }}
                      />{" "}
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: palette.text.secondary,
                    fontSize: typography.body2,
                    mb: 1,
                  }}
                >
                  Logo
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="file"
                  onChange={(e) => setLogo((e.target as any).files[0])}
                />
              </Box>
              <LoadingButton
                loading={createAffiliation.isLoading}
                variant="contained"
                fullWidth
                onClick={onAdd}
              >
                Add
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Dashboard>
  ) : null;
};

export default AffiliationsAdd;
