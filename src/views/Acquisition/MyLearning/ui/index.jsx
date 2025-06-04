import React from 'react';
import { Box, Button, Card, LinearProgress, Tooltip, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StartIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import RenewIcon from '@mui/icons-material/Autorenew';
import ContinueIcon from '@mui/icons-material/SkipNext';
import StartQuizIcon from '@mui/icons-material/CallMade';
import ExploreIcon from '@mui/icons-material/OpenInNew';
import FreeIcon from '@mui/icons-material/School';
import useBreakpoints from 'src/hooks/useBreakpoints';

export const CourseCard = ({ children, ...props }) => (
  <Card
    sx={{
      borderRadius: '2px',
      height: '100%',
      border: '1px solid #CFCFCF',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.23)',
      position: 'relative',
      '&:hover': {
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.36)'
      }
    }}
    {...props}
  >
    {children}
  </Card>
);

// Course Image Box
export const ImageBox = ({ children, ...props }) => (
  <Box
    sx={{
      position: 'relative',
      overflow: 'hidden', // Ensures children stay within the box
      maxWidth: '100%',
      cursor: 'pointer',
      '&:hover .overlay': { opacity: 1 },
      '&:hover .media': { filter: 'brightness(50%)', transform: 'scale(1.01)' }
    }}
    {...props}
  >
    {children}
  </Box>
);

// CourseImage
export const CourseImage = ({ src, alt, ...props }) => (
  <img
    className="media"
    src={src}
    alt={alt}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'all 0.3s ease'
    }}
    {...props}
  />
);

// ImageOverlay
export const ImageOverlay = ({
  children,
  courseID,
  unlockCourse,
  ...props
}) => (
  <Box
    className="overlay"
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '96%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      opacity: 0,
      transition: 'opacity 0.3s ease'
    }}
    {...props}
  >
    <OverlayText courseID={courseID}>
      {unlockCourse ? (
        <>
          <LockOutlinedIcon />
          <span>UNLOCK COURSE</span>
        </>
      ) : (
        <>
          <VisibilityIcon />
          <span>VIEW COURSE</span>
        </>
      )}
    </OverlayText>
  </Box>
);

const COURSE_COLORS = {
  4526: '#b90016b0',
  9985: '#0181b980',
  9238: '#452482bd',
  79132: '#02919180',
  151904: '#3d66aec9',
  192797: '#cb4517c2',
  11159: '#0087ff80'
};

// OverlayText
export const OverlayText = ({ children, courseID, ...props }) => {
  return (
    <Box
      sx={{
        background: COURSE_COLORS[courseID] || '#fff',
        padding: '8px 16px',
        borderRadius: '2px',
        display: 'flex',
        alignItems: 'center',
        fontWeight: 600,
        gap: '6px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
        color: '#fff'
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export const CardActions = ({ children, hide, ...props }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 1.5,
      px: '10px',
      py: '10px',
      pt: hide ? '4px' : '10px'
    }}
    {...props}
  >
    {children}
  </Box>
);

export const CourseProgress = ({ hide, percent }) => (
  <Tooltip arrow followCursor title={`${percent}% Completed`}>
    <Box sx={{ cursor: 'pointer' }}>
      <LinearProgress
        aria-label={`Course progress: ${percent}%`}
        aria-labelledby="course-progress-label"
        aria-describedby="course-progress-description"
        sx={{
          backgroundColor: '#e0e0e0',
          marginTop: '4px',
          visibility: hide ? 'hidden' : 'visible',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#D6D6D6',
            transform: 'scale(1.02)',
            filter: 'saturate(50%)'
          },
          '& .MuiLinearProgress-bar': {
            background: `linear-gradient(to right,rgb(67, 17, 203), #2575fc)`
          }
        }}
        variant="determinate"
        value={percent}
      />
    </Box>
  </Tooltip>
);

export const ActionIcon = ({ src, alt, title, onClick, ...props }) => (
  <Tooltip arrow title={title} onClick={onClick}>
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{
        height: '26px',
        mx: '6px',
        cursor: 'pointer',
        '&:hover': {
          filter: 'brightness(170%)'
        }
      }}
      {...props}
    />
  </Tooltip>
);

export const ExpiryText = () => (
  <Typography sx={{ fontSize: '14px', color: '#FF0000', fontWeight: 500 }}>
    Expired
  </Typography>
);

export const PrimaryText = ({ children, sx, ...props }) => (
  <Typography
    sx={{ fontSize: '12px', color: '#595959', fontWeight: 400, ...sx }}
    {...props}
  >
    {children}
  </Typography>
);

// Action Button
export const ActionButton = ({ buttonText, ...props }) => {
  const { isMobile } = useBreakpoints();
  const BUTTON_ICONS = {
    'START COURSE': <StartIcon />,
    'CONTINUE': <ContinueIcon />,
    'START QUIZ': <StartQuizIcon />,
    'RENEW': <RenewIcon />,
    'EXPLORE PLANS': <ExploreIcon />,
    'FREE COURSE': <FreeIcon />
  };

  return (
    <Button
      variant="contained"
      sx={{
        padding: '4px 12px',
        borderRadius: '4px',
        fontSize: '14px'
      }}
      endIcon={BUTTON_ICONS[buttonText]}
      {...props}
    >
      {buttonText === 'FREE COURSE' && isMobile ? 'FREE' : buttonText}
    </Button>
  );
};

export const CertificateValidity = ({ duration = '2 YEARS', sx }) => {
  return (
    <Box mb={1}>
      <Box
        component="span"
        sx={{
          px: 1,
          background: duration === '2 YEARS' ? '#E7BC3F33' : '#EAF3FF',
          fontSize: '14px',
          fontWeight: 600,
          textTransform: 'uppercase',
          ...sx
        }}
      >
        CERTIFICATE CARD VALID FOR {duration}
      </Box>
    </Box>
  );
};
