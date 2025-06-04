import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, TextField, Typography } from '@mui/material';
import authService from 'src/services/authService';
import AfterAccountDeleteModal from 'src/views/newSetting/General/AfterAccountDeleteModal';
import CryptoJS from 'crypto-js';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import { Transition } from 'src/ui/Transition';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

const DeleteModal = ({ openDeleteModal, setOpenDeleteModal, user, onInactivate }) => {
  const openSnackbar = useOpenSnackbar();
  const [password, setPassword] = useState(null);
  const [accountDeleted, setAccountDeleted] = useState(false);

  const handleClose = () => {
    setOpenDeleteModal(false);
    setPassword(null);
  };

  const deleteAccount = async () => {
    try {
      const data = await authService.deleteUser();
      setAccountDeleted(true);
      setOpenDeleteModal(false);
      authService.setSession(null);
    } catch (error) {
      console.log(error);
      setAccountDeleted(false);
    }
  };

  const deleteAccountHandler = e => {
    e.preventDefault();

    if (!user || !user.email) {
      console.error('User or user email is not defined');
      openSnackbar('User information is missing.', 'error');
      return;
    }

    if (!password) {
      openSnackbar('Please enter your password.', 'error');
      return;
    }

    let EncryptedPassword = CryptoJS.AES.encrypt(
      password,
      ENCRYPTION_KEY
    ).toString();
    let EncryptedEmail = CryptoJS.AES.encrypt(
      user.email,
      ENCRYPTION_KEY
    ).toString();

    authService
      .validateUserPassword(EncryptedEmail, EncryptedPassword)
      .then(res => {
        if (res.code === 200) {
          deleteAccount();
          onInactivate();
        }
      })
      .catch(err => {
        if (err.code === 401) {
          openSnackbar('Password is not correct.', { variant: 'error' });
        } else {
          console.log(err);
          openSnackbar('Oops! An error occurred.', { variant: 'error' });
        }
      });
  };

  return (
    <div>
      <Dialog
        open={openDeleteModal}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullWidth
      >
        <DialogTitle
          id="form-dialog-title"
          sx={{
            borderBottom: '1px solid',
            borderColor: 'grey.400',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <HelpOutlineIcon fontSize="large" sx={{ color: 'grey' }} />
          <Typography variant="h6">
            Are you sure you want to inactivate this account?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography color="error" my={2}>
            This action will not permanently delete your account with medtigo.
            To permanently delete your account, please send an email to:{' '}
            <span>
              <a
                style={{ textDecoration: 'none', color: '#2872C1' }}
                href="mailto:delete@medtigo.com"
              >
                delete@medtigo.com.
              </a>
            </span>
          </Typography>
          <Typography fontWeight={500} mb={1}>
            Please enter password for confirmation.
          </Typography>
          <TextField
            fullWidth
            required
            label="Password"
            name="currentPassword"
            onChange={e => setPassword(e.target.value)}
            type="password"
            value={password}
            variant="outlined"
          />
          <DialogActions sx={{ pt: 2, px: 0 }}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={deleteAccountHandler}>
              Inactive Account
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      {accountDeleted && <AfterAccountDeleteModal />}
    </div>
  );
};

export default DeleteModal;
