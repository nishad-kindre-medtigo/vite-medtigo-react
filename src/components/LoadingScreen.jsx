import React from 'react';
import { Box } from '@mui/material';
import { GradientCircularProgress } from 'src/ui/Progress';

function LoadingScreen() {

  return (
    <Box sx={{ height: '80vh', textAlign: 'center', p: 3 }}>
      <GradientCircularProgress />
    </Box>
  );
}

export default LoadingScreen;
