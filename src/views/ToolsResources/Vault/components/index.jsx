import React from 'react';
import { Box, IconButton, Skeleton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

export const PasswordCardBox = ({ children }) => {
  return (
    <Box
      sx={{
        height: '100%',
        border: '1px solid #C6BEBE',
        borderRadius: '2px',
        borderLeft: '4px solid #2872C1',
        boxShadow: '0px 3px 4px 0px #00000036',
        transition: 'box-shadow 0.3s ease-in-out', // Add transition for smooth effect
        '&:hover': {
          boxShadow: '0px 6px 10px 0px #00000060' // Darker and larger shadow on hover
        }
      }}
    >
      {children}
    </Box>
  );
};

export const TextIconBox = ({ children, sx }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{ px: 2, py: 1, ...sx }}
    >
      {children}
    </Box>
  );
};

export const TooltipIcon = ({ title, onClick, icon, color = '#2872C1' }) => {
    return (
      <Tooltip arrow title={title}>
        <IconButton size="small" onClick={onClick}>
          {React.cloneElement(icon, { style: { color } })}
        </IconButton>
      </Tooltip>
    );
  };

export const AndroidSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&::after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

export const PasswordCardSkeleton = () => {
  return (
    <Box
      sx={{
        border: '1px solid #E9F2FC',
        borderRadius: '2px',
        boxShadow: '0px 3px 4px 0px #00000010',
        overflow: 'hidden', // Ensure skeleton shapes remain within bounds
      }}
    >
      {/* Placeholder for TextIconBox */}
      <Box
        px={2}
        py={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Skeleton variant="text" width="30%" height={24}  sx={{ background: '#E9F2FC' }} />
        <Tooltip title="Loading">
          <IconButton size="small" disabled>
            <Skeleton variant="circular" width={24} height={24}  sx={{ background: '#E9F2FC' }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Main Content Placeholder */}
      <Box px={2} py={2}>
        <Skeleton variant="rectangular" width="100%" height={120}  sx={{ background: '#E9F2FC' }} />
        <Skeleton variant="text" width="70%" height={24} sx={{ mt: 2, background: '#E9F2FC' }} />
        <Skeleton variant="text" width="50%" height={24}  sx={{ background: '#E9F2FC' }} />
      </Box>
    </Box>
  );
};

export const Placeholder = ({children}) => {
  return (
    <Box
      sx={{
        fontSize: '16px',
        px: 2,
        backgroundColor: '#F8F8F8',
        height: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6A6A6A',
        borderRadius: '4px',
      }}
    >
      {children}
    </Box>
  );
};