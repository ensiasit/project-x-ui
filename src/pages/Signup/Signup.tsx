import {
  Box,
  Button,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const { palette, typography } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contest, setContest] = useState("");

  const contests = [
    { label: "ITHOLIC CPC 2022", value: "itholic-cpc-2022" },
    { label: "ITHOLIC CPC 2023", value: "itholic-cpc-2023" },
  ];

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography sx={{ fontSize: typography.h6, textAlign: "center", mb: 4 }}>
        Project X
      </Typography>
      <Grid container>
        <Grid item xs={2} md={3} lg={4} />
        <Grid item xs={8} md={6} lg={4}>
          <Stack spacing={2}>
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
                Email
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                Password
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  color:
                    password === confirmPassword
                      ? palette.text.secondary
                      : palette.error.main,
                  fontSize: typography.body2,
                  mb: 1,
                }}
              >
                Confirm password
              </Typography>
              <TextField
                fullWidth
                type="password"
                size="small"
                value={confirmPassword}
                error={password !== confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                Contest
              </Typography>
              <TextField
                fullWidth
                select
                size="small"
                value={contest}
                onChange={(e) => setContest(e.target.value)}
              >
                {contests.map(({ label, value }) => (
                  <MenuItem key={nanoid()} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Grid container>
              <Grid item xs={6} sx={{ pr: 1 }}>
                <Button variant="contained" fullWidth>
                  Sign up
                </Button>
              </Grid>
              <Grid item xs={6} sx={{ pl: 1 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => navigate("/signin")}
                >
                  Sign in
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Signup;
