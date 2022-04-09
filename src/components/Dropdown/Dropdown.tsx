import React, { useState } from "react";
import { Button, Menu, MenuItem, Divider, Box, useTheme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { nanoid } from "nanoid";

export interface DropdownItem {
  label: string;
  path: string;
  selected: boolean;
  onClick?: () => void;
}

interface DropdownProps {
  items: DropdownItem[];
  isProfile: boolean;
}

const Dropdown = ({ items, isProfile }: DropdownProps) => {
  const { palette } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const selectedItem = items.find(({ selected }) => selected);
  const nonSelectedItems = items.filter(({ selected }) => !selected);

  return (
    <>
      <Button
        color="inherit"
        sx={{ ml: 2, minHeight: 64 }}
        id="competitions-list-dropdown"
        aria-controls={open ? "competitions-list" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {selectedItem?.label}
        {nonSelectedItems.length > 0 &&
          (open ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
      </Button>
      {nonSelectedItems.length > 0 && (
        <Menu
          id="competitions-list"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "competitions-list-dropdown",
          }}
          PaperProps={{
            style: isProfile
              ? {
                  position: "fixed",
                  right: 0,
                  border: `1px solid ${palette.divider}`,
                  borderTop: 0,
                  minWidth: 140,
                }
              : {
                  border: `1px solid ${palette.divider}`,
                  borderTop: 0,
                  minWidth: 200,
                },
          }}
        >
          {nonSelectedItems.map(({ label, onClick }, index) => (
            <Box key={nanoid()}>
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
