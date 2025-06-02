import React from 'react';
import { Box, Badge, Divider, Menu, MenuItem, ListItemIcon, Typography } from '@mui/material';

export const Root = ({ children, ...props }) => (
  <Box
    sx={{
      backgroundColor: '#1C5087',
      fontSize: '16px',
      height: '56px',
      fontFamily: 'Poppins',
      display: 'flex',
      width: '100%'
    }}
    {...props}
  >
    {children}
  </Box>
);

export const ToolbarContainer = ({ children, ...props }) => (
  <Box
    sx={{
      maxWidth: 1440,
      margin: '0 auto',
      width: '100%'
    }}
    {...props}
  >
    {children}
  </Box>
);

export const StyledToolbar = ({ children, ...props }) => (
  <Box
    sx={{
      px: { xs: 2, sm: 4, md: 5 },
      height: '56px',
      backgroundColor: '#1C5087',
      color: '#fff',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontWeight: 500,
      fontSize: { xs: '12px', sm: '16px' }
    }}
    {...props}
  >
    {children}
  </Box>
);

export const FlexGrow = props => <Box sx={{ flexGrow: 1 }} {...props} />;

export const Section = ({ children, ...props }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: { xs: 1.5, sm: 2 }
    }}
    {...props}
  >
    {children}
  </Box>
);

export const DividerStyled = () => (
  <Divider
    sx={{
      width: '1px',
      height: { xs: '20px', sm: '24px' },
      backgroundColor: '#ddd'
    }}
  />
);

export const StyledLink = ({ children, onClick, ...props }) => (
  <Typography
    onClick={onClick}
    sx={{
      color: '#fff',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '9px',
      cursor: 'pointer'
    }}
    {...props}
  >
    {children}
  </Typography>
);

export const DateText = ({ children, ...props }) => (
  <Box
    component="p"
    sx={{
      color: '#fff',
      textAlign: 'center',
      alignSelf: 'center',
      margin: 0
    }}
    {...props}
  >
    {children}
  </Box>
);

export const StyledBadge = props => (
  <Badge
    sx={{
      '& .MuiBadge-badge': {
        height: '12px',
        fontSize: '10px',
        minWidth: '12px',
        backgroundColor: '#FF5733',
        color: '#FFFFFF',
        padding: '0px',
        borderRadius: '8px'
      }
    }}
    {...props}
  />
);

export const StyledMenu = ({ children, ...props }) => (
  <Menu
    sx={{
      '& .MuiPaper-root': {
        borderRadius: '2px',
        background: '#fff',
        color: '#1C5087',
        width: '200px !important',
        boxShadow: '0px 2px 4px 0px #00000040'
      }
    }}
    {...props}
  >
    {children}
  </Menu>
);

export const StyledMenuItem = ({ children, ...props }) => (
  <MenuItem
    sx={{
      fontWeight: 600,
      '&:focus': {
        backgroundColor: '#EEF7FF',
      }
    }}
    {...props}
  >
    {children}
  </MenuItem>
);

export const MenuItemWithSeparator = ({
  icon,
  text,
  onClick,
  showseparator = true
}) => (
  <>
    <StyledMenuItem
      onClick={event => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      {text}
    </StyledMenuItem>
    {showseparator && (
      <Divider
        sx={{
          border: 0,
          borderTop: '1px solid #ddd',
        }}
      />
    )}
  </>
);

export const TruncatedUserName = ({ maxWidth = '200px', userName }) => (
  <Box
    sx={{
      maxWidth: maxWidth,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }}
  >
    {userName}
  </Box>
);