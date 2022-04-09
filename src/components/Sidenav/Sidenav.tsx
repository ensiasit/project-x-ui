import { useLocation } from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
} from "@mui/material";
import { nanoid } from "nanoid";
import { useState } from "react";

interface ListItem {
  label: string;
  path: string;
  subitems: ListItem[];
}

interface SidenavProps {
  items: ListItem[];
}

const Sidenav = ({ items }: SidenavProps) => {
  const { pathname } = useLocation();
  const { palette } = useTheme();
  const initialOpenState = items.map(
    ({ path, subitems }) =>
      path === pathname || !!subitems.find(({ path }) => path === pathname),
  );
  const [open, setOpen] = useState(initialOpenState);

  const getItemStyle = (path: string, level: number) => {
    return {
      pl: 2 + 2 * level,
      borderLeft: "6px solid transparent",
      backgroundColor:
        path === pathname
          ? palette.grey[palette.mode === "light" ? 200 : 800]
          : "transparent  !important",
      borderLeftColor: path === pathname ? "blue" : "transparent",
    };
  };

  const renderItems = (items: ListItem[], level: number) => {
    return (
      <List component="div" disablePadding>
        {items.map((item, index) =>
          renderItem(
            item,
            open[index],
            () => {
              setOpen([
                ...open.slice(0, index),
                !open[index],
                ...open.slice(index + 1),
              ]);
            },
            level,
          ),
        )}
      </List>
    );
  };

  const renderItem = (
    { label, path, subitems }: ListItem,
    isOpen: boolean,
    onClick: () => void,
    level: number,
  ) => {
    return (
      <Box key={nanoid()}>
        <ListItemButton
          onClick={onClick}
          sx={{
            ...getItemStyle(path, level),
            "&:hover": {
              ...getItemStyle(path, level),
              opacity: palette.mode === "light" ? 0.6 : 0.8,
            },
          }}
        >
          <ListItemText primary={label} />
          {subitems.length > 0 && (isOpen ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
        {subitems.length > 0 && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            {renderItems(subitems, level + 1)}
          </Collapse>
        )}
      </Box>
    );
  };

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
          <List>{renderItems(items, 0)}</List>
        </div>
      </Drawer>
    </Box>
  );
};

export default Sidenav;
