import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

function Header({ syllabusName }) {
  return (
    <Typography
      sx={{
        mt: 2,
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 600
      }}
    >
      {syllabusName} - SYLLABUS READER
    </Typography>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
