import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import sendForSignIcon from './whitesendforsign.svg';
import signForYourselfIcon from './signforyourself.svg';
import PDFPreviewComponent from './PDFPreviewComponent';
import whiteSignForYourselfIcon from './whitesignforyourself.svg';
import whiteSendForSignIcon from './whitesendforsign.svg';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import ESignComponent from './ESignComponent';
import AddSignatureComponent from './AddSignatureComponent';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Styled Components
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

const DocumentUpload = () => {
  // Form State Variables
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [file, setFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSendForSignature, setShowSendForSignature] = useState(false);
  const [showSignForYourself, setShowSignForYourself] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [signatureImage, setSignatureImage] = useState(false);

  // Navigation Handlers
  const handleBackEsign = () => {
    setShowSendForSignature(true);
  };

  const handleContinue = () => {
    if (pdfDocument) {
      setSignatureImage(true);
    } else {
      alert('Please upload a PDF file first');
    }
  };

  const handleSignForYourself = () => {
    setShowSignForYourself(true);
  };

  if (showSendForSignature) {
    return <ESignComponent />;
  }

 if (signatureImage) {
    return <AddSignatureComponent pdf={pdfDocument} />;
  }
  // File Upload Handlers
  const handleFileUpload = async (files) => {
    const selectedFile = files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);  // Set the file state here
      setPdfFile(selectedFile);
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        setPdfDocument(pdf);
      } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Error loading PDF. Please try again.');
      }
    } else {
      alert('Please upload only PDF files.');
    }
  };
  
  const loadPDF = async (pdfFile) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPdfDocument(pdf);
    } catch (error) {
      console.error('Error loading PDF:', error);
      alert('Error loading PDF. Please try again.');
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };


  // **Handle File Input Change**
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleFileUpload(files);
  };

  // **Handle Form Submission (if needed)**
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData({
      email,
      name,
      note,
      fileName: file ? file.name : 'No file uploaded',
    });
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', p: 3 }}>
      {/* {!showPreview && ( */}
      {!showPreview ? (
        <Box>
          {/* Header Cards */}
          <Box sx={{ p: 3, margin: '40px' }}>
            <Grid container justifyContent="center" style={{ gap: '40px' }}>
              <Grid item>
                <StyledCard sx={{ backgroundColor: '#1C5087' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <img
                      src={whiteSendForSignIcon}
                      alt="Send For Signature"
                      style={{ width: 48, height: 48, marginBottom: 16 }}
                    />
                    <StyledButton sx={{ color: 'white' }} fullWidth>
                      SEND FOR SIGNATURE
                    </StyledButton>
                  </CardContent>
                </StyledCard>
              </Grid>
              <Grid item>
                <StyledCard
                  sx={{
                    backgroundColor:
                      hoveredCard === 'sign' ? '#1C5087' : 'white',
                  }}
                  onMouseEnter={() => setHoveredCard('sign')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <img
                      src={
                        hoveredCard === 'sign'
                          ? whiteSignForYourselfIcon
                          : signForYourselfIcon
                      }
                      alt="Sign For Yourself"
                      style={{ width: 48, height: 48, marginBottom: 16 }}
                    />
                    <StyledButton
                      sx={{
                        color: hoveredCard === 'sign' ? 'white' : '#1C5087',
                      }}
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

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Add Document Section */}
            <Typography variant="h6" gutterBottom>
              ADD DOCUMENT
            </Typography>
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                border: '1px solid #CCCCCC !important',
                borderRadius: '2px !important',
                p: 3,
                mb: 3,
                textAlign: 'center',
                backgroundColor: dragging ? '#e0e0e0' : '#fff',
              }}
            >
              <Typography color="textSecondary">
                {file ? `File Uploaded: ${file.name}` : 'Drag File Here'}
              </Typography>
              <Button variant="text" component="label" sx={{ mt: 1 }}>
                + ADD DOCUMENT
                <input
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={handleFileInputChange}
                />
              </Button>
            </Box>

            {/* Action Buttons */}
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={handleBackEsign}>
                CLOSE
              </Button>
              <Button
                variant="contained"
                type="button"
                onClick={handleContinue}
              >
                PROCEED
              </Button>
            </Box>
          </form>
        </Box>
      ) : (
        // Show PDF Preview when showPreview is true
        <AddSignatureComponent
          pdf={pdfDocument}
        />
      )}
    </Box>
  );
};

export default DocumentUpload;
