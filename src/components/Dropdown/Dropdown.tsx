import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { HEADER_HEIGHT } from "../../helpers/theme.constans";

export interface DropdownItem {
  id: string;
  label: string;
  selected: boolean;
  onClick?: () => void;
}

interface DropdownProps {
  name: string;
  items: DropdownItem[];
  isProfile: boolean;
}

const Dropdown = ({ name, items, isProfile }: DropdownProps) => {
  const { palette } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const selectedItem = items.find(({ selected }) => selected) || {
    id: "",
    label: "Select a contest",
    selected: true,
  };
  const nonSelectedItems = items.filter(({ selected }) => !selected);

  const menuTitleId = `menu-title-${name}`;
  const menuCollapseId = `menu-collapse-${name}`;

  return (
    <>
      <Button
        color="inherit"
        sx={{
          ml: 2,
          minHeight: HEADER_HEIGHT,
          minWidth: "120px",
          justifyContent: "start",
        }}
        id={menuTitleId}
        aria-controls={open ? menuCollapseId : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Typography sx={{ flexGrow: 1, textAlign: "left" }}>
          {selectedItem?.label}
        </Typography>
        {nonSelectedItems.length > 0 &&
          (open ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
      </Button>
      {nonSelectedItems.length > 0 && (
        <Menu
          id={menuCollapseId}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: isProfile
              ? {
                  position: "fixed",
                  right: 0,
                  border: `1px solid ${palette.divider}`,
                  minWidth: 200,
                }
              : {
                  border: `1px solid ${palette.divider}`,
                  minWidth: 200,
                },
          }}
        >
          {nonSelectedItems.map(({ id, label, onClick }, index) => (
            <Box key={id}>
              {index > 0 && <Divider />}
              <MenuItem
                onClick={() => {
                  if (onClick) {
                    onClick();
                  }

                  handleClose();
                }}
              >
                {label}
              </MenuItem>
            </Box>
          ))}
        </Menu>
      )}
    </>
  );
};

export default Dropdown;
