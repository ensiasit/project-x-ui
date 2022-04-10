import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  ListItemButton,
  ListItemText,
  Collapse,
  useTheme,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import SidenavList from "./SidenavList";
import { ListItem } from "./Sidenav";

interface SidenavListItemProps {
  item: ListItem;
  level: number;
}

const SidenavListItem = ({ item, level }: SidenavListItemProps) => {
  const { pathname } = useLocation();
  const { palette } = useTheme();
  const [isOpen, setIsOpen] = useState(item.path === pathname);

  const itemStyle = {
    pl: 2 + 2 * level,
    borderLeft: "6px solid transparent",
    backgroundColor:
      item.path === pathname
        ? palette.grey[palette.mode === "light" ? 200 : 800]
        : "transparent  !important",
    borderLeftColor: item.path === pathname ? "blue" : "transparent",
  };

  return (
    <Box>
      <ListItemButton
        sx={{
          ...itemStyle,
          "&:hover": {
            ...itemStyle,
            opacity: palette.mode === "light" ? 0.6 : 0.8,
          },
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <ListItemText primary={item.label} />
        {item.subitems.length > 0 && (isOpen ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>
      {item.subitems.length > 0 && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <SidenavList items={item.subitems} level={level + 1} />
        </Collapse>
      )}
    </Box>
  );
};

export default SidenavListItem;
