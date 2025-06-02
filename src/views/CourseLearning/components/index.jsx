import React from 'react';
import { Button, Box, Typography, Dialog, Container, Grid } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CancelIcon from '@mui/icons-material/CancelRounded';
import Page from '../../../components/Page';
import { Transition } from '../../../ui/Transition';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CourseStepper from './CourseStepper';

// Loaading Screen using framer motion
export const LoadingScreen = () => {
  return (
    <motion.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        color: '#333',
        height: '80vh'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: 600 }}
      >
        Loading Course Content ...
      </motion.div>
    </motion.div>
  );
};

// If the user does not have access to the course, show the Access Denied Page instead of the course content
export const AccessDeniedScreen = ({ text }) => {
  const navigate = useNavigate();

  return (
    <Page title="Certificates">
      <Container maxWidth={false} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          maxWidth="md"
          sx={{
            m: 2,
            p: 2,
            background: '#FDECEA',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <Grid container spacing={1} justifyContent="center" alignItems="center">
            <Grid item xs={12}>
              <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main' }} />
            </Grid>
            <Grid item xs={12}>
              <Typography
                sx={{
                  fontSize: { xs: '18px', sm: '24px' },
                  fontWeight: 600,
                  color: 'error.main',
                }}
              >
                Access Denied
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                sx={{
                  fontSize: { xs: '14px', sm: '16px' },
                  color: 'text.secondary',
                  mb: 2,
                }}
              >
                {text}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                color="error"
                variant="contained"
                disableElevation
                onClick={() => navigate('/dashboard')}
                >
                Back to Dashboard
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}

export const CourseStepperPopup = ({ open, setOpen, isFirstTime, children }) => {
  return (
    <>
      <Box
        onClick={() => setOpen(true)}
        sx={{
          display: isFirstTime ? 'none' : 'block',
          position: 'fixed',
          right: 0,
          top: '200px',
          cursor: 'pointer',
          fontSize: '14px',
          transition: 'all 0.3s',
          transform: 'rotate(270deg)',
          transformOrigin: 'right 100%',
          padding: '6px 18px',
          backgroundColor: '#0b66bf',
          borderRadius: '5px 5px 0 0',
          userSelect: 'none',
          color: 'white'
        }}
      >
        View Progress
      </Box>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        fullScreen
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <CancelIcon
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            right: '6px',
            top: '6px',
            zIndex: 9999,
            fontSize: '30px',
            color: '#aaa'
          }}
        />
        {children}
      </Dialog>
    </>
  );
};

export { CourseStepper };
