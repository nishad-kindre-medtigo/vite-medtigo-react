import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { grey, blue, green, red, orange } from '@mui/material/colors';

const colorStyles = {
  primary: {
    color: blue[700],
    backgroundColor: blue[50],
  },
  secondary: {
    color: grey[700],
    backgroundColor: grey[200],
  },
  error: {
    color: red[700],
    backgroundColor: red[50],
  },
  success: {
    color: green[700],
    backgroundColor: green[50],
  },
  warning: {
    color: orange[700],
    backgroundColor: orange[50],
  },
};

const styles = {
  root: {
    alignItems: 'center',
    borderRadius: 2,
    display: 'inline-flex',
    flexGrow: 0,
    whiteSpace: 'nowrap',
    cursor: 'default',
    flexShrink: 0,
    fontSize: '0.875rem',
    fontWeight: 500,
    height: 20,
    justifyContent: 'center',
    letterSpacing: 0.5,
    minWidth: 20,
    padding: '4px 8px',
    textTransform: 'uppercase',
  },
};

function NewLabel({ className, color = 'secondary', children, style, ...rest }) {
  const combinedStyles = {
    ...styles.root,
    ...(colorStyles[color] || colorStyles.secondary),
    ...style,
  };

  return (
    <span className={clsx(className)} style={combinedStyles} {...rest}>
      {children}
    </span>
  );
}

NewLabel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
  color: PropTypes.oneOf(['primary', 'secondary', 'error', 'warning', 'success']),
};

export default NewLabel;
