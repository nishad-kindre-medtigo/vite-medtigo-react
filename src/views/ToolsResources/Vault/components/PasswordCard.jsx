import React, { useState } from 'react';
import { Box, Typography, Snackbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { PasswordCardBox, TextIconBox, TooltipIcon } from '.';
import PlatformDetailsDialog from './PlatformDetailsDialog';
import { format } from 'date-fns';
import CryptoJS from 'crypto-js';
import passwordManagerServices from 'src/services/passwordManagerService';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import Label from 'src/components/Label';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

const PasswordCard = ({ data, fetchPasswords }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const openSnackbar = useOpenSnackbar();
  
  let decryptedPassword = '';
  if (data.password){
    decryptedPassword = CryptoJS.AES.decrypt(
      data.password,
      ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);
  }

  // Function to delete platform details for the user by ID
  const deletePassword = async passwordId => {
    try {
      await passwordManagerServices.deletePassword(passwordId);
      fetchPasswords();
      openSnackbar('Platform details deleted successfully');
    } catch (error) {
      console.error('Error deleting password:', error);
      openSnackbar('Failed to delete password', 'error');
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to copy text to clipboard
  const handleCopy = text => {
    try {
      navigator.clipboard.writeText(text);
      setSnackbarMessage('Copied to clipboard!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to copy text:', error);
      setSnackbarMessage('Failed to copy text');
      setSnackbarOpen(true);
    }
  };

  const CopyIcon = () => <img src='/icons/passwordManager/password_copy.svg' alt="copy" height={15} width={15} />
  const LockIcon = () => <img src='/icons/passwordManager/password_lock.svg' alt="lock" height={25} width={25} />

  return (
    <>
      <PasswordCardBox>
        <TextIconBox>
          <Box display="flex" gap={1} alignItems="center">
            <LockIcon />
            <span style={{ fontSize: '18px', fontWeight: 500 }}>
              {data.task
                ? `${data.task.Certificate_Name} - ${data.task.State_Abbr}`
                : 'Generic'}
            </span>
          </Box>
          <TooltipIcon
            title="Edit"
            icon={<EditIcon />}
            onClick={() => setEditDialogOpen(true)}
            onClose={() => setSnackbarOpen(false)}
          />
          {/* <TooltipIcon
            title="Delete"
            icon={<DeleteIcon />}
            onClick={() => deletePassword(data.id)}
          /> */}
        </TextIconBox>
        <hr style={{ marginInline: '16px', opacity: 0.5 }} />
        <TextIconBox sx={{ py: 0.7 }}>
          <Typography style={{ fontSize: '15px', fontWeight: 400 }}>
            Site Name: {data.platformName}
          </Typography>
          <TooltipIcon
            title="Copy Site Name"
            icon={<CopyIcon />}
            onClick={() => handleCopy(data.platformName)}
          />
        </TextIconBox>
        <TextIconBox sx={{ py: 0.7 }}>
          <Typography style={{ fontSize: '15px', fontWeight: 400 }}>
            Username: {data.username ? data.username : <Label color="error">N/A</Label>}
          </Typography>
          {data.username && (
            <TooltipIcon
              title="Copy Username"
              icon={<CopyIcon />}
              onClick={() => handleCopy(data.username)}
            />
          )}
        </TextIconBox>
        <TextIconBox sx={{ py: 0.7 }}>
          <Typography style={{ fontSize: '15px', fontWeight: 400 }}>
            Password: {!decryptedPassword ? <Label color="error">N/A</Label> : showPassword ? decryptedPassword : '********'}
          </Typography>
          {decryptedPassword && (
            <Box display="flex" gap={1}>
              <TooltipIcon
                title={showPassword ? 'Hide Password' : 'Show Password'}
                icon={showPassword ? <VisibilityIcon fontSize='small' /> : <VisibilityOffIcon fontSize='small' />}
                onClick={togglePasswordVisibility}
              />
              <TooltipIcon
                title="Copy Password"
                icon={<CopyIcon />}
                onClick={() => handleCopy(decryptedPassword)}
              />
            </Box>
          )}
        </TextIconBox>
        <TextIconBox sx={{ py: 0.7 }}>
          <Typography title={data.platformUrl} style={{ width: '70%', fontSize: '16px', fontWeight: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {data.platformUrl}
          </Typography>
          <TooltipIcon
            title="Copy URL"
            icon={<CopyIcon />}
            onClick={() => handleCopy(data.platformUrl)}
          />
        </TextIconBox>
        <hr style={{ marginInline: '16px', opacity: 0.5 }} />
        <TextIconBox>
          <Box display="flex" gap={0.5}>
            <Typography style={{ fontSize: '14px', fontWeight: 400, color: '#7A7676' }}>
              2FA Required:
            </Typography>
            {data.is2FArequired ? (
              <CheckCircleOutlineIcon fontSize="small" style={{ color: '#45BE1B' }} />
            ) : (
              <CancelOutlinedIcon fontSize="small"  style={{ color: '#EA012B' }} />
            )}
          </Box>
          <Typography style={{ fontSize: '14px', fontWeight: 400, color: '#7A7676' }}>
            Last Updated: {format(new Date(data.updatedAt), 'MMM dd, yyyy')}
          </Typography>
        </TextIconBox>
      </PasswordCardBox>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message={snackbarMessage}
      />
      <PlatformDetailsDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        initialValues={{ ...data, password: decryptedPassword }}
        fetchPasswords={fetchPasswords}
      />
    </>
  );
};

export default PasswordCard;
