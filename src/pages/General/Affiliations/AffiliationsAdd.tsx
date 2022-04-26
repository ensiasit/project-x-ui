import { useNavigate } from "react-router-dom";
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
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { useQueryClient } from "react-query";
import ReactCountryFlag from "react-country-flag";
import { Error, FormContainer, Loader } from "../../../components";
import { useCreateAffiliation } from "../../../services/affiliation.service";
import { Country } from "../../../helpers/country.helper";
import { useCurrentUser } from "../../../helpers/security.helper";
import { useNotification } from "../../../helpers/notifications.helper";

const AffiliationsAdd = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { palette, typography } = useTheme();
  const { pushNotification } = useNotification();

  const [name, setName] = useState("");
  const [country, setCountry] = useState("MA");
  const [logo, setLogo] = useState<File | null>(null);

  const currentUser = useCurrentUser(true);
  const createAffiliation = useCreateAffiliation({
    onSuccess: () => {
      queryClient.invalidateQueries("getAffiliations");
      navigate("/dashboard/general/affiliations");
      pushNotification("Affiliation added with success", "success");
    },
    onError: () => {
      pushNotification("Could not add affiliation", "error");
    },
  });

  if (currentUser.isLoading) {
    return <Loader />;
  }

  if (currentUser.isSuccess && !currentUser.data.admin) {
    return <Error message="You don't have access." />;
  }

  const onAdd = () => {
    createAffiliation.mutate({
      id: 0,
      name,
      country,
      logo,
    });
  };

  return currentUser.isSuccess ? (
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
          size="small"
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
            loading={createAffiliation.isLoading}
            variant="contained"
            fullWidth
            onClick={onAdd}
          >
            Add
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

export default AffiliationsAdd;
