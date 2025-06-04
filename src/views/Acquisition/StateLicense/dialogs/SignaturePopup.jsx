import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import ServiceRegistationForm from 'src/views/serviceRegistrationForm';

const SignaturePopup = ({
  openSignatureModal,
  handleCloseSignaturePopup,
  handleSignatureSubmit
}) => {
  return (
    <Dialog
      open={openSignatureModal}
      onClose={handleCloseSignaturePopup}
      fullWidth
      maxWidth="lg"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'unset'
      }}
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          color: '#000000',
          position: 'relative',
          paddingTop: '20px'
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: '15px',
            top: '15px',
            cursor: 'pointer'
          }}
          onClick={handleCloseSignaturePopup}
        >
          <CancelIcon
            style={{
              color: '#9D9B9B',
              height: '30px',
              width: '30px'
            }}
          />
        </div>
      </DialogTitle>
      <DialogContent
        style={{
          backgroundColor: '#ffffff',
          color: '#000000'
        }}
      >
        <ServiceRegistationForm
          onFormSubmit={handleSignatureSubmit}
        ></ServiceRegistationForm>
      </DialogContent>
    </Dialog>
  );
};

export default SignaturePopup;
