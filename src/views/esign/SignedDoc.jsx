import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import Page from 'src/components/Page';
 
function Error404View() {
  return (
    <Page title="404: Not found">
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          background: '#ffffff'
        }}
      >
        <Typography style={{ fontSize: '32px', fontWeight: 'bold', marginTop:'10px' }}>
        Your document has already been signed
        </Typography>
        <Box style={{margin:'30px'}}>
          <img
            alt="Under development"
            src="/images/documentsigned.svg"
            style={{ maxWidth: '100%', width: 560, height: 'auto' }}
          />
        </Box>
      </Box>
    </Page>
  );
}
 
export default Error404View;