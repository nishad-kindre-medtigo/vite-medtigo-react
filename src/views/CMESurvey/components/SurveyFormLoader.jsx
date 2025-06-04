import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { GradientCircularProgress } from 'src/ui/Progress';
import Page from 'src/components/Page';

function SurveyFormLoader() {
  return (
    <Page title="Certificates">
      <Container maxWidth={false} sx={{ height: '60vh' }}>
        <Box m={2} sx={{ borderRadius: '10px', textAlign: 'center' }}>
          <GradientCircularProgress />
          <Typography pt={2} sx={{ fontSize: '24px', fontWeight: 600, color: '#4B3A5A' }}>
            Please wait while we validate your access
          </Typography>
        </Box>
      </Container>
    </Page>
  );
}

export default SurveyFormLoader;
