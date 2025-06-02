import React from 'react';
import { Button, Container, Grid, Typography, Box } from '@mui/material';
import Page from '../../../components/Page';

function CourseNotCompleted({ courseID }) {
  return (
    <Page title="Certificates">
      <Container maxWidth={false} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          maxWidth="md"
          sx={{
            m: 2,
            p: 2,
            background: '#FFF4E5',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <Grid container spacing={1} justifyContent="center" alignItems="center">
            <Grid item xs={12}>
              <img src="/icons/myLearning/warning_icon.svg" alt="Warning Icon" />
            </Grid>
            <Grid item xs={12}>
              <Typography
                sx={{
                  fontSize: { xs: '18px', sm: '24px' },
                  fontWeight: 600,
                  color: '#D84315',
                }}
              >
                Warning: Course Not Completed
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                sx={{
                  fontSize: { xs: '14px', sm: '16px' },
                  color: '#5D4037',
                  mb: 2,
                }}
              >
                Please complete your course to access the certificate.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                color="warning"
                variant="contained"
                disableElevation
                onClick={() => window.open(`/learning/course/${courseID}`, '_self').focus()}
              >
                Complete Course
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}

export default CourseNotCompleted;
