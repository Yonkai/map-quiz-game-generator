import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function SimpleMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        RuneScape Maps
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Free to Play</MenuItem>
        <MenuItem onClick={handleClose}>Morytania</MenuItem>
      </Menu>
      <style jsx>{
          `	
          .MuiButtonBase-root{
             background:white;
          }	
          .MuiMenu-list{
              background:white;
          }`
      }
      </style>
    </div>
  );
}