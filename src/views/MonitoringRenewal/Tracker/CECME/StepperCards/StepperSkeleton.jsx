import React from 'react';
import { Box, Grid, Card, CardContent, Button, Step, StepLabel, Stepper } from '@mui/material';

export const StepperSkeleton = ({ classes, courseName, cmeCredits }) => {

  return (
    <Card sx={classes.certificateContainer}>
      <CardContent sx={classes.cardContentDiv}>
        <Grid container spacing={1}>
          <Grid size={12} style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
            <img src={`/icons/certificates/cme_stepper_lock.svg`} alt="Unlock" width={45} height={45} />
            <Box sx={classes.cardContent}>
              <Box sx={classes.typography}>
                {courseName} - {cmeCredits} Credits
              </Box>
              <Box sx={classes.infoText}>
                To obtain your CME credits, follow the three-step process
                by clicking the button.
              </Box>
            </Box>
          </Grid>

          {/* Stepper Box */}
          <Grid size={12} justifyContent="center" style={{ padding: '4px' }}>
            <Stepper
              sx={classes.stepper}
              activeStep={-1}
              alternativeLabel
              style={{
                color: '#000'
              }}
            >
              <Step key={1}>
                <StepLabel>Buy Course</StepLabel>
              </Step>
              <Step key={2}>
                <StepLabel>Complete Course</StepLabel>
              </Step>
              <Step key={3}>
                <StepLabel>
                  Get CME/CE Credits
                </StepLabel>
              </Step>
            </Stepper>
          </Grid>

          {/* Action Button */}
          <Grid size={12}>
            <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" sx={classes.btn}>
                Loading...
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
