import React from 'react';
import { Dialog, Typography, Stack, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';

const FormSubmissionPopup = ({ open, handleClose }) => {
  const user = useSelector((state) => state.account.user);

  return (
    <Dialog
      open={open}
      fullWidth
      aria-labelledby="feedback-popup"
      aria-describedby="course-feedback-popup"
      maxWidth="sm"
    >
      <Stack
        spacing={2}
        sx={{
          background: '#FBFFFB',
          textAlign: 'center',
          p: 4,
          position: 'relative' // Ensure absolute positioning works
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'grey.600',
            '&:hover': {
              bgcolor: 'grey.200'
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Header */}
        <img
          src="/images/lms/well_done.svg"
          alt="Feedback"
          style={{ height: '60px' }}
        />
        <Typography variant="h5" fontWeight="bold" color="success.main">
          Well Done!
        </Typography>
        <Typography align="center" fontWeight={400} px={2} color="#3A3A3A">
          you have successfully claimed CME, your{' '}
          <strong>CME certificate</strong> has been emailed to {user.email}.
        </Typography>
      </Stack>
    </Dialog>
  );
};

export default FormSubmissionPopup;
