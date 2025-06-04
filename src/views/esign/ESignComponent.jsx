import React, { useState } from 'react';
import { Card, CardContent, Button, Grid, Box,} from '@mui/material';
import DocumentUpload from './DocumentUpload';
import SendForSignatureComponent from './SendForSignatureComponent';

const signForYourselfIcon = '/icons/esign/signforyourself.svg';
const whiteSignForYourselfIcon = '/icons/esign/whitesignforyourself.svg';
const sendForSignIcon = '/icons/esign/sendforsign.svg';
const whiteSendForSignIcon = '/icons/esign/whitesendforsign.svg';

const StyledCard = (props) => (
  <Card
    {...props}
    sx={{
      width: '231px',
      height: '193px',
      borderRadius: '2px',
      border: (theme) => `1px solid ${theme.palette.primary.main}`,
      boxShadow: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'background-color 0.3s ease',
    }}
  />
);

const StyledButton = (props) => (
  <Button
    {...props}
    sx={{
      border: 'none',
      textDecoration: 'underline',
      fontFamily: 'Poppins',
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '24px',
      letterSpacing: '0.03em',
      transition: 'color 0.3s ease',
    }}
  />
);

const ESignComponent = () => {
  const [showSendForSignature, setShowSendForSignature] = useState(false);
  const [showSignForYourself, setShowSignForYourself] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleSendForSignature = () => {
    setShowSendForSignature(true);
  };

  const handleSignForYourself = () => {
    setShowSignForYourself(true);
  };

  if (showSignForYourself) {
    return <DocumentUpload />;
  }

  if (showSendForSignature) {
    return <SendForSignatureComponent />;
  }

  return (
    <Box sx={{ bgcolor: '#F9F9F9', padding:'60px'}}>
      <Grid container justifyContent="center" style={{ gap: '40px' }}>
        <Grid>
          <StyledCard
            sx={{ backgroundColor: hoveredCard === 'send' ? '#1C5087' : 'white' }}
            onMouseEnter={() => setHoveredCard('send')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={handleSendForSignature} style={{cursor: 'pointer'}}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <img
                src={hoveredCard === 'send' ? whiteSendForSignIcon : sendForSignIcon}
                alt="Send For Signature"
                style={{ width: 48, height: 48, marginBottom: 16 }}
              />
              <StyledButton
                sx={{ color: hoveredCard === 'send' ? 'white' : '#1C5087' }}
                fullWidth
                onClick={handleSendForSignature}
              >
                SEND FOR SIGNATURE
              </StyledButton>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid>
          <StyledCard
            sx={{ backgroundColor: hoveredCard === 'sign' ? '#1C5087' : 'white' }}
            onMouseEnter={() => setHoveredCard('sign')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={handleSignForYourself} style={{cursor: 'pointer'}}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <img
                src={hoveredCard === 'sign' ? whiteSignForYourselfIcon : signForYourselfIcon}
                alt="Sign For Yourself"
                style={{ width: 48, height: 48, marginBottom: 16 }}
              />
              <StyledButton
                sx={{ color: hoveredCard === 'sign' ? 'white' : '#1C5087' }}
                fullWidth
                onClick={handleSignForYourself}
              >
                SIGN FOR YOURSELF
              </StyledButton>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ESignComponent;
