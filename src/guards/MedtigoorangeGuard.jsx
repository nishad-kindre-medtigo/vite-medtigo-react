import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';

function MedtigoOrangeGuard({ children }) {
  const openSnackbar = useOpenSnackbar();
  const { isMedtigoOrange } = useSelector(state => state.account.user);

  if (!isMedtigoOrange) {
    openSnackbar('Access Denied!', 'error');
    return <Navigate to="/home" />;
  }

  return children;
}

MedtigoOrangeGuard.propTypes = {
  children: PropTypes.any,
};

export default MedtigoOrangeGuard;
