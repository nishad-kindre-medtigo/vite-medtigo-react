import React from 'react';
import { Box, Grid, Button, TextField, IconButton, Typography, Dialog, Backdrop, Fade } from '@mui/material';
import { useOpenSnackbar } from '../../hooks/useOpenSnackbar';
import CloseIcon from '@mui/icons-material/Close';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import UserAccessService from '../../services/userAccessService';
import useBreakpoints from '../../hooks/useBreakpoints';

const MyInstitutions = () => {
  const { isMobile } = useBreakpoints();
  const [accessesList, setAccessesList] = React.useState([]);
  const [isAccessesLoading, setIsAccessesLoading] = React.useState(true);
  const [accessRecord, setAccessRecord] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState({
    accessPermissionDialog: false,
    removeAccessDialog: false,
    addAdminDialog: false
  });
  const [addAdminForm, setAddAdminForm] = React.useState({
    hospitalName: '',
    adminEmail: ''
  });
  const [formErrors, setFormErrors] = React.useState({
    adminEmail: '',
    hospitalName: ''
  });
  const openSnackbar = useOpenSnackbar();

  const getUserAccesses = async () => {
    setIsAccessesLoading(true);
    const useraccesses = await UserAccessService.getAllAccesses();
    setAccessesList(useraccesses);
    setIsAccessesLoading(false);
  };

  const deleteUserAccess = async () => {
    await UserAccessService.removeAccess(accessRecord.id);
    openSnackbar('Access revoked successfully');
    setOpen(false);
    getUserAccesses();
  };

  React.useEffect(() => {
    getUserAccesses();
  }, []);

  React.useEffect(() => {
    if (
      showDialog.accessPermissionDialog ||
      showDialog.removeAccessDialog ||
      showDialog.addAdminDialog
    )
      setOpen(true);
  }, [showDialog]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddAdminFormInput = e => {
    setAddAdminForm({ ...addAdminForm, [e.target.name]: e.target.value });
    setFormErrors({ adminEmail: '', hospitalName: '' });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };  

  const validateForm = () => {
    const specialCharacters = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    const errors = { adminEmail: '', hospitalName: '' };
    if (
      addAdminForm.adminEmail &&
      addAdminForm.hospitalName &&
      validateEmail(addAdminForm.adminEmail) &&
      !specialCharacters.test(addAdminForm.hospitalName) &&
      addAdminForm.hospitalName.length <= 255
    )
      return true;
    if (!validateEmail(addAdminForm.adminEmail))
      errors.adminEmail = 'Please provide a valid email';
    if (!addAdminForm.adminEmail) errors.adminEmail = 'This field is required';
    if (!addAdminForm.hospitalName)
      errors.hospitalName = 'This field is required';
    if (addAdminForm.hospitalName.length > 255)
      errors.hospitalName = 'Character limit exceeded';
    if (specialCharacters.test(addAdminForm.hospitalName))
      errors.hospitalName = 'No special characters allowed';
    setFormErrors(errors);
    return false;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      UserAccessService.addAdmin(addAdminForm);
      setAddAdminForm({ hospitalName: '', adminEmail: '' });
      setOpen(false);
      openSnackbar('Invitation email sent successfully');
    }
  };

  const DialogWrapper = ({ children }) => (
    <Box
      sx={{
        backgroundColor: 'white',
        color: 'white',
        padding: '12px 32px 40px',
        borderRadius: 2
      }}
    >
      {children}
    </Box>
  );

  const AddAdminDialog = () => (
    <Box
      sx={{
        maxWidth: 564,
        borderRadius: 2,
        backgroundColor: 'white',
        padding: 3,
        width: '100%'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontFamily: 'Poppins', fontWeight: 500 }}
        >
          Add New Institution Admin
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon sx={{ color: '#999' }} />
        </IconButton>
      </Box>
      <Typography
        sx={{ fontFamily: 'Poppins', fontSize: 14, color: '#283B4C', mb: 4 }}
      >
        Please enter the details of the hospital administrator you want to share
        your course certificates and CME/CE credits with
      </Typography>
      <TextField
        required
        fullWidth
        label="Institution Name"
        variant="outlined"
        onChange={handleAddAdminFormInput}
        name="hospitalName"
        error={Boolean(formErrors.hospitalName)}
        helperText={formErrors.hospitalName}
        sx={{ mb: 3 }}
      />
      <TextField
        required
        fullWidth
        label="Institution Admin Mail ID"
        variant="outlined"
        onChange={handleAddAdminFormInput}
        name="adminEmail"
        error={Boolean(formErrors.adminEmail)}
        helperText={formErrors.adminEmail}
        sx={{ mb: 3 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          sx={{
            mr: 2,
            textTransform: 'none',
            color: '#2872C1',
            borderColor: '#2872C1',
            fontFamily: 'Poppins',
            '&:hover': { backgroundColor: '#2872C1', color: 'white' }
          }}
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#2872C1',
            color: 'white',
            textTransform: 'none',
            fontFamily: 'Poppins',
            '&:hover': { backgroundColor: '#2872C1' }
          }}
          onClick={handleSubmit}
        >
          Send Invitation
        </Button>
      </Box>
    </Box>
  );

  return (
    <Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <DialogWrapper>
            {showDialog.addAdminDialog && <AddAdminDialog />}
          </DialogWrapper>
        </Fade>
      </Dialog>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ fontSize: 16, color: 'white' }}>
          {accessesList.length === 0
            ? 'There are currently no hospital administrators in your list.'
            : 'The following hospitals and individuals have access to your CertificateTracker data.'}
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#2872C1',
            color: '#FFFFFF',
            textTransform: 'none',
            fontFamily: 'Poppins',
            px: 2,
            py: 1,
            '&:hover': { backgroundColor: '#2872C1' }
          }}
          onClick={() =>
            setShowDialog({
              accessPermissionDialog: false,
              removeAccessDialog: false,
              addAdminDialog: true
            })
          }
        >
          {isMobile ? <AddRoundedIcon /> : 'Add Institution Admin'}
        </Button>
      </Box>
      {isAccessesLoading
        ? null
        : accessesList.map((record, index) => <div key={index}></div>)}
    </Grid>
  );
};

export default MyInstitutions;
