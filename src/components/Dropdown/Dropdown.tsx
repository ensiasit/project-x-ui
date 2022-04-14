import React, { useState } from "react";
import { Button, Menu, MenuItem, Divider, Box, useTheme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { nanoid } from "nanoid";

import { HEADER_HEIGHT } from "../../helpers/theme.constans";

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

  const menuTitleId = `menu-title-${nanoid()}`;
  const menuCollapseId = `menu-collapse-${nanoid()}`;

  return (
    <>
      <Button
        color="inherit"
        sx={{ ml: 2, minHeight: HEADER_HEIGHT }}
        id={menuTitleId}
        aria-controls={open ? menuCollapseId : undefined}
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
                  minWidth: 140,
                }
              : {
                  border: `1px solid ${palette.divider}`,
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
