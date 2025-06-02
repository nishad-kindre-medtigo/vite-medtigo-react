import React from 'react';
import { Box, Typography, Grid, Stepper, Step, StepLabel, LinearProgress } from '@mui/material';
import { LearningContext } from '../../../context/LearningContext';
import { courseLessonTypes, courseColors } from '../utils';
import EmojiEventsTwoToneIcon from '@mui/icons-material/EmojiEventsTwoTone';
import ErrorIcon from '@mui/icons-material/ErrorOutline';

function CourseStepper({ activeStep, steps, setActiveStep, closePopup }) {
  const {
    activeCourse,
    activeCourseProgress: courseProgress,
    language,
    startQuiz
  } = React.useContext(LearningContext);

  const progressPercentage = courseProgress.isCourseCompleted
    ? 100
    : Math.round((activeStep / steps.length) * 100);

  return (
    <Grid md={3} xs={12} item>
      {activeCourse && (
        <div>
          <CourseProgressCard
            activeCourse={activeCourse}
            progressPercentage={progressPercentage}
          />
          <StepperBox>
            <Stepper
              sx={stepperSx}
              className="media"
              activeStep={activeStep}
              orientation="vertical"
            >
              {steps.map((step, index) => {
                let courseLessonTitle = step.title;
                if (step.course_type === 'cme') {
                  courseLessonTitle = courseLessonTitle
                    ? courseLessonTitle.split(/[-–]/).length > 1
                      ? courseLessonTitle
                          .replace(
                            courseLessonTitle.split(/[-–]/)[0].trim(),
                            ''
                          )
                          .replace(/[-–]/, '')
                      : courseLessonTitle
                    : courseLessonTitle;
                }
                return (
                  <Step key={step.title}>
                    <StepLabel
                      onClick={() => {
                        index <= activeStep && setActiveStep(index);
                        closePopup && closePopup();
                      }}
                      style={{
                        cursor: index <= activeStep ? 'pointer' : 'default'
                      }}
                    >
                      {activeCourse.id === 11159 ? (
                        <div>
                          {index != 0 && activeCourse.id == 11159 ? (
                            <div>
                              <span>
                                {courseLessonTypes(
                                  step.title,
                                  step.course_type,
                                  language
                                )}
                                &nbsp;
                                {index + 1 < 10
                                  ? index.toString().padStart(2, '0')
                                  : index}{' '}
                                -{' '}
                              </span>
                              <b>{courseLessonTitle}</b>
                            </div>
                          ) : (
                            <b>{courseLessonTitle}</b>
                          )}
                        </div>
                      ) : null}

                      {activeCourse.id != 11159 ? (
                        <div>
                          <span>
                            {courseLessonTypes(
                              step.title,
                              step.course_type,
                              language
                            )}
                            &nbsp;
                            {index + 1 < 10
                              ? (index + 1).toString().padStart(2, '0')
                              : index + 1}{' '}
                            -{' '}
                          </span>
                          <b>{courseLessonTitle}</b>
                        </div>
                      ) : null}
                    </StepLabel>
                  </Step>
                );
              })}
              <Step>
                <CertificateAwardedStep
                  isCompleted={courseProgress.isCourseCompleted}
                />
              </Step>
            </Stepper>
            {startQuiz && <StepperOverlay />}
          </StepperBox>
        </div>
      )}
    </Grid>
  );
}

const StepperBox = ({ children, ...props }) => (
  <Box
    sx={{
      height: { xs: 'auto', sm: 'calc(100vh - 300px)' }
    }}
    className='thin-scrollbar'
    {...props}
  >
    <Box
      sx={{
        p: 2,
        position: 'relative',
        minHeight: '100%',
        '&:hover .overlay': { opacity: 1 },
        backgroundColor: '#e9f2fc',
      }}
    >
      {children}
    </Box>
  </Box>
);

const StepperOverlay = ({ children, ...props }) => (
  <Box
    className="overlay"
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: '#17171733',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0,
      transition: 'opacity 0.3s ease'
    }}
    {...props}
  >
    <OverlayText />
  </Box>
);

