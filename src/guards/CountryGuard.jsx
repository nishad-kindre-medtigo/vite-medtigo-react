import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useOpenSnackbar } from '../hooks/useOpenSnackbar';

function CountryGuard({ children }) {
  const account = useSelector((state) => state.account);
  const openSnackbar = useOpenSnackbar();

  if (account.user.country !== 'United States') {
    openSnackbar('Only accessible to United States Users!', 'error');
    return <Navigate to="/home" />;
  }

  return children;
}

CountryGuard.propTypes = {
  children: PropTypes.any
};

export default CountryGuard;
