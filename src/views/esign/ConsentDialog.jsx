import React, { useState } from 'react';
import {
  Checkbox,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  CircularProgress,
  useTheme, useMediaQuery
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import eSignatureService from '../../services/esignatureService';
import alertPage from '../../services/alertPage';
import SendForSignatureComponent from './SendForSignatureComponent';
import HistoryPage from './HistoryPage';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useOpenSnackbar } from "../../hooks/useOpenSnackbar"

const theme = createTheme({
  typography: {
    fontFamily: '"Segoe UI", Arial, sans-serif'
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '4px',
          padding: '8px 24px'
        },
        containedPrimary: {
          backgroundColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#1565c0'
          }
        }
      }
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#1976d2'
        }
      }
    }
  }
});

export const ConsentDialog = ({
  pdfFilename,
  handleDownloadPDF,
  signatureID,
  senderID,
  recipientEmail,
  onFinish,
  signatureAddedCount,
  dateAddedCount,
  nameAddedCount,
  coordinateCounts,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [redirectToHistory, setRedirectToHistory] = useState(false);
  const navigate = useNavigate();
  const openSnackbar = useOpenSnackbar();
  const theme = useTheme();
  const [showRedirectDialog, setShowRedirectDialog] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const handleCheckboxChange = event => {
    setIsChecked(event.target.checked);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAgreeAndContinue = () => {
    setIsChecked(true);
    setHasAgreed(true);
    setOpenDialog(false);
  };

  const certificateId = sessionStorage.getItem('Certificate_Id');
          const taskId = sessionStorage.getItem('Task_Id');
          const taskType = sessionStorage.getItem('Task_Type');
        
          const handleRedirectToHistory = () => {
            setRedirectToHistory(true);
          };


          const handleCloseRedirectDialog = () => {
            setShowRedirectDialog(false);
          };
          
          const handleFinish = async () => {
            if (isProcessing) {
                openSnackbar('Your request is already being processed', 'info');
                return;
            }
        
            if (
                signatureAddedCount !== coordinateCounts.signatureCount ||
                dateAddedCount !== coordinateCounts.dateCount ||
                nameAddedCount !== coordinateCounts.fullnameCount
            ) {
                openSnackbar('Please fill in all required fields before submitting.', 'warning');
                return;
            }
        
            setIsProcessing(true);
            setIsLoading(true);
        
            try {
              const getLocation = () => {
                  console.log('Starting geolocation request...');
                  return new Promise((resolve, reject) => {
                      if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                              (position) => {
                                  console.log('Geolocation successful:', position.coords);
                                  resolve(position.coords);
                              },
                              (error) => {
                                  console.error('Geolocation error in promise:', error);
                                  reject(error);
                              },
                              { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 } // Added options for better accuracy
                          );
                      } else {
                          console.error('Geolocation not supported by browser');
                          reject(new Error('Geolocation is not supported by this browser.'));
                      }
                  });
              };
          
              let coords;
              try {
                  console.log('Awaiting geolocation...');
                  coords = await getLocation();
                  console.log('Coordinates received:', coords);
              } catch (error) {
                  console.error('Location error caught:', error);
                  console.log('Error code:', error.code, 'Error message:', error.message);
                  if (error.code === error.PERMISSION_DENIED) {
                      // Location permission denied, show the custom message
                      openSnackbar('Please enable location for completing signature successfully', 'error');
                    } else {
                      // General geolocation error (e.g., not supported)
                      openSnackbar('Unable to retrieve location. Please ensure geolocation is enabled.', 'error');
                    }
                  setIsProcessing(false);
                  setIsLoading(false);
                  return;
              }
          
              const { latitude, longitude } = coords;
              console.log('Extracted coordinates - Latitude:', latitude, 'Longitude:', longitude);
              
              const getAddress = async (lat, lon) => {
                  console.log('Starting reverse geocoding for coords:', lat, lon);
                  try {
                      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
                      console.log('Requesting geocoding from URL:', url);
                      
                      const response = await fetch(url);
                      console.log('Geocoding response status:', response.status);
                      
                      if (!response.ok) {
                          console.error('Geocoding request failed with status:', response.status);
                          throw new Error(`Geocoding request failed with status: ${response.status}`);
                      }
                      
                      const data = await response.json();
                      console.log('Full geocoding response data:', data);
                      console.log('Address data:', data.address);
                      
                      return {
                          city: data.address.city || data.address.town || data.address.village || 'Unknown',
                          state: data.address.state || 'Unknown',
                          country: data.address.country || 'Unknown',
                      };
                  } catch (error) {
                      console.error('Geocoding error:', error);
                      console.error('Error message:', error.message);
                      return {
                          city: 'Unknown',
                          state: 'Unknown',
                          country: 'Unknown',
                      };
                  }
              };
          
              console.log('Calling getAddress function...');
              const locationData = await getAddress(latitude, longitude);
              console.log('Location data retrieved:', locationData);
          
              console.log('Generating PDF...');
              const pdfBlob = await handleDownloadPDF(true);
              console.log('PDF blob created, size:', pdfBlob.size);
              
              const formData = new FormData();
              formData.append('file', new File([pdfBlob], pdfFilename, { type: 'application/pdf' }));
              formData.append('create', 'false');
              formData.append('recipientEmail', recipientEmail);
              formData.append('senderID', senderID);
          
              // Add Location Data to FormData
              formData.append('city', locationData.city);
              formData.append('state', locationData.state);
              formData.append('country', locationData.country);
              console.log('FormData prepared with location:', locationData.city, locationData.state, locationData.country);
          
              console.log('Sending signature update request...');
              const response = await eSignatureService.updateSignature(signatureID, formData);
              console.log('Signature update response:', response);
          
              if (!response.status) {
                  console.error('Signature update failed:', response);
                  throw new Error('Signature update failed');
              }
              const downloadUrl = URL.createObjectURL(pdfBlob);
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.download = pdfFilename;
              link.click();
              URL.revokeObjectURL(downloadUrl);
          
              if (certificateId && taskId && taskType) {
                  const certificateData = {
                      Certificate_Id: certificateId,
                      Task_Id: taskId,
                      Task_Type: taskType,
                      Comment: '',
                  };
          
                  console.log('Sending certificate task user response:', certificateData);
                  try {
                      const certResponse = await alertPage.certificateTaskUserResponse(certificateData, []);
                      console.log('Certificate task response:', certResponse);
                  } catch (certError) {
                      console.error('Certificate task error:', certError);
                  }
          
                  sessionStorage.removeItem('Certificate_Id');
                  sessionStorage.removeItem('Task_Id');
                  sessionStorage.removeItem('Task_Type');
              }
              
              // onFinish();
              setHasAgreed(false);
              openSnackbar('Signature is completed successfully!');
          
              if (isMobile) {
                  setShowRedirectDialog(true);
              } else {
                  // For desktop, directly navigate to history without showing the dialog
                  console.log('Preparing to redirect to history...');
                  setTimeout(() => {
                      handleRedirectToHistory();
                  }, 1000); // Small delay to allow the success message to be seen
              }
          } catch (error) {
                console.error('Main error in handleFinish:', error);
                openSnackbar(error.message || String(error), 'error');
            } finally {
                setIsProcessing(false);
                setIsLoading(false);
            }
        };
        
        
  
  
  if (redirectToHistory) {
    // Render the HistoryPage component directly
    navigate('/e-sign/history');
  }
  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 9999
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </ThemeProvider>
    );
  }

  if (hasAgreed) {
    return (
      <ThemeProvider theme={theme}>
        <Box style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: isMobile ? '16px 28px' : '16px 180px',
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: '#fff',
            borderTop: '1px solid rgba(0, 0, 0, 0.12)',
            zIndex: 1200
          }}>
          <Button
            variant="contained"
            onClick={handleFinish}
            style={{
              borderRadius: '2px',
              whiteSpace: 'nowrap',
              minWidth: 'fit-content',
              width: isMobile ? '100%' : 'auto',
              padding: isMobile ? '12px 16px' : '8px 22px',
              fontSize: isMobile ? '14px' : '16px',
              backgroundColor:'#2872C1'
            }}
            disabled={isProcessing || isLoading}
          >
            FINISH
          </Button>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          borderTop: '1px solid rgba(0, 0, 0, 0.12)',
          boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.1)',
          zIndex: 1200
        }}
      >
      <Box
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          padding: isMobile ? '16px' : '24px 150px',
          gap: isMobile ? '16px' : '24px'
        }}
      >
       <FormControlLabel
  control={
    <Checkbox
      checked={isChecked}
      onChange={handleCheckboxChange}
      style={{
        position: 'relative',
        bottom: isMobile ? '4px' : '5px',
        height: isMobile ? '24px' : '30px',
        width: isMobile ? '24px' : '30px',
      }}
    />
  }
  label={
    <Typography 
      style={{ 
        fontSize: isMobile ? '13px' : '16px',
        lineHeight: '1.5',
        marginRight: isMobile ? '8px' : '0'
      }}
    >
      I confirm that I have read and understood the{' '}
      <span
        style={{
          textDecoration: 'underline',
          color: '#000',
          cursor: 'pointer',
          fontWeight: 500,
          display: 'inline',
          fontSize: isMobile ? '13px' : '16px',
        }}
        onClick={(e) => {
          e.preventDefault(); // Prevent event bubbling
          handleOpenDialog();
        }}
      >
        electronic record and signature disclosure
      </span>{' '}
      and consent to use electronic record and signatures.
    </Typography>
  }
  style={{
    marginRight: 0,
    alignItems: 'flex-start',
  }}
