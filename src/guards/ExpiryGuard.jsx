import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/authService';
import PropTypes from 'prop-types';
import NewSessionEndPopup from '../components/SessionEndPopup';

function ExpiryGuard({ children }) {
  const [open, setOpen] = useState(false);

  const handleBeforeUnload = (e) => {
    e.preventDefault();
    e.returnValue = '';
  };

  useEffect(() => {
    if (open) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    } else {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [open]);

  useEffect(() => {
    const handleLogout = () => {
      const logoutStatus = localStorage.getItem('logout');
      if (logoutStatus) {
        setOpen(false);
        localStorage.removeItem('logout');
      }
    };

    const checkTokenExpiry = () => {
      const token = authService.getAccessToken();
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            setOpen(true);
            localStorage.setItem('accessToken', 'no_value');
          }
        } catch (error) {
          setOpen(true);
        }
      } else {
        setOpen(true);
      }
    };

    handleLogout();

    // Check token expiry every minute
    const interval = setInterval(checkTokenExpiry, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {children}
      {open && <NewSessionEndPopup open={open} setOpen={setOpen} />}
    </>
  );
}

ExpiryGuard.propTypes = {
  children: PropTypes.any
};

export default ExpiryGuard;
