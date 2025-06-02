import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useOpenSnackbar } from '../../hooks/useOpenSnackbar';
import { Box, Button, Grid, Typography, TextField } from '@mui/material';
import authService from '../../services/authService';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_REACT_APP_ENCRYPTION_KEY;

function Security({ className, ...rest }) {
  const openSnackbar = useOpenSnackbar();

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mt: 2,
        py: { xs: 2, sm: 4 },
        backgroundColor: '#f5f5f5' // Light background color
      }}
    >
      <Box
        sx={{
          width: { xs: '70%', sm: '40%' }
        }}
      >
        <Formik
          initialValues={{
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }}
          validationSchema={Yup.object().shape({
            currentPassword: Yup.string().required('Required'),
            newPassword: Yup.string()
              .required('Required')
              .min(
                8,
                'Use 8 or more characters with a mix of letters, numbers & symbols'
              )
              .max(255, 'Password must not exceed 255 characters')
              .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_=+<>]).{8,}$/,
                'Password must include uppercase, lowercase, number, and special character'
              )
              .test(
                'different-from-current',
                'New password must be different from current password',
                function(value) {
                  return value !== this.parent.currentPassword;
                }
              ),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
              .required('Required')
          })}
          onSubmit={async (
            values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              // Encrypting Password
              const encryptedValues = {
                currentPassword: CryptoJS.AES.encrypt(
                  values.currentPassword,
                  ENCRYPTION_KEY
                ).toString(),
                newPassword: CryptoJS.AES.encrypt(
                  values.newPassword,
                  ENCRYPTION_KEY
                ).toString(),
                confirmPassword: CryptoJS.AES.encrypt(
                  values.confirmPassword,
                  ENCRYPTION_KEY
                ).toString()
              };

              await authService.changePassword(encryptedValues);
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              openSnackbar('Password updated successfully');

              if (localStorage.getItem('medtigo')) {
                localStorage.removeItem('reset');
                window.location.href = 'https://medtigo.com/';
                localStorage.removeItem('medtigo');
              } else {
                localStorage.removeItem('medtigo');
              }
            } catch (error) {
              resetForm();
              setStatus({ success: false });
              setErrors({ submit: error });
              setSubmitting(false);

              openSnackbar(
                error.response?.data?.message || 'Current password is incorrect', 'error'
              );
            }
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values
          }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" textAlign="center">
                    Change Password
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    size="small"
                    error={Boolean(
                      touched.currentPassword && errors.currentPassword
                    )}
                    helperText={
                      touched.currentPassword && errors.currentPassword
                    }
                    label="Current Password"
                    name="currentPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="password"
                    value={values.currentPassword || ''}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    size="small"
                    error={Boolean(touched.newPassword && errors.newPassword)}
                    helperText={touched.newPassword && errors.newPassword}
                    label="New Password"
                    name="newPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="password"
                    value={values.newPassword || ''}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    size="small"
                    error={Boolean(
                      touched.confirmPassword && errors.confirmPassword
                    )}
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                    label="Confirm Password"
                    name="confirmPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="password"
                    value={values.confirmPassword || ''}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid
                  item
                  container
                  xs={12}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                  >
                    {isSubmitting ? 'Submitting...' : 'Change Password'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}

Security.propTypes = {
  className: PropTypes.string
};

export default Security;
