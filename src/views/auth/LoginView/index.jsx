import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import Page from 'src/components/Page';
import LoginForm from './LoginForm';
import { AUTH_QA, AUTH_URL } from 'src/settings';
import { DetailBox } from 'src/views/dashboard/components';

function LoginView() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const urlToken = urlParams.get('admin_token') || urlParams.get('t');

  const handleSubmitSuccess = async () => {
    navigate({
      pathname: '/dashboard',
      state: {
        registered: true
      }
    });
  };

  const url = window.location.origin;

  React.useEffect(() => {
    if (url == 'https://qa.medtigo.com') {
      window.location.href = AUTH_QA;
    } else if (url == `http://localhost:${window.location.port}`) {
      return;
    } else {
      if (localStorage.getItem('reset')) {
        window.location.href = AUTH_URL + 'login/?/settings';
      } else {
        window.location.href = AUTH_URL;
      }
    }
  }, []);

  if (urlToken) {
    return (
      <Box
        sx={{
          height: '100vh',
          background: '#E9F2FC',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography variant="h4" align="center">
          Logging In ...
        </Typography>
      </Box>
    );
  }

  return (
    <Page title="Login">
      <Box
        sx={{
          height: '100vh',
          background: '#E9F2FC',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <DetailBox sx={{ p: 4, height: 'auto', background: '#fff', border: 'none' }}>
          {/* Medtigo Logo */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <RouterLink to="/">
              <img alt="Logo" src="/images/logo-white.png" width={100} height={100} />
            </RouterLink>
          </Box>

          {/* Welcome Text */}
          <Typography
            variant="h5"
            align="center"
            sx={{ fontWeight: 500, mb: 4 }}
          >
            The fastest growing healthcare community
          </Typography>

          {/* Login Form */}
          <LoginForm onSubmitSuccess={handleSubmitSuccess} />
        </DetailBox>
      </Box>
    </Page>
  );
}

export default LoginView;
