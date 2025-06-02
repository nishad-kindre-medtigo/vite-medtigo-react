import React from 'react';
import { Box, Backdrop, Typography } from '@mui/material';
import { Loader } from '../../../ui/Progress';

export default function FormSubmitBackdrop({ open }) {
  return (
    <Backdrop
      open={open}
      style={{
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Loader />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            textAlign: 'center',
            color: '#fff'
          }}
        >
          Generating CME Certificate ...
        </Typography>
      </Box>
    </Backdrop>
  );
}
