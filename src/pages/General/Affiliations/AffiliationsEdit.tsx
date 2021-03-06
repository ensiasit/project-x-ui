import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { LoadingButton } from "@mui/lab";
import {
  useGetAffiliation,
  useUpdateAffiliation,
} from "../../../services/affiliation.service";
import { Country } from "../../../helpers/country.helper";
import { Error, FormContainer, Loader } from "../../../components";
import { useCurrentUser } from "../../../helpers/security.helper";
import { useNotification } from "../../../helpers/notifications.helper";

const AffiliationsEdit = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { palette, typography } = useTheme();
  const { affiliationId } = useParams();
  const { pushNotification } = useNotification();

  const [name, setName] = useState("");
  const [country, setCountry] = useState("MA");
  const [logo, setLogo] = useState<File | null>(null);

  const currentUser = useCurrentUser(true);
  const affiliation = useGetAffiliation(Number(affiliationId), {
    enabled: currentUser.isSuccess,
  });
  const updateAffiliation = useUpdateAffiliation({
    onSuccess: () => {
      queryClient.invalidateQueries("getAffiliations");
      queryClient.invalidateQueries(["getAffiliation", Number(affiliationId)]);
      navigate("/dashboard/general/affiliations");
      pushNotification("Affiliation updated with success", "success");
    },
    onError: () => {
      pushNotification("Could not update affiliation", "error");
    },
  });

  useEffect(() => {
    if (affiliation.isSuccess) {
      setName(affiliation.data.name);
      setCountry(affiliation.data.country);
    }
  }, [affiliation.status]);

  if (currentUser.isLoading || affiliation.isLoading) {
    return <Loader />;
  }

  if (affiliation.isError) {
    return <Error message="Could not fetch affiliation" />;
  }

  if (currentUser.isSuccess && !currentUser.data.admin) {
    return <Error message="You don't have access." />;
  }

  const onUpdate = () => {
    updateAffiliation.mutate({
      id: Number(affiliationId),
      name,
      country,
      logo,
    });
  };

  return currentUser.isSuccess && affiliation.isSuccess ? (
    <FormContainer>
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
        {affiliation.data.logo && (
          <img
            src={`data:image/jpeg;base64,${affiliation.data.logo}`}
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
      <Grid container>
        <Grid xs={6} item sx={{ pr: 1 }}>
          <LoadingButton
            loading={updateAffiliation.isLoading}
            variant="contained"
            fullWidth
            onClick={onUpdate}
          >
            Update
          </LoadingButton>
        </Grid>
        <Grid xs={6} item sx={{ pl: 1 }}>
          <Button
            color="secondary"
            variant="contained"
            fullWidth
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </FormContainer>
  ) : null;
};

export default AffiliationsEdit;
