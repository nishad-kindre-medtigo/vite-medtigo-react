import React from 'react';
import { Box, Button, Grid, IconButton, Typography, Tooltip } from '@mui/material';
import FindIcon from '@mui/icons-material/FindInPageRounded';
import StartIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import RenewIcon from '@mui/icons-material/Autorenew';
import ContinueIcon from '@mui/icons-material/SkipNext';
import StartQuizIcon from '@mui/icons-material/CallMade';
import ExploreIcon from '@mui/icons-material/OpenInNew';
import BackArrow from '@mui/icons-material/ArrowBackIosRounded';
import { useNavigate } from 'react-router';

const StyledBox = ({ children, id, sx }) => (
  <Box
    id={id}
    sx={{
      gap: '12px',
      border: '1px solid #DFDFDF',
      borderRadius: '2px',
      boxShadow: '0px 4px 6px -1px #efefef',
      transition: 'box-shadow 0.3s ease', // Smooth transition for shadow
      height: '100%',
      '&:hover': {
        boxShadow: '0px 4px 6px -1px #ccc' // Slightly darker shadow
      },
      ...sx
    }}
  >
    {children}
  </Box>
);

export const PageTitle = ({ title }) => {
  return (
    <Typography
      mb={2}
      sx={{
        display: { xs: 'none', sm: 'block' },
        fontSize: { xs: '18px', sm: '22px' },
        fontWeight: 500
      }}
    >
      {title}
    </Typography>
  );
};

export const ReportBackLink = ({ title, tab }) => {
  const navigate = useNavigate();
  
  return (
    <Box
      component="span"
      sx={{
        fontSize: { xs: '18px', sm: '22px' },
        fontWeight: { xs: 600, sm: 500 },
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        my: 1
      }}
      onClick={() => navigate(`/monitoring-renewal/${tab}`)}
    >
      <BackArrow sx={{ fontSize: '20px', fontWeight: 'bold' }} />
      {title}
    </Box>
  );
};

export const StyledCard = ({ children, id, highlight = false, sx = {} }) => {
  return (
    <StyledBox
      id={id}
      sx={{
        p: 2,
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1,
        borderColor: highlight ? '#2872c1' : '#DFDFDF',
        borderLeft: '4px solid #2872C1',
        boxShadow: highlight
          ? '0px 8px 12px -2px #0000004f'
          : '0px 4px 6px -1px #efefef',
        ...sx
      }}
    >
      {children}
    </StyledBox>
  );
};

export const PlaceHolder = ({
  text = 'No Certificates available. Please upload to view.'
}) => {
  return (
    <Box
      sx={{
        fontSize: { xs: '14px', sm: '20px'},
        fontWeight: 600,
        backgroundColor: '#F8F8F8',
        p: 1,
        height: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        color: '#6A6A6A'
      }}
    >
      <FindIcon sx={{ color: "#e7e7e7", fontSize: '150px' }} />
      <Box p={2}>{text}</Box>
    </Box>
  );
};

export const ProgressIcon = ({ src }) => {
  return <img src={src} alt="Progress" loading="lazy" width={36} height={36} />;
};

export const CertificateContent = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 0.5
      }}
    >
      {children}
    </Box>
  );
};

export const PrimaryText = ({
  title,
  onClick = () => {},
  children,
  sx = {}
}) => {
  return (
    <Typography
      title={title}
      style={{ fontSize: '16px', fontWeight: 500 }}
      sx={sx}
      onClick={onClick}
    >
      {children}
    </Typography>
  );
};

export const SecondaryText = ({ children, style = {} }) => {
  return (
    <Typography style={{ fontSize: '14px', fontWeight: 400, ...style }}>
      {children}
    </Typography>
  );
};

export const AddedByYou = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        component="span"
        sx={{
          px: 1,
          borderRadius: 1,
          background: '#ebebeb',
          color: '#606060',
          fontSize: '12px',
          fontWeight: 400
        }}
      >
        Added by you
      </Box>
    </Box>
  );
};

export const OldCertificateText = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        component="span"
        sx={{
          px: 1,
          borderRadius: 1,
          background: '#def',
          color: '#606060',
          fontSize: '12px',
          fontWeight: 400
        }}
      >
        Old Certificate
      </Box>
    </Box>
  );
};

export const MenuIcon = ({ children }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        right: 0,
        top: 0,
        background: '#fff',
        padding: '6px',
        paddingRight: 0,
        paddingBottom: 0,
        cursor: 'pointer'
      }}
    >
      {children}
    </Box>
  );
};

export const CertificateIcon = ({ icon: Icon, title, onClick }) => {
  return (
    <Tooltip arrow title={title}>
      <IconButton size="small" onClick={onClick}>
        <Icon
          sx={{
            color: '#4C4B4B',
            '&:hover': {
              color: '#000'
            }
          }}
        ></Icon>
      </IconButton>
    </Tooltip>
  );
};

export const ActionContainer = ({ children }) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignSelf: 'end',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 1
      }}
    >
      {children}
    </Box>
  );
};

export const ActionButton = ({
  buttonText,
  style = {},
  sx = {},
  onClick,
  disabled = false
}) => {
  const BUTTON_ICONS = {
    'START COURSE': <StartIcon />,
    'CONTINUE': <ContinueIcon />,
    'START QUIZ': <StartQuizIcon />,
    'RENEW': <RenewIcon />,
    'EXPLORE PLANS': <ExploreIcon />,
  };
    
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      disableElevation
      disabled={disabled}
      sx={{
        fontSize: '14px',
        borderRadius: '4px',
        px: '14px',
        padding: '4px 12px',
        minWidth: '100px',
        ...sx
      }}
      endIcon={BUTTON_ICONS[buttonText]}
      style={style}
    >
      {buttonText}
    </Button>
  );
};

export const AddCertificateField = ({ children, ...props }) => (
  <Tooltip arrow followCursor title="Click to Upload File">
    <Box
      sx={{
        mt:3,
        p: 2,
        border: '1px dashed #2872c1',
        borderRadius: '4px',
        textAlign: 'center',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        fontSize: '16px',
        cursor: 'pointer',
        color: '#2872c1',
        transition: 'all 0.3s ease',
        backgroundColor: '#fff',
        '&:hover': {
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
        }
      }}
      {...props}
    >
      {children}
    </Box>
  </Tooltip>
);

export const ShowMoreText = ({ showAll, setShowAll, ...props }) => {
  const handleShow = () => {
    if (showAll) {
      setShowAll(false);
      // Scroll to the top of the page
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scrolling effect
      });
    } else {
      setShowAll(true);
    }
  };

  return (
    <Grid size={12}>
      <Typography
        style={{
          fontSize: '16px',
          fontWeight: 500,
          color: '#2872C1',
          cursor: 'pointer',
          textAlign: 'right'
        }}
        onClick={handleShow}
        {...props}
      >
        {showAll ? 'SHOW LESS' : 'SHOW MORE'}
      </Typography>
    </Grid>
  );
};
