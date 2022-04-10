import { List } from "@mui/material";
import { nanoid } from "nanoid";

import SidenavListItem from "./SidenavListItem";
import { ListItem } from "./Sidenav";

interface SidenavListProps {
  items: ListItem[];
  level: number;
}

const SideNavList = ({ items, level }: SidenavListProps) => {
  return (
    <List component="div" disablePadding>
      {items.map((item) => (
        <SidenavListItem item={item} level={level} key={nanoid()} />
      ))}
    </List>
  );
};

export default SideNavList;
