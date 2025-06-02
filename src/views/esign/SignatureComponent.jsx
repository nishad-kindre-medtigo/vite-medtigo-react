import React, { useState } from 'react';
import { Box, Tab, Tabs, TextField, Button, Typography } from '@mui/material';
import SignatureCanvas from 'react-signature-canvas';

const SignatureComponent = () => {
  const [tabValue, setTabValue] = useState(0);
  const [typedSignature, setTypedSignature] = useState('');
  const [selectedFont, setSelectedFont] = useState(0);
  const [uploadedSignature, setUploadedSignature] = useState(null);
  const [signatureRef, setSignatureRef] = useState(null);

  const fonts = [
    { name: 'Script', style: 'cursive' },
    { name: 'Formal', style: 'serif' },
    { name: 'Casual', style: 'sans-serif' },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTypedSignatureChange = (event) => {
    setTypedSignature(event.target.value);
  };

  const handleFontChange = (index) => {
    setSelectedFont(index);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedSignature(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const clearSignature = () => {
    if (tabValue === 1 && signatureRef) {
      signatureRef.clear();
    } else if (tabValue === 0) {
      setTypedSignature('');
    } else if (tabValue === 2) {
      setUploadedSignature(null);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 400, margin: 'auto' }}>
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="TYPE" />
        <Tab label="DRAW" />
        <Tab label="UPLOAD" />
      </Tabs>

      <Box sx={{ p: 2 }}>
        {tabValue === 0 && (
          <Box>
            <TextField
              fullWidth
              label="Signature"
              value={typedSignature}
              onChange={handleTypedSignatureChange}
              margin="normal"
            />
            <Box sx={{ mt: 2 }}>
              {fonts.map((font, index) => (
                <Button
                  key={font.name}
                  variant={selectedFont === index ? 'contained' : 'outlined'}
                  onClick={() => handleFontChange(index)}
                  sx={{ mr: 1, mb: 1 }}
                >
                  {font.name}
                </Button>
              ))}
            </Box>
            <Typography
              variant="h5"
              sx={{
                mt: 2,
                fontFamily: fonts[selectedFont].style,
                minHeight: 50,
              }}
            >
              {typedSignature}
            </Typography>
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <SignatureCanvas
              ref={(ref) => setSignatureRef(ref)}
              canvasProps={{ width: 400, height: 200, className: 'signature-canvas' }}
            />
          </Box>
        )}

        {tabValue === 2 && (
          <Box>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span">
                Upload Signature
              </Button>
            </label>
            {uploadedSignature && (
              <Box sx={{ mt: 2 }}>
                <img src={uploadedSignature} alt="Uploaded Signature" style={{ maxWidth: '100%' }} />
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={clearSignature}>
            Cancel
          </Button>
          <Button variant="contained" color="primary">
            OK
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SignatureComponent;