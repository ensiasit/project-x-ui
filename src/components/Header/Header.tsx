import { AppBar, Toolbar, Button, Box, Divider } from "@mui/material";

import Dropdown from "../Dropdown/Dropdown";

const Header = () => {
  return (
    <AppBar position="static" color="transparent">
      <Toolbar>
        <Box sx={{ display: "flex", flexDirection: "row", flexGrow: 1 }}>
          <Button color="inherit" sx={{ mr: 2 }}>
            Project X
          </Button>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ borderColor: "inherit" }}
          />
          <Dropdown
            items={[
              { label: "ITHOLIC CPC 2022", path: "#", selected: true },
              { label: "ITHOLIC CPC 2021", path: "#", selected: false },
              { label: "ITHOLIC CPC 2023", path: "#", selected: false },
            ]}
          />
        </Box>
        <Dropdown
          items={[
            { label: "John Doe", path: "#", selected: true },
            { label: "Profile", path: "#", selected: false },
            { label: "Dark mode", path: "#", selected: false },
            { label: "Sign out", path: "#", selected: false },
          ]}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
