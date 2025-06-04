import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { SERVER_URL } from 'src/settings';

function ImageViewer() {
  const [attachment, setAttachment] = useState(null);
  const [type, setType] = useState('img');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    const attachmentUrl = queryParams.get('attachement');
    if (attachmentUrl) {
      setAttachment(`${SERVER_URL}${attachmentUrl}`);
      if (attachmentUrl.match(/\.(jpg|jpeg|png)$/i)) {
        setType('img');
      } else if (attachmentUrl.match(/\.pdf$/i)) {
        setType('pdf');
      } else {
        setType('download');
      }
    }
  }, [queryParams]);

  useEffect(() => {
    if (type === 'download' && attachment) {
      window.open(attachment, '_blank');
    }
  }, [type, attachment]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        flexDirection: 'column',
        background: '#F8F9FA'
      }}
    >
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#fff' }}>
        <Toolbar>
          <a href="http://medtigo.com/" aria-label="home">
            <img src="/images/logo.png" alt="Logo" width="168px" />
          </a>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Box
        sx={{
          width: '80%',
          height: '90%',
          overflow: 'auto',
          padding: 2,
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: 4
        }}
      >
        {type === 'img' && (
          <img
            src={attachment}
            alt="Attachment"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        )}
        {type === 'pdf' && (
          <object
            data={attachment}
            type="application/pdf"
            width="100%"
            height="100%"
          >
            <Typography>
              PDF cannot be displayed.{' '}
              <a href={attachment} target="_blank" aria-label="pdf" rel="noopener noreferrer">
                Download PDF
              </a>
            </Typography>
          </object>
        )}
        {type === 'download' && (
          <Button
            variant="contained"
            color="primary"
            href={attachment}
            target="_blank"
            sx={{
              textTransform: 'none'
            }}
          >
            Download Attachment
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default ImageViewer;
