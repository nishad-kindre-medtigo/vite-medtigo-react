import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import orderServices from '../services/orderServices';
import { useLocation } from 'react-router-dom';

function CMEGuard({ children }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const courseID = params.get('courseID');
  const hash = params.get('hash');

  orderServices
    .validateService({
      hash: hash,
      course: courseID
    })
    .then((res) => {
      if (!hash) {
        return <Navigate to="/home" />;
      }
    });

  return children;
}

CMEGuard.propTypes = {
  children: PropTypes.any
};

export default CMEGuard;
