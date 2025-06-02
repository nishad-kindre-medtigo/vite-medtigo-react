import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useBlockNavigation } from '../../../hooks/useBlockNavigation';

// Styled Menu Component
export const StyledMenu = styled(Menu)({
  '& .MuiPaper-root': {
    borderRadius: '2px',
    background: '#fff',
    color: '#1C5087',
    width: '150px !important',
    boxShadow: '0px 2px 4px 0px #00000040',
  },
});

// Styled MenuItem Component
export const StyledMenuItem = styled(MenuItem)({
  '&:focus': {
    backgroundColor: '#EEF7FF',
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: "#fff",
    },
  },
  margin: '0px !important',
  paddingRight: '20px',
  fontWeight: 600,
});

export default function HeaderMenu({ tabs, anchorEl, handleClose, setOpenBackdrop }) {
  const { blockNavigationWhenActiveQuiz } = useBlockNavigation();

  const handleMenuItemClick = (tab, event) => {
    const confirm = blockNavigationWhenActiveQuiz();
    if (confirm) {
      event.preventDefault();
      setOpenBackdrop(true);
      window.location.href = tab.link;
      handleClose();
    }
  };

  return (
    <StyledMenu
      id="customized-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {tabs.map((tab, index) => (
        <StyledMenuItem
          key={index}
          onClick={(event) => handleMenuItemClick(tab, event)}
        >
          {tab.value.toUpperCase()}
        </StyledMenuItem>
      ))}
    </StyledMenu>
  );
}
