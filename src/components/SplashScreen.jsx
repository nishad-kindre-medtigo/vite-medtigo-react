import React from 'react';
import Logo from 'src/components/Logo';
import { Box } from '@mui/material';
import { GradientCircularProgress } from 'src/ui/Progress';

function SplashScreen() {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        zIndex: 2000,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',

      }}
    >
      <Logo style={{ width: 50 }} />
      <GradientCircularProgress />
    </Box>
  );
}

export default SplashScreen;
