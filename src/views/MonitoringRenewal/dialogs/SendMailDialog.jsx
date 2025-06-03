import React from 'react';
import { Avatar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, Chip, Stack, Autocomplete } from '@mui/material';
import DeleteIcon from '@mui/icons-material/ClearRounded';
import SendIcon from '@mui/icons-material/Send';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCertificatesContext } from 'src/context/CertificatesContext';
import { Transition } from '../../../ui/Transition';

const SendMailDialog = () => {
  const { sendACopy, recipientEmails, setRecipientEmails, setIsEmailDialogOpen, isEmailDialogOpen, handleSendEmail, setActiveCertificateData } = useCertificatesContext();

  const formik = useFormik({
    initialValues: {
      emailInput: ''
    },
    validationSchema: Yup.object({
      emailInput: Yup.string()
        .email('Invalid email address')
        .test(
          'unique-email',
          'Email is already added',
          value => !recipientEmails.includes(value)
        )
    }),
    onSubmit: (values, { resetForm }) => {
      setRecipientEmails([...recipientEmails, values.emailInput]);
      resetForm();
    }
  });

  const handleDeleteEmail = email => {
    setRecipientEmails(recipientEmails.filter(e => e !== email));
  };

  const handleClose = () => {
    setActiveCertificateData({});
    setIsEmailDialogOpen(false);
  };

  return (
    <Dialog
      open={isEmailDialogOpen}
      onClose={handleClose}
      aria-labelledby="email-dialog-certificate"
      TransitionComponent={Transition}
      keepMounted
      maxWidth="sm"
    >
      <DialogTitle
        id="form-dialog-title"
        sx={{
          borderBottom: '1px solid',
          borderColor: 'grey.400'
        }}
      >
        Email Certificate
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ py: 2.5 }}>
          Type the email address below, press <b>Enter</b> to add, and then click <b>SEND MAIL</b> to send the certificate to the specified email address
        </DialogContentText>
        <form
          onSubmit={event => {
            event.preventDefault();
            formik.handleSubmit();
          }}
        >
          <Autocomplete
            freeSolo
            options={[]}
            inputValue={formik.values.emailInput}
            onInputChange={(event, newValue) => {
              formik.setFieldValue('emailInput', newValue);
            }}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault();
                formik.handleSubmit();
              }
            }}
            renderInput={params => (
              <TextField
                {...params}
                variant="filled"
                size="small"
                label="Recipient's Email"
                placeholder="Enter email and press Enter"
                error={Boolean(formik.touched.emailInput && formik.errors.emailInput)}
                helperText={formik.touched.emailInput && formik.errors.emailInput}
                fullWidth
              />
            )}
            disabled={sendACopy.shouldSend}
          />
        </form>
        {/* Chips for Added Emails */}
        <Stack direction="row" gap={1} mt={2} flexWrap="wrap">
          {recipientEmails.map((email, index) => (
            <Chip
              key={index}
              label={email}
              variant="outlined"
              color="primary"
              avatar={<Avatar>{email[0].toUpperCase()}</Avatar>}
              deleteIcon={<DeleteIcon />}
              onDelete={() => handleDeleteEmail(email)}
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!recipientEmails.length}
          endIcon={<SendIcon />}
          style={{
            cursor: !recipientEmails.length ? 'not-allowed' : 'pointer',
            pointerEvents: 'auto'
          }}
          onClick={() => {
            handleSendEmail(recipientEmails, false);
            setTimeout(() => handleClose(), 2000);
          }}
        >
          Send Email
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendMailDialog;
