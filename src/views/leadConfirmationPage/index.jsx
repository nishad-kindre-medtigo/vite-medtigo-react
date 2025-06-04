import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'src/utils/axios';
import { Box, Typography } from '@mui/material';

const LeadConfirmation = () => {
  const { token } = useParams();
  const confirmLink = `/leadActions/getMailConfirmation/${token}`;

  useEffect(() => {
    updateLeadStatus();
  }, [token]);

  const updateLeadStatus = async () => {
    try {
      await axios.get(confirmLink);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        justifyContent: 'center',
        background: '#F8F9FA'
      }}
    >
      {/* Header */}
      <img
        src="https://medtigo.com/wp-content/uploads/2024/05/medtigo_2-1.svg"
        alt="Medtigo Logo"
        height="50px"
        width="168px"
      />

      {/* Content */}
      <Box
        sx={{
          maxWidth: 600,
          width: '100%',
          background: 'white',
          borderRadius: 2,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          p: 4
        }}
      >
        <Box sx={{ mb: 2 }}>
          <img
            alt="mail icon"
            src="/images/mailIcon.png"
            style={{ width: '50px' }}
          />
        </Box>
        <Typography variant="h6" gutterBottom>
          Thank you for confirming your licensing purchase.
        </Typography>
        <Typography variant="body1">
          Our licensing team will be reaching out to you with the next steps.
        </Typography>
      </Box>
    </Box>
  );
};

export default LeadConfirmation;
