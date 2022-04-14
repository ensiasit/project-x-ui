import { AppBar, Toolbar, Button, Box, Divider, useTheme } from "@mui/material";
import { HEADER_HEIGHT, SIDENAV_WIDTH } from "../../helpers/theme.constans";

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
        backgroundColor: palette.background.default,
      }}
    >
      <Toolbar disableGutters>
        <Box sx={{ display: "flex", flexDirection: "row", flexGrow: 1 }}>
          <Button
            color="inherit"
            sx={{ mr: 2, fontSize: typography.h6, width: SIDENAV_WIDTH, m: 0 }}
          >
            {title}
          </Button>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ height: HEADER_HEIGHT, m: 0 }}
          />
          <Dropdown items={competitions} isProfile={false} />
        </Box>
        <Dropdown items={profile} isProfile />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
