import { Box, Drawer, useTheme } from "@mui/material";
import { HEADER_HEIGHT, SIDENAV_WIDTH } from "../../helpers/theme.constans";
import SideNavList from "./SidenavList";

export interface ListItem {
  id: string;
  label: string;
  path: string;
  subitems: ListItem[];
  enabled: boolean;
  isActive: (path: string) => boolean;
}

interface SidenavProps {
  items: ListItem[];
}

const Sidenav = ({ items }: SidenavProps) => {
  const { palette } = useTheme();

  return (
    <Box>
      <Drawer
        variant="permanent"
        open
        sx={{
          "& .MuiDrawer-paper": {
            minWidth: SIDENAV_WIDTH,
            width: SIDENAV_WIDTH,
            height: `calc(100% - ${HEADER_HEIGHT})`,
            marginTop: HEADER_HEIGHT,
            borderTop: `1px solid ${palette.divider}`,
          },
        }}
      >
        <div>
          <SideNavList items={items} level={0} />
        </div>
      </Drawer>
    </Box>
  );
};

export default Sidenav;
