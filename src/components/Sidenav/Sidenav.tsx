import { Box, Drawer, useTheme } from "@mui/material";
import SideNavList from "./SidenavList";

export interface ListItem {
  label: string;
  path: string;
  subitems: ListItem[];
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
            minWidth: 260,
            width: 260,
            height: "calc(100% - 64px)",
            marginTop: "64px",
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
