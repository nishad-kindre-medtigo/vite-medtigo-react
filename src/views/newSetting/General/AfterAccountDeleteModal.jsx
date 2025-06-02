import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import authService from '../../../services/authService';
import { Transition } from '../../../ui/Transition';

const AfterAccountDeleteModal = () => {

  const handleSubmit = e => {
    e.preventDefault();
    authService.logoutAndRedirectToSignUp();
  };

  return (
    <Dialog
      open={true}
      fullWidth
      maxWidth="xs"
      TransitionComponent={Transition}
    >
      <DialogTitle
        sx={{
          borderBottom: '1px solid',
          textAlign: 'center',
          borderColor: 'grey.400'
        }}
      >
        Thank you for using our platform
      </DialogTitle>
      
      {/* Dialog Content */}
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography align="center" paragraph>
            Your account was successfully inactivated. As per our Terms of Use,
            to permit reactivation upon request, we continue to retain uploaded,
            and system-generated documents as well as certain other information
            related to your account in our database. If you wish to completely
            and permanently delete your account, please email{' '}
            <Typography
              component="span"
              sx={{ color: 'primary.main', fontWeight: 'bold' }}
            >
              delete@medtigo.com
            </Typography>{' '}
            from the same email address as your account.
          </Typography>
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions sx={{ p: 2 }}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Ok
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AfterAccountDeleteModal;
