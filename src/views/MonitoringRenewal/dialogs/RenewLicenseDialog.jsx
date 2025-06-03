import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogTitle, Typography, Grid } from '@mui/material';
import { Transition } from '../../../ui/Transition';
import { dialogStyles } from '../components/CertificateActions';
import { useOpenSnackbar } from '../../../hooks/useOpenSnackbar';
import useBreakpoints from '../../../hooks/useBreakpoints';
import { Loader } from '../../../ui/Progress';

const RenewLicenseDialog = ({ open, onClose, handleRenew }) => {
  const openSnackbar = useOpenSnackbar();
  const { isMobile } = useBreakpoints();
  const classes = dialogStyles;
  const [loading, setLoading] = useState(false);

  const sendForRenewal = async () => {
    try {
      setLoading(true);
      handleRenew();
      openSnackbar('Renew Request Sent Successfully!', 'info');
      onClose();
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      openSnackbar('Error Sending Request!', 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition} disableEnforceFocus>
      <DialogTitle>
        <Grid container spacing={1}>
          <Grid size={isMobile ? 2 : undefined}>
            <img src="/icons/myLearning/alert.svg" alt="Alert Icon" />
          </Grid>
          <Grid size={isMobile ? 10 : undefined}>
            <Typography style={classes.title}>
              Request for Renewal
            </Typography>
            <Typography style={classes.subTitle}>
              Do you want to Renew Your License?
            </Typography>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogActions sx={{ px: 2, pb: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={sendForRenewal}>
          {loading ? (
            <Loader width={24} />
          ) : (
            'Renew'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RenewLicenseDialog