import React from 'react';
import { Button, Tabs, Tab, Box } from '@mui/material';

export const TabsContainer = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        marginBlock: '20px'
      }}
    >
      {children}
    </Box>
  );
};

export const StyledTabs = ({ children, ...props }) => {
  return (
    <Tabs
      {...props}
      sx={{
        minHeight: '33px',
        boxShadow: '0px 2px 8px 0px #0000001C'
      }}
    >
      {children}
    </Tabs>
  );
};

export const StyledTab = ({ label, ...props }) => {
  return (
    <Tab
      {...props}
      label={label}
      sx={{
        width: '124px',
        paddingBlock: 0,
        minHeight: '33px',
        fontSize: '16px',
        fontWeight: 600,
        backgroundColor: '#fff',
        border: '1px solid #2872C1',
        color: '#2872C1',
        '&.Mui-selected': {
          backgroundColor: '#2872C1',
          color: '#fff !important'
        },
        '&:first-of-type': {
          borderTopLeftRadius: '2px',
          borderBottomLeftRadius: '2px'
        },
        '&:last-of-type': {
          borderTopRightRadius: '2px',
          borderBottomRightRadius: '2px'
        }
      }}
    />
  );
};

export const Placeholder = ({ children }) => {
  return (
    <Box
      sx={{
        fontSize: '16px',
        marginTop: '16px',
        backgroundColor: '#F8F8F8',
        height: '35vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black'
      }}
    >
      {children}
    </Box>
  );
};

export const BaseButton = ({ children, disabledStatus, sx = {}, ...props }) => {
  return (
    <Button
      {...props}
      sx={{
        minWidth: '70px',
        padding: '4px 10px',
        borderRadius: '2px',
        fontSize: '12px',
        fontWeight: 600,
        opacity: disabledStatus ? 0.4 : 1,
        pointerEvents: disabledStatus ? 'none' : 'auto',
        ...sx, // Merge additional styles passed via props
      }}
    >
      {children}
    </Button>
  );
};

export const CancelButton = ({ children, ...props }) => {
  return (
    <BaseButton
      {...props}
      sx={{
        background: '#C52525',
        color: '#fff',
        '&:hover': {
          background: '#db3d3d',
        },
      }}
    >
      {children}
    </BaseButton>
  );
};

export const AcceptButton = ({ children, ...props }) => {
  return (
    <BaseButton
      {...props}
      sx={{
        background: '#5EAB43',
        border: '1px solid #5EAB43',
        color: '#fff',
        '&:hover': {
          background: '#70bd55',
          border: '1px solid #70bd55',
        },
      }}
    >
      {children}
    </BaseButton>
  );
};

export const RejectButton = ({ children, ...props }) => {
  return (
    <BaseButton
      {...props}
      sx={{
        border: '1px solid #C52525',
        color: '#C52525',
        '&:hover': {
          border: '1px solid #db3d3d'
        }
      }}
    >
      {children}
    </BaseButton>
  );
};