const OverlayText = ({ text = 'Disabled During Quiz' }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      flexDirection: { xs: 'column', sm: 'row' },
      border: '1px solid #D32F2F',
      backgroundColor: '#FDEDED',
      color: '#D32F2F',
      p: 1,
      borderRadius: 2,
      fontSize: '14px',
      fontWeight: 500,
      gap: 1,
    }}
  >
    <ErrorIcon sx={{ color: '#D32F2F' }} />
    {text}
  </Box>
);


const CourseProgressCard = ({ activeCourse, progressPercentage }) => {
  const courseBackground =
    activeCourse?.slug == 'asls-course'
      ? 'https://courses.medtigo.com/wp-content/uploads/2024/12/ascce.webp'
      : `/images/lms/${activeCourse?.slug}.png`;

  const progressBarColor = courseColors[activeCourse.id] || '#fff';
  const courseName = activeCourse.id == 11159 ? 'OPIOID' : activeCourse.name.replace(/course/i, '');

  return (
    <Box
      sx={{
        height: '160px',
        position: 'relative',
        backgroundColor: '#5C97FF',
        color: '#fff',
        overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        zIndex: 999
      }}
    >
      {/* Background Layer */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${courseBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 1
        }}
      />

      {/* Foreground Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
          textAlign: 'center'
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{
            mb: 2,
            textTransform: 'capitalize',
            textShadow: '0 2px 4px rgba(255, 255, 255, 0.7)', // White shadow
          }}
        >
          {courseName}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: progressBarColor
            }
          }}
        />

        <Typography
          variant="body2"
          sx={{
            mt: 2,
            fontSize: '14px',
            textAlign: 'left',
            width: '100%',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
          }}
        >
          {progressPercentage}% Complete
        </Typography>
      </Box>
    </Box>
  );
};

const CertificateAwardedStep = ({ isCompleted }) => {
  return (
    <StepLabel
      StepIconComponent={() => (
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: isCompleted ? '#E17300' : '#888',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <EmojiEventsTwoToneIcon
            style={{
              color: '#fff'
            }}
          />
        </div>
      )}
    >
      <span
        style={{
          fontWeight: 'bold',
          fontSize: '14px',
          color: isCompleted ? '#E17300' : '#888'
        }}
      >
        Certificate Awarded
      </span>
    </StepLabel>
  );
};

const stepperSx = {
  transition: 'all 0.3s ease',
  '& .MuiPaper-root': {
    backgroundColor: '#e9f2fc !important'
  },
  '& .MuiStepper-root': {
    padding: '12px'
  },
  '& .MuiStepConnector-vertical': {
    padding: '0'
  },
  '& .MuiStepLabel-root': {
    padding: '0px !important'
  },
  '& .MuiStepLabel-label': {
    fontSize: '12px',
    position: 'relative',
    top: '-2px',
    fontWeight: 'normal !important'
  },
  '& text.MuiStepIcon-text': {
    display: 'none'
  },
  '& .MuiStepLabel-vertical.Mui-disabled .MuiStepIcon-root': {
    color: '#a8a8a8'
  },
  '& .MuiStepConnector-vertical .MuiStepConnector-line': {
    borderColor: '#2872C1'
  },
  '& .MuiStepConnector-vertical.Mui-disabled .MuiStepConnector-line': {
    borderColor: '#a8a8a8'
  },
  '& .MuiStepLabel-vertical circle': {
    r: '8'
  },
  '& .MuiStepLabel-vertical.Mui-disabled circle': {
    r: '5'
  },
  '& .MuiStepLabel-labelContainer': {
    height: '14px'
  },
  '& .MuiStepIcon-root.MuiStepIcon-active, & .MuiStepIcon-root.MuiStepIcon-completed':
    {
      color: '#2872C1'
    },
  '& .MuiStepLabel-vertical.Mui-disabled span.MuiStepLabel-labelContainer': {
    height: '14px'
  },
  '& .MuiStepConnector-lineVertical': {
    minHeight: '30px',
    borderLeftWidth: '3px',
    marginLeft: '-1px'
  },
  '& span.MuiStepLabel-iconContainer': {
    zIndex: 1
  }
};

export default CourseStepper;
