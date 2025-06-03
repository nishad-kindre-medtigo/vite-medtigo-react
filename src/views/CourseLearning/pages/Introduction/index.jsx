import React from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { courseDetails } from '../../../../appConstants';

// PAGE DISPLAYED WHEN ACCESSING COURSE CONTENT FOR FIRST TIME AFTER COURSE PURCHASE
const Introduction = ({ setIsFirstTime, courseID }) => {
  const navigate = useNavigate();

  const courseData = courseDetails.find((course) => course.id == courseID);

  const hasOnlyCME = [192797, 11159].includes(courseID);
  const hasCME = [4526, 9985, 9238, 192797, 11159].includes(courseID);
  const hasProviderCard = [4526, 9985, 9238, 151904, 79132].includes(courseID);

  const handleBackClick = () => {
    const backLink = localStorage.getItem('learning-path');
    if (backLink) {
      navigate(backLink);
    } else {
      navigate('/my-learning');
    }
  };

  const handleStartNow = () => {
    setIsFirstTime(false);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          fontSize: { xs: '24px', sm: '28px' },
          fontWeight: 600,
          color: '#2C365E',
          my: 2
        }}
      >
        Meet Your {hasOnlyCME ? 'CME' : courseData?.short_name}{' '}
        Requirement Easily
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          width: '100%',
          margin: 0,
          padding: '0px 6%',
          mb: { xs: '15%', sm: 0 }
        }}
        justifyContent='center'
      >
        {hasProviderCard && (
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <RegularCard
              imageName="certificate.svg"
              title="Earn a Certificate"
              description="You'll receive a certificate card when you successfully complete a quiz"
            />
          </Grid>
        )}
        {hasCME && (
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <RegularCard
              imageName="CME.svg"
              title={`${courseData.cme_credits} CME Credits`}
              description={`Earn ${courseData.cme_credits} AMA PRA category 1 CME/CE credits of course completion`}
            />
          </Grid>
        )}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <RegularCard
            imageName="doctor.svg"
            title="Course Audit"
            description="The course is audited by medical professionals"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <RegularCard
            imageName="rising.svg"
            title="Progress Tracking"
            description="You can easily see your progress in the course at all times"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <RegularCard
            imageName="quiz.svg"
            title="Quiz Included"
            description="Attempt a quiz at the end to assess your learning"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <RegularCard
            imageName="hospital.svg"
            title="Nationwide Acceptance"
            description="Accepted at majority of hospitals in the US"
          />
        </Grid>
      </Grid>

      <ActionButtonGroup
        handleBackClick={handleBackClick}
        handleStartNow={handleStartNow}
      />
    </Box>
  );
};

const RegularCard = ({ imageName, title, description }) => {
  return (
    <React.Fragment>
      <Grid container justifyContent="center">
        <img
          src={`/icons/cmeSurvey/${imageName}`}
          alt={title}
          style={{ height: '48px' }}
        />
      </Grid>
      <div
        style={{
          textAlign: 'center',
          marginTop: '8px',
          color: '#2C375E',
          fontWeight: 500
        }}
      >
        {title}
      </div>
      <div
        style={{
          textAlign: 'center',
          marginTop: '10px',
          fontSize: '12px',
          color: '#545454',
          padding: '0 20px'
        }}
      >
        {description}
      </div>
    </React.Fragment>
  );
};

const ActionButtonGroup = ({ handleBackClick, handleStartNow }) => (
  <Box
    sx={{
      position: { xs: 'fixed', sm: 'relative' },
      bottom: { xs: 0 },
      left: { xs: 0 },
      backgroundColor: { xs: '#fff' },
      width: '100%',
      padding: '16px 0',
      display: 'flex',
      justifyContent: 'center',
      mt: 2,
      gap: 2,
      zIndex: 1000
    }}
  >
    <Button size="large" variant="outlined" onClick={handleBackClick}>
      GO BACK
    </Button>
    <Button size="large" variant="contained" onClick={handleStartNow}>
      START NOW
    </Button>
  </Box>
);

ActionButtonGroup.propTypes = {
  handleBackClick: PropTypes.func.isRequired,
  handleStartNow: PropTypes.func.isRequired
};

Introduction.propTypes = {
  setIsFirstTime: PropTypes.func.isRequired,
  courseID: PropTypes.number.isRequired
};

export default Introduction;
