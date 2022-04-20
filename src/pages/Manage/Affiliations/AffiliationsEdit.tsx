import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
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
import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { LoadingButton } from "@mui/lab";
import { useGetCurrentUser } from "../../../services/security.service";
import {
  useGetAffiliation,
  useUpdateAffiliation,
} from "../../../services/affiliation.service";
import { Country } from "../../../helpers/country.helper";
import { Alert, Loader } from "../../../components";
import { Dashboard } from "../../index";

const AffiliationsEdit = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { palette, typography } = useTheme();
  const { affiliationId } = useParams();

  const [name, setName] = useState("");
  const [country, setCountry] = useState("MA");
  const [logo, setLogo] = useState<File | null>(null);

  const currentUser = useGetCurrentUser();
  const getAffiliation = useGetAffiliation(Number(affiliationId), {
    enabled: currentUser.isSuccess,
  });
  const updateAffiliation = useUpdateAffiliation({
    onSuccess: () => {
      queryClient.invalidateQueries("getAffiliations");
      queryClient.invalidateQueries(["getAffiliation", Number(affiliationId)]);
      navigate("/dashboard/manage/affiliations?success=1");
    },
  });

  useEffect(() => {
    if (currentUser.isError) {
      navigate("/signin");
    }

    if (getAffiliation.isSuccess) {
      setName(getAffiliation.data.name);
      setCountry(getAffiliation.data.country);
    }
  }, [currentUser.status, getAffiliation.status]);

  const onUpdate = () => {
    updateAffiliation.mutate({
      id: Number(affiliationId),
      name,
      country,
      logo,
    });
  };

  if (currentUser.isLoading || getAffiliation.isLoading) {
    return <Loader />;
  }

  if (getAffiliation.isError) {
    return <Alert severity="error">Could not fetch affiliation</Alert>;
  }

  return currentUser.isSuccess && getAffiliation.isSuccess ? (
    <Dashboard>
      <Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
        <Grid container>
          <Grid item xs={1} md={2} lg={3} />
          <Grid item xs={10} md={8} lg={6} sx={{ alignItems: "center" }}>
            <Stack
              spacing={2}
              sx={{ backgroundColor: palette.background.paper, p: 4 }}
            >
              {updateAffiliation.isError && (
                <Alert severity="error">
                  {updateAffiliation.error.message}
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
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {Object.entries(Country).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
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
                {getAffiliation.data.logo && (
                  <img
                    src={`data:image/jpeg;base64,${getAffiliation.data.logo}`}
                    alt="logo"
                    style={{ maxWidth: "100%" }}
                  />
                )}
                <TextField
                  fullWidth
                  size="small"
                  type="file"
                  onChange={(e) => setLogo((e.target as any).files[0])}
                />
              </Box>
              <LoadingButton
                loading={updateAffiliation.isLoading}
                variant="contained"
                fullWidth
                onClick={onUpdate}
              >
                Update
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Dashboard>
  ) : null;
};

export default AffiliationsEdit;
