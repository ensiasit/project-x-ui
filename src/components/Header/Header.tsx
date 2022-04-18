import { AppBar, Box, Button, Divider, Toolbar, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { HEADER_HEIGHT, SIDENAV_WIDTH } from "../../helpers/theme.constans";

import Dropdown, { DropdownItem } from "../Dropdown/Dropdown";

export interface HeaderProps {
  title: string;
  competitions: DropdownItem[];
  profile: DropdownItem[];
}

const Header = ({ title, competitions, profile }: HeaderProps) => {
  const navigate = useNavigate();
  const { palette, typography } = useTheme();

  return (
    <AppBar
      position="sticky"
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
            sx={{
              mr: 2,
              fontSize: typography.h6,
              width: SIDENAV_WIDTH,
              m: 0,
              height: HEADER_HEIGHT,
            }}
            onClick={() => navigate("/dashboard")}
          >
            {title}
          </Button>
          {competitions.length > 0 && (
            <>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{ height: HEADER_HEIGHT, m: 0 }}
              />
              <Dropdown items={competitions} isProfile={false} />
            </>
          )}
        </Box>
        {profile.length > 0 && <Dropdown items={profile} isProfile />}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
