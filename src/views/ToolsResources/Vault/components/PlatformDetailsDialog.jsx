import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Grid, Skeleton, TextField, InputAdornment, IconButton, FormControlLabel } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import { Transition } from 'src/ui/Transition';
import { StyledInputLabel } from 'src/views/new_staffing/components';
import { AndroidSwitch } from '.';
import * as Yup from 'yup';
import passwordManagerServices from 'src/services/passwordManagerService';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import useBreakpoints from 'src/hooks/useBreakpoints';
import { Loader } from 'src/ui/Progress';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

const PlatformDetailsDialog = ({
  open,
  onClose,
  initialValues,
  mode = 'edit',
  fetchPasswords,
  handleTaskResponse,
  responseData,
  passwordTaskID
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchedInitialValues, setFetchedInitialValues] = useState(null);
  const { id: userID } = useSelector(state => state.account.user);
  const openSnackbar = useOpenSnackbar();
  const { isMobile } = useBreakpoints();

  useEffect(() => {
    const fetchPasswordTask = async () => {
      if (passwordTaskID) {
        setLoading(true);
        try {
          const data = await passwordManagerServices.getPasswordTask(passwordTaskID);
          // If password data is available for selected task ID, set it as initial values else set null
          if (data) {
            let decryptedPassword = '';
            if (data.password){
              decryptedPassword = CryptoJS.AES.decrypt(
                data.password,
                ENCRYPTION_KEY
              ).toString(CryptoJS.enc.Utf8);
            }
            setFetchedInitialValues({
              platformName: data.platformName || '',
              platformUrl: data.platformUrl || '',
              username: data.username || '',
              password: decryptedPassword,
              is2FArequired: data.is2FArequired || false
            });
          } else {
            // openSnackbar('No platform details found', 'warning');
            setFetchedInitialValues(null);
          }
        } catch (error) {
          console.error('Error fetching password task:', error);
          setFetchedInitialValues(null);
          // openSnackbar('Failed to fetch platform details', 'error');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPasswordTask();
  }, [passwordTaskID]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Function to add platform details for the user
  const addPassword = async passwordData => {
    try {
      if(responseData) { // If taskID is available, add it to the passwordData
        passwordData.taskID = responseData.Task_Id
      }
      await passwordManagerServices.addPassword({
        ...passwordData,
        userID: userID,
        password: CryptoJS.AES.encrypt(
          passwordData.password,
          ENCRYPTION_KEY
        ).toString()
      });
      if(handleTaskResponse) {
        handleTaskResponse();
      }
      fetchPasswords();
      openSnackbar('Platform details added successfully');
    } catch (error) {
      console.error('Error adding password:', error);
      openSnackbar('Failed to add password', 'error');
    }
  };
  
  // Function to update platform details for the user by ID
  const updatePassword = async passwordData => {
    try {
      await passwordManagerServices.updatePassword(passwordData.id, {
        ...passwordData,
        userID: userID,
        password: CryptoJS.AES.encrypt(
          passwordData.password,
          ENCRYPTION_KEY
        ).toString()
      });
      fetchPasswords();
      openSnackbar('Site details edited successfully');
    } catch (error) {
      console.error('Error editing password:', error);
      openSnackbar('Failed to edit password', 'error');
    }
  };

  // Handle form submission for "Add" and "Edit" modes
  const handleSubmit = (values) => {
    if (mode === 'edit') {
      updatePassword(values);
    } else {
      addPassword(values);
    }
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    platformName: Yup.string()
      .required('Platform Name is required')
      .max(112, 'Platform Name cannot exceed 112 characters'),
    username: Yup.string()
      .required('Username is required')
      .max(112, 'Username cannot exceed 112 characters'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password cannot exceed 100 characters'),
    platformUrl: Yup.string()
      // .url('Enter a valid URL')
      .required('URL is required')
      .max(200, 'URL cannot exceed 200 characters'),
    is2FArequired: Yup.boolean(),
  });

  // Default initial values for "Add" mode
  const defaultInitialValues = {
    platformName: '',
    platformUrl: '',
    username: '',
    password: '',
    is2FArequired: false,
  };

  return (
    <>
      <style>
        {`
        .MuiDialog-root {
          backdrop-filter: blur(2px); /* Apply background blur */
        }
        `}
      </style>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        fullScreen={isMobile}
        TransitionComponent={Transition}
      >
        <DialogTitle
          id="form-dialog-title"
          sx={{
            borderBottom: '1px solid',
            borderColor: 'grey.400'
          }}
        >
          {mode === 'edit' ? 'Edit' : 'Add'} Site Details
        </DialogTitle>
        {loading ? (
          <Box my={2.5} mx={3}>
            <Skeleton variant="rounded" width="100%" height={330} sx={{ background: '#E9F2FC' }} />
          </Box>
        ) : (
          <Formik
            initialValues={mode === 'edit' ? initialValues : mode === 'add-from-API' && fetchedInitialValues ? fetchedInitialValues : defaultInitialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleSubmit(values);
              setSubmitting(false);
              onClose();
            }}
          >
            {({
              values,
              errors,
              touched,
              isSubmitting,
              handleChange,
              setFieldValue,
            }) => (
              <Form>
                <DialogContent>
                  <Grid container spacing={2}>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <StyledInputLabel htmlFor="platformName">Site Name</StyledInputLabel>
                      <Field
                        as={TextField}
                        size="small"
                        name="platformName"
                        placeholder="Enter Site Name"
                        fullWidth
                        variant="outlined"
                        autoComplete="off"
                        error={touched.platformName && Boolean(errors.platformName)}
                        helperText={touched.platformName && errors.platformName}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <StyledInputLabel htmlFor="platformUrl"> Site URL</StyledInputLabel>
                      <Field
                        as={TextField}
                        size="small"
                        name="platformUrl"
                        placeholder="Enter URL"
                        fullWidth
                        variant="outlined"
                        error={touched.platformUrl && Boolean(errors.platformUrl)}
                        helperText={touched.platformUrl && errors.platformUrl}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <StyledInputLabel htmlFor="username">User Name</StyledInputLabel>
                      <Field
                        as={TextField}
                        size="small"
                        name="username"
                        placeholder="Enter Name"
                        fullWidth
                        variant="outlined"
                        autoComplete="username-new"
                        error={touched.username && Boolean(errors.username)}
                        helperText={touched.username && errors.username}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <StyledInputLabel htmlFor="password">Password</StyledInputLabel>
                      <Field
                        as={TextField}
                        size="small"
                        name="password"
                        placeholder="Enter Password"
                        fullWidth
                        variant="outlined"
                        autoComplete="new-password"
                        type={showPassword ? 'text' : 'password'}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={togglePasswordVisibility}
                                edge="end"
                                style={{ padding: '8px' }}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid size={12}>
                      <FormControlLabel
                        control={
                          <AndroidSwitch
                            checked={values.is2FArequired}
                            onChange={(event) =>
                              setFieldValue('is2FArequired', event.target.checked)
                            }
                          />
                        }
                        label="2FA Required (optional)"
                        labelPlacement="start"
                        sx={{
                          m: 0,
                          '.MuiFormControlLabel-label': {
                            fontSize: '16px',
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3, display: 'flex', gap: 2, pt: 0 }}>
                  <Button fullWidth onClick={onClose} variant="outlined">
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader width="24" /> : 'Save'}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        )}
      </Dialog>
    </>
  );
};

export default React.memo(PlatformDetailsDialog);
