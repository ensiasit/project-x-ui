import { AppBar, Toolbar, Button, Box, Divider, useTheme } from "@mui/material";

import Dropdown, { DropdownItem } from "../Dropdown/Dropdown";

interface HeaderProps {
  title: string;
  competitions: DropdownItem[];
  profile: DropdownItem[];
}

const Header = ({ title, competitions, profile }: HeaderProps) => {
  const { palette, typography } = useTheme();

  return (
    <AppBar
      position="static"
      color="default"
      sx={{
        border: 0,
        borderBottom: `1px solid ${palette.divider}`,
        backgroundImage: "none",
      }}
    >
      <Toolbar sx={{ padding: "0 !important" }}>
        <Box sx={{ display: "flex", flexDirection: "row", flexGrow: 1 }}>
          <Button
            color="inherit"
            sx={{ mr: 2, fontSize: typography.h6, width: 260, m: 0 }}
          >
            {title}
          </Button>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ height: 64, m: 0 }}
          />
          <Dropdown items={competitions} isProfile={false} />
        </Box>
        <Dropdown items={profile} isProfile />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
