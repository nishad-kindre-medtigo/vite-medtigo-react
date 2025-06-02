import React from 'react';

const Logo = (props) => {
  const full = props.full;
  const isWhite = props.isWhite || false;
  const customWidth = props.width || 45;
  return (
    <img
      alt="Logo"
      src={`/${full ? 'images/logo.png' : (isWhite ? 'images/logo-white.png' : 'logo.png')}`}
      style={{ width: customWidth, height: customWidth === 45 ? 45 : 'auto', maxWidth: 'auto' }}
      {...props}
    />
  );
};

export default Logo;
