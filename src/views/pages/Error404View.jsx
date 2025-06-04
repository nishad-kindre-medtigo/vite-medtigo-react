import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Page from 'src/components/Page';

function Error404View() {
  return (
    <Page title="404: Not found">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          p: 2,
          gap: 4,
          textAlign: 'center',
          background: '#F8F9FA'
        }}
      >
        <Typography sx={{ fontSize: '32px', fontWeight: 'bold' }}>
          {"404: The page you are looking for isn't here"}
        </Typography>
        <Typography sx={{ fontSize: '20px', color: '#333' }}>
          You either tried some shady route or came here by mistake. Try using
          the navigation.
        </Typography>
        <Box>
          <img
            alt="Under development"
            src="/images/404.svg"
            style={{ maxWidth: '100%', width: 560, height: 'auto' }}
          />
        </Box>
        <Box>
          <Button
            size="large"
            disableElevation
            component={RouterLink}
            to="/dashboard"
            variant="contained"
            startIcon={<ArrowBackIcon />}
            sx={{ borderRadius: 2 }}
          >
            Go back to home
          </Button>
        </Box>
      </Box>
    </Page>
  );
}

export default Error404View;
