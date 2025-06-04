import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';

function SchedulingGuard({ children }) {
  const openSnackbar = useOpenSnackbar();
  const account = useSelector((state) => state.account);

  if (!account.user.scheduling) {
    openSnackbar('Access Denied!', 'error');
    return <Navigate to="/login" />;
  }

  return children;
}

SchedulingGuard.propTypes = {
  children: PropTypes.any
};

export default SchedulingGuard;
