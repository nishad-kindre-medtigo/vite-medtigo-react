import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';

function AdminGuard({ children }) {
  const user = useSelector((state) => state.account.user);
  const openSnackbar = useOpenSnackbar();
  const allowAccess = user.role == 'admin' || user.role == 'hospital_admin' || user.role == 'department_admin';

  if (!allowAccess) {
    openSnackbar('Access Denied!', 'error');
    return <Navigate to="/login" />;
  }

  return children;
}

AdminGuard.propTypes = {
  children: PropTypes.any
};

export default AdminGuard;
