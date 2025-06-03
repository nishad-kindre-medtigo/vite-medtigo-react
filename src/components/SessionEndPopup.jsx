import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import CryptoJS from 'crypto-js';
import authService from '../services/authService';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import { FadeTransition } from '../layouts/NewLayout/TopBar/SearchBar';
import { Loader } from '../ui/Progress';
import { Grid, Button, Typography, Dialog, DialogTitle, DialogContent, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { StyledInputLabel, CustomTextfield } from '../views/new_staffing/components';
import useBreakpoints from 'src/hooks/useBreakpoints';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

const NewSessionEndPopup = ({ open, setOpen }) => {
  const { email } = useSelector(state => state.account.user);
  const openSnackbar = useOpenSnackbar();
  const { isTablet } = useBreakpoints();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid Email')
      .required('Required*'),
    password: Yup.string()
      .max(255)
      .required('Required*')
  });

  const handleSubmit = async ({ email: inputEmail, password }) => {
    setIsSubmitting(true);
    try {
      if (inputEmail !== email) {
        openSnackbar('Email mismatch. Please check and try again.', 'error');
        return;
      }

      const encryptedEmail = CryptoJS.AES.encrypt( inputEmail, ENCRYPTION_KEY ).toString();
      const encryptedPassword = CryptoJS.AES.encrypt( password, ENCRYPTION_KEY ).toString();

      await authService.loginWithEmailAndPassword( encryptedEmail, encryptedPassword);

      authService.refreshToken('2h');
      openSnackbar('Login Successful');
      setOpen(false);
    } catch (error) {
      openSnackbar(error.message || 'Incorrect email or password. Please try again', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={FadeTransition}
      maxWidth={false}
      disableEnforceFocus
      PaperProps={{ style: { maxWidth: '500px' } }}
    >
      <DialogTitle align="center">
        <img src="/images/session_end_blue.svg" alt="Session End" />
        <Typography variant="h6" fontWeight={600}>
          Your session has ended
        </Typography>
        <Typography variant="body1" fontWeight={500} color="text.secondary">
          Please Log In Again
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{ email: email || '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form>
              <Grid container spacing={1} px={1} justifyContent="center">
                <Grid size={12}>
                  <StyledInputLabel htmlFor="email">Email</StyledInputLabel>
                  <Field
                    as={CustomTextfield}
                    id="email"
                    name="email"
                    fullWidth
                    size="small"
                    variant="outlined"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    placeholder="Enter Email"
                  />
                </Grid>
                <Grid size={12}>
                  <StyledInputLabel htmlFor="password">
                    Password
                  </StyledInputLabel>
                  <Field
                    as={CustomTextfield}
                    id="password"
                    name="password"
                    fullWidth
                    size="small"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    placeholder="Enter Password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={togglePasswordVisibility} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid size={12} mt={1} align="center">
                  <Button
                    type="submit"
                    variant="contained"
                    disableElevation
                    sx={{ minWidth: '140px' }}
                  >
                    {isSubmitting ? <Loader width="24" /> : 'LOG IN'}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

NewSessionEndPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired
};

export default NewSessionEndPopup;
