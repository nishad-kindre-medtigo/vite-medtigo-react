import React from 'react';
import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { dialogStyles } from '../RequestPayment/RequestPaymentPopup';

const CommentModal = ({ open, setOpen, comment })  => {
  const classes = dialogStyles;
  return (
    <Dialog open={open} onClose={() => setOpen(false)} disableEnforceFocus
      PaperProps={{
        style: {
          width: '550px',
          backgroundColor: '#fff',
          color: '#000'
        }
      }}
    >
      <DialogTitle style={{ paddingBottom: 6 }}>
        <Typography sx={classes.dialogTitle}>Comment</Typography>
      </DialogTitle>
      <DialogContent sx={classes.dialogContent}>
        {comment}
      </DialogContent>
    </Dialog>
  );
}

export default CommentModal
