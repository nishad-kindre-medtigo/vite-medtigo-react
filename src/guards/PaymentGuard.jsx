import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useOpenSnackbar } from '../hooks/useOpenSnackbar';

function PaymentGuard({ children }) {
  const openSnackbar = useOpenSnackbar();
  const { showSchedulingPayment, scheduling } = useSelector(state => state.account.user);

  if (!showSchedulingPayment || !scheduling) {
    openSnackbar('Access Denied!', 'error');
    return <Navigate to="/login" />;
  }

  return children;
}

PaymentGuard.propTypes = {
  children: PropTypes.any,
};

export default PaymentGuard;
