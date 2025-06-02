import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';

const BackButtonWithTitle = ({ title, onBack }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <Box mb={2} display="flex" alignItems="center">
      <IconButton
        onClick={handleBackClick}
        aria-label="back"
        style={{ padding: '4px', marginRight: '8px' }}
      >
        <ArrowBackIosRoundedIcon style={{ color: '#3A3A3A' }}/>
      </IconButton>
      <Typography component="span" style={{ cursor: 'pointer', fontSize: '24px', fontWeight: 600 }} onClick={handleBackClick}>
        {title}
      </Typography>
    </Box>
  );
};

export default BackButtonWithTitle;
