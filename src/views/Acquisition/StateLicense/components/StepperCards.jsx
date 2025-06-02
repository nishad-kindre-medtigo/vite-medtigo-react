import React from 'react';
import { Grid, Typography, Box, Step, StepLabel } from '@mui/material';
import { LICENSE_STEPS, getLicenseActiveStep } from '../utils';
import { StepperCard, StyledStepper, StepperSkeleton, LicenseTaskCount, StyledLink } from '../ui';
// import Label from '../components/Label';
import { PlaceHolder } from '../../../MonitoringRenewal/components/Placeholders';
import moment from'moment';

const LicenseStepperCardContainer = props => {
  const { licenseLoading, licenseStepperData: data, setLicenseID, setLicenseName } = props;

  return licenseLoading ? (
    [...Array(3)].map((_, index) => (
      <Grid item xs={12} sm={6} lg={4} key={index}>
        <StepperSkeleton />
      </Grid>
    ))
  ) : (
    <>
      {data.length === 0 && (
        <Grid item xs={12}>
          <PlaceHolder text="No Licenses in Acquisiton Stage Available" />
        </Grid>
      )}
      {data && data.map((license, index) => {
        return (
          <Grid item xs={12} sm={6} lg={4} key={index}>
            <LicenseStepperCard
              licenseData={license}
              setLicenseID={setLicenseID}
              setLicenseName={setLicenseName}
            />
          </Grid>
        );
      })}
    </>
  );
};

const LicenseStepperCard = ({ licenseData, setLicenseID, setLicenseName }) => {
  const { licenseID, licenseName, state, state_abbr, validity, anticipatedDaysCount, daysText, anticipatedDate, overdueCount, timelyCount } = licenseData;

  const activeStep = getLicenseActiveStep(validity);
  const completeLicenseName =
    licenseName +
    ' - ' +
    (state === 'Onboarding' || state_abbr === 'OB' ? 'Onboarding' : state_abbr);

  // Handle View Tasks Button Logic
  const handleViewTask = () => {
    setLicenseID(licenseID);
    setLicenseName(completeLicenseName);
  };

  return (
    <StepperCard>
      <Typography style={{ fontSize: '16px', fontWeight: 600, pb: 0 }}>
        {completeLicenseName}
      </Typography>
      <Typography style={{ fontSize: '15px', fontWeight: 600 }}>
        Anticipated Date - {moment(anticipatedDate, 'MM-DD-YYYY').format('MMM DD, YYYY')}
      </Typography>

      <StyledStepper activeStep={activeStep}>
        {LICENSE_STEPS.map((step, index) => (
          <Step key={index}>
            <StepLabel>
              {index < activeStep
                ? step.completed // Steps before the current step are completed
                : index === activeStep
                ? step.active // The current step is active
                : step.inactive // Steps after the current step are inactive
              }
            </StepLabel>
          </Step>
        ))}
      </StyledStepper>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <LicenseTaskCount overdueTasksCount={overdueCount} timelyTasksCount={timelyCount} />
        <StyledLink onClick={handleViewTask}>
          VIEW TASKS
        </StyledLink>
      </Box>
    </StepperCard>
  );
};

export default LicenseStepperCardContainer;
