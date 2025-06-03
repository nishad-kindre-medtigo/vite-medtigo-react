import React from 'react';
import { Grid, Typography } from '@mui/material';
import FindIcon from '@mui/icons-material/FindInPageRounded';

export const PlaceHolder = ({ text = 'No Jobs Found' }) => {
  return (
    <Grid
      size={12}
      sx={{
        height: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center' // Ensures text is aligned
      }}
    >
      <FindIcon
        style={{ color: '#e7e7e7', fontSize: '150px', marginBottom: '16px' }}
      />
      <Typography sx={{ fontWeight: 600, color: '#6A6A6A', fontSize: '20px' }}>
        {text}
      </Typography>
    </Grid>
  );
};