/>

      <Button
        variant="contained"
        onClick={handleAgreeAndContinue}
        disabled={!isChecked}
        style={{
          borderRadius: '2px',
          whiteSpace: 'nowrap',
          minWidth: 'fit-content',
          width: isMobile ? '100%' : 'auto',
          padding: isMobile ? '12px 16px' : '8px 22px',
          fontSize: isMobile ? '14px' : '16px',
        }}
      >
        AGREE AND CONTINUE
      </Button>
      </Box>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            style={{
              fontWeight: 600,
              backgroundColor: '#2872C1',
              color: '#fff'
            }}
          >
            Terms & conditions
          </DialogTitle>
          <DialogContent>
            <Typography style={{ fontWeight: 500, fontSize: '18px' }}>
              Electronic documents
            </Typography>
            <Typography style={{ fontSize: '14px' }}>
            {`Please note that medtigo ("we", "us" or "Company") will send all
              documents electronically to you to the email address that you have
              given us during the course of the business relationship unless you
              tell us otherwise in accordance with the procedure explained
              herein. Once you sign a document electronically, we will send a
              PDF version of the document to you.`}
            </Typography>

            <Typography style={{ fontWeight: 500, fontSize: '18px' }}>
              Request for paper copies
            </Typography>
            <Typography style={{ fontSize: '14px' }}>
              You have the right to request paper copies of these documents sent
              to you electronically from Support@medtigo.com Alternatively, you
              also have the ability to download and print these documents sent
              to you electronically, and re-upload a scanned copy of the printed
              and physically signed documents. If you, however, wish to request
              paper copies of these documents sent to you electronically, you
              can write back to the sender.
            </Typography>

            <Typography style={{ fontWeight: 500, fontSize: '18px' }}>
              Withdrawing your consent
            </Typography>
            <Typography style={{ fontSize: '14px' }}>
              At any point in time during the course of our business
              relationship, you have the right to withdraw your consent to
              receive documents in electronic format. If you wish to withdraw
              your consent, you can decline to sign a document that we have sent
              to you and send an email to Support@medtigo.com informing us that
              you wish to receive documents only in paper format. Upon request
              from you, we will stop sending documents using medtigo Sign
              electronic signature system.
            </Typography>
            <Typography style={{ fontWeight: 500, fontSize: '18px' }}>
              To advise medtigo of your new email address
            </Typography>
            <Typography style={{ fontSize: '14px' }}>
              If you need to change the email address that you use to receive
              notices and disclosures from us, write to us at
              Support@medtigo.com.
            </Typography>
            <Typography style={{ fontWeight: 500, fontSize: '18px' }}>
              System requirements
            </Typography>
            <Typography style={{ fontSize: '14px' }}>
              Compatible with recent versions of popular browsers such as
              Chrome, Firefox, Safari, and Internet Explorer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
            <Button
              onClick={handleAgreeAndContinue}
              variant="contained"
              style={{
                backgroundColor: '#2872C1',
              }}
            >
              AGREE & CONTINUE
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={showRedirectDialog}
          // Removed onClose handler to prevent closing
          maxWidth="xs"
          fullWidth
          // Prevent closing on backdrop click or escape key
          disableBackdropClick
          disableEscapeKeyDown
        >
          <DialogTitle
            style={{
              fontWeight: 600,
              backgroundColor: '#2872C1',
              color: '#fff'
            }}
          >
            Signature Completed
          </DialogTitle>
          <DialogContent>
            <Typography style={{ marginTop: '16px', marginBottom: '16px' }}>
              Your document has been signed successfully.
            </Typography>
          </DialogContent>
          <DialogActions>
            {/* Removed close button */}
            <Button
              onClick={handleRedirectToHistory}
              variant="contained"
              style={{
                backgroundColor: '#2872C1',
              }}
            >
              View History
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default ConsentDialog;
