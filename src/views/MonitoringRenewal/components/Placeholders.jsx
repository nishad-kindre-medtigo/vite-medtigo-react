import React from 'react';
import { Box } from '@mui/material';

export const PlaceHolder = ({ text = "No Certificates available. Please upload to view." }) => {
  return (
    <Box
      style={{
        fontSize: '20px',
        fontWeight: 600,
        mx: 2,
        px: 2,
        backgroundColor: '#F8F8F8',
        height: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6A6A6A'
      }}
    >
      {text}
    </Box>
  );
};
