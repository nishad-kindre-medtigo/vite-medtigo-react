import React from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { Formik, Field, ErrorMessage } from 'formik';
import { Stack, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Loader } from '../../../ui/Progress';
import { login } from '../../../actions/accountActions';
import useBreakpoints from '../../../hooks/useBreakpoints';
import encrypt from '../../../utils/encrypt';

function LoginForm({ onSubmitSuccess, ...rest }) {
  const { isMobile } = useBreakpoints();
  const dispatch = useDispatch();
  const theme = useTheme(); // Access the theme

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Must be a valid email')
          .max(255)
          .required('Email is required'),
        password: Yup.string().max(255).required('Password is required'),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // Encrypting credentials
          const encryptedPassword = encrypt(values.password);
          const encryptedEmail = encrypt(values.email);

          await dispatch(login(encryptedEmail, encryptedPassword, isMobile));
          onSubmitSuccess();
        } catch (error) {
          const message = error || 'Something went wrong';
          setStatus({ success: false });
          setErrors({ submit: message });
          setSubmitting(false);
        }
      }}
    >
      {({ handleSubmit, isSubmitting, errors }) => (
        <form noValidate onSubmit={handleSubmit} {...rest}>
          <Stack spacing={2}>
            <div>
              <Typography>Email Address*</Typography>
              <Field
                as="input"
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                className="form-control"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: `1px solid ${errors.email ? theme.palette.error.main : '#ccc'}`,
                }}
              />
              <ErrorMessage
                name="email"
                component="div"
                style={{ color: theme.palette.error.main, fontSize: '12px', marginTop: '5px' }}
              />
            </div>

            <div>
              <Typography>Password*</Typography>
              <Field
                as="input"
                id="password"
                name="password"
                type="password"
                placeholder="•••••••••"
                className="form-control"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: `1px solid ${errors.password ? theme.palette.error.main : '#ccc'}`,
                }}
              />
              <ErrorMessage
                name="password"
                component="div"
                style={{ color: theme.palette.error.main, fontSize: '12px', marginTop: '5px' }}
              />
            </div>

            {errors.submit && (
              <div style={{ color: theme.palette.error.main, fontSize: '14px', marginTop: '5px' }}>
                {errors.submit}
              </div>
            )}

            <Button
              sx={{ height: '40px' }}
              fullWidth
              type="submit"
              variant="contained"
            >
              {isSubmitting ? <Loader width="24" /> : 'SIGN IN'}
            </Button>
          </Stack>
        </form>
      )}
    </Formik>
  );
}

export default LoginForm;
