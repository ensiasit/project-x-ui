import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { palette } = useTheme();
  const [isOpen, setIsOpen] = useState(true);

  const backgroundGrey = palette.mode === "light" ? 200 : 800;
  const current = item.subitems.length === 0 && pathname.includes(item.path);

  const itemStyle = {
    pl: 2 + 2 * level,
    borderLeft: "6px solid transparent",
    backgroundColor: current ? palette.grey[backgroundGrey] : "transparent",
    borderLeftColor: current ? palette.primary.main : "transparent",
  };

  return (
    <Box
      onClick={() => {
        if (item.path) {
          navigate(item.path);
        }
      }}
    >
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
