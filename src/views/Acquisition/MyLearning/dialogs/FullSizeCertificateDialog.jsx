import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogTitle, Typography, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Transition } from 'src/ui/Transition';
import certificatesService from 'src/services/certificatesService';
import { useSelector } from 'react-redux';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import { useMyLearningContext } from 'src/context/MyLearningContext';

const FullSizeCertificateDialog = () => {
  const openSnackbar = useOpenSnackbar();
  const [loading, setLoading] = useState(false);
    const { email } = useSelector((state) => state.account.user);
  const { dialogs, courseData, handleCloseDialog } = useMyLearningContext();

  const handleClose = () => {
    handleCloseDialog('certificate');
  }

  const sendEmailForFullSizeCertificate = async () => {
    const values = new FormData();
    values.append('courseName', courseData.title);
    values.append('email', email);
    try {
      setLoading(true)
      const response = await certificatesService.fullCertificateRequest(values);
      if(response){
        openSnackbar('Request submitted. You’ll receive your certificate within 24 hours', "success", 5000);
        handleClose();
      }
    } catch (error) {
      openSnackbar('Error Sending Mail!', 'error');
    }
  }
  
  return (
      <Dialog open={dialogs.certificate} onClose={handleClose} TransitionComponent={Transition} disableEnforceFocus maxWidth='xs' fullWidth>
        <DialogTitle display='flex' gap='8px' alignItems='center'>
          <img src="/icons/myLearning/alert.svg" alt='Warning Icon' />
          <Typography sx={{fontSize: '20px', fontWeight: 600, color: '#4B3A5A'}}>
            Send Mail For Full Size Certificate
          </Typography>
        </DialogTitle>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" disabled={loading} onClick={sendEmailForFullSizeCertificate} endIcon={<SendIcon />}>
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default React.memo(FullSizeCertificateDialog);
