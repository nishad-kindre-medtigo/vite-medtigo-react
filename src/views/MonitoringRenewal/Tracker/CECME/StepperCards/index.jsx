import React from 'react';
import { Box, Grid, Card, CardContent, Button, Step, StepLabel, Stepper } from '@mui/material';
import { useMyLearningContext } from '../context/MyLearningContext';
import { useOpenSnackbar } from '../hooks/useOpenSnackbar';
import { courses } from '../views/Acquisition/MyLearning/data';
import { stepperCardStyles } from './styles';
import { StepperSkeleton } from './StepperSkeleton';
import history from '../utils/history';

const CONNECT_CME_COURSES = [4526, 9985, 9238, 192797, 11159];
const STEPPER_TEXT = [{name: 'ACLS', cmeCredits: 4.25}, {name: 'BLS', cmeCredits: 3}, {name: 'PALS', cmeCredits: 4}, {name: 'NIHSS', cmeCredits: 4.25}, {name: 'OPIOID', cmeCredits: 3}]

const StepperCardContainer = ({ cmeStepperData, setSelectedCourseID, setIsOrderTypeFullAccess }) => {
  const classes = stepperCardStyles;

  return Object.keys(cmeStepperData).length > 0
    ? CONNECT_CME_COURSES.map(courseId => (
        <Grid item xs={12} sm={6} md={4} key={courseId}>
          <StepperCMECard
            courseId={courseId}
            classes={classes}
            stepperData={cmeStepperData[courseId]}
            setSelectedCourseID={setSelectedCourseID}
            setIsOrderTypeFullAccess={setIsOrderTypeFullAccess}
          />
        </Grid>
      ))
    : STEPPER_TEXT.map(course => (
        <Grid item xs={12} sm={6} md={4} key={course.name}>
          <StepperSkeleton classes={classes} courseName={course.name} cmeCredits={course.cmeCredits}/>
        </Grid>
      )) 
};

const StepperCMECard = ({ courseId, classes, stepperData, setSelectedCourseID, setIsOrderTypeFullAccess }) => {
  const openSnackbar = useOpenSnackbar();
  const queryParams = new URLSearchParams(window.location.search);
  const paramsCourseID = queryParams.get('course');
  const { courseName, currentStep, cmeCredits, buttonText, canClaimCME, order } = stepperData;
  const isSelectedCourse = courseId == paramsCourseID;
  const courseImageData = courses.find(item => item.id == courseId); // Store static data for course (e.g. images, title, id)
  const { handleButtonClick } = useMyLearningContext();
  const isOrderTypeFullAccess = order?.order_type == 'Full_Access';
  const coursePlan = order?.plan;

  // Redirect to CME Survey Form with hash & courseID as query params
  const handleClaimCME = () => {
    const hash = order?.hash || null;
    const hasCME = order?.hasCME || false;
    if (hasCME && hash) {
      history.push(`/login?hash=${hash}&cme=${courseId}`);
      return;
    } else {
      openSnackbar('Something went wrong! Please contact support', 'error');
    }
  };

  const handleClick = () => {
    if (buttonText === 'CLAIM') {
      handleClaimCME();
      return;
    }
    setSelectedCourseID(courseId);
    setIsOrderTypeFullAccess(isOrderTypeFullAccess);
    handleButtonClick(buttonText, coursePlan, courseImageData);
  };

  return (
    <Card
      sx={classes.certificateContainer}
      style={{
        borderColor: isSelectedCourse ? '#2872C1' : '#DFDFDF',
        boxShadow: isSelectedCourse
          ? '0px 8px 12px -2px #0000004f'
          : '0px 4px 6px -1px #efefef'
      }}
    >
      <CardContent sx={classes.cardContentDiv}>
        <Grid container spacing={1}>
          <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
            <img src={`/icons/certificates/cme_stepper_lock.svg`} alt="Unlock" width={45} height={45} />
            <Box sx={classes.cardContent}>
              <Box sx={classes.typography} title={courseName}>
                {courseName} - {cmeCredits} Credits
              </Box>
              <Box sx={classes.infoText}>
                To obtain your CME credits, follow the three-step process by
                clicking the button.
              </Box>
            </Box>
          </Grid>

          {/* Stepper Box */}
          <Grid item xs={12} justifyContent="center" style={{ padding: '4px' }}>
            <Stepper
              sx={classes.stepper}
              activeStep={currentStep - 1}
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
                  {canClaimCME ? 'Claim' : 'Buy'} CME/CE Credits
                </StepLabel>
              </Step>
            </Stepper>
          </Grid>

          {/* Action Button */}
          <Grid item xs={12}>
            <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" sx={classes.btn} onClick={handleClick}>
                {buttonText}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StepperCardContainer;
