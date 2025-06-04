import React, { useState, useRef } from 'react';
import { Button, TextField, Typography, Box,useTheme, useMediaQuery} from '@mui/material';
import PDFPreviewComponent from './PDFPreviewComponent';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import eSignatureService from 'src/services/esignatureService';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import HistoryPage from './HistoryPage';
import { Slide, IconButton } from '@mui/material';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const FileuploadIcon = '/icons/esign/FileuploadIcon.svg';

export const StyledTextField = (props) => (
  <TextField
    {...props}
    sx={{
      '& .MuiInputBase-root': {
        borderBottom: 'none',
        borderRadius: '2px',
        background: '#fff',
      },
      '& .MuiInputBase-input': {
        padding: '12.5px 14px',
      },
      '& .MuiInput-underline:before': {
        borderBottom: 'none',
      },
      '& .MuiInput-underline:after': {
        borderBottom: 'none',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'rgba(0, 0, 0, 0.23)',
        },
        '&:hover fieldset': {
          borderColor: 'primary.main', // Replace with a color string if not using theme
        },
        '&.Mui-focused fieldset': {
          borderColor: 'primary.main', // Replace with a color string if not using theme
        },
        '&.Mui-error fieldset': {
          borderColor: 'error.main', // Replace with a color string if not using theme
        },
      },
      '& .MuiInputLabel-root': {
        transform: 'translate(14px, 12px) scale(1)',
        lineHeight: '1.4375em',
        padding: '0 0 4px',
        '&.MuiInputLabel-shrink': {
          transform: 'translate(14px, -9px) scale(0.75)',
        },
      },
      '& .MuiFormHelperText-root': {
        marginLeft: 0,
        textAlign: 'left',
      },
      '& .MuiInputLabel-outlined': {
        backgroundColor: '#fff',
        paddingLeft: '4px',
        paddingRight: '4px',
      },
      '& .MuiInputLabel-shrink': {
        transform: 'translate(14px, -9px) scale(0.75)',
        backgroundColor: '#fff',
      },
    }}
  />
);

const SnackbarStyle = {
  position: 'fixed',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '400px',
  width: '100%',
  backgroundColor: '#fff',
  color: '#000',
  padding: '16px',
  borderRadius: '4px',
  boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
  textAlign: 'center',
  zIndex: 9999
};
 
const MAX_NOTE_LENGTH = 500; 
const SendForSignatureComponent = ({openHistoryFromPreview, initialTab }) => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const historyRef = useRef(null);
  const [showHistory, setShowHistory] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [title, setTitle] = useState('');
  const [dragging, setDragging] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileRef = useRef(null);
  const [pdf, setPdf] = useState(null);
  const [file, setFile] = useState(null);
  const user = useSelector(state => state.account.user);
  const [senderID,setSenderID] = useState(user.id);
  const [activeTab, setActiveTab] = useState('received');
  const navigate = useNavigate();
  const openSnackbar = useOpenSnackbar();
  const [formErrors, setFormErrors] = useState({
    email: '',
    name: '',
    title: '',
    note: ''
  });


  const styles = {
    headerBox: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      gap: isMobile ? '16px' : '0',
      width: '100%',
      marginBottom: '10px',
    },
    headerText: {
      fontFamily: 'Poppins',
      fontSize: isMobile ? '18px' : '16px',
      fontWeight: '400',
      lineHeight: isMobile ? '24px' : '0px',
      letterSpacing: '0.03em',
      color: '#000000',
    },
    recipientheaderText: {
      fontFamily: 'Poppins',
      fontSize: isMobile ? '18px' : '20px',
      fontWeight: '400',
      lineHeight: isMobile ? '24px' : '30px',
      letterSpacing: '0.03em',
      color: '#000000',
      marginBottom: isMobile ? '10px' : '16px',
    },
    historyButton: {
      fontFamily: 'Poppins',
      fontSize: isMobile ? '16px' : '16px',
      fontWeight: '400',
      lineHeight: isMobile ? '24px' : '30px',
      letterSpacing: '0.03em',
      color: '#2872C1',
      textTransform: 'none',
      textDecoration: 'underline',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
    },
    dropZone: {
      border: '1px solid #CCCCCC',
      padding: isMobile ? '16px' : '24px',
      marginBottom: '36px',
      position: 'relative',
      minHeight: isMobile ? '150px' : '200px',
      backgroundColor: dragging ? '#e0e0e0' : '#fff',
    },
    dropZoneContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: isMobile ? '120px' : '168px',
      paddingBottom: isMobile ? '16px' : '24px',
    },
    uploadIcon: {
      width: isMobile ? 40 : 50,
      height: isMobile ? 40 : 50,
      marginBottom: isMobile ? 12 : 16,
      color: '#CCCCCC',
    },
    recipientBox: {
      borderRadius: '2px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '12px' : '16px',
      marginBottom: '20px',
      marginTop: '20px',
    },
    fileName: {
      color: '#666',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: isMobile ? '10px' : '16px',
      maxWidth: '100%', // Allow text to truncate
      textAlign: 'center', // Center the file name
    },
    fileNameContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '16px',
      width: isMobile ? '100%' : 'auto',
      flexDirection: isMobile ? 'row' : 'row',
      justifyContent: isMobile ? 'center' : '',
    },
    fileNameWrapper: {
      display: 'flex',
      alignItems: 'center',
      maxWidth: isMobile ? 'calc(100% - 40px)' : 'none',
      overflow: isMobile ? 'hidden' : 'visible',
      flexDirection: isMobile ? 'column' : 'row', // Change direction only for mobile view
      textAlign: 'center', // Center align text
    },
    uploadedLabel: {
      color: '#666',
      marginRight: isMobile ? '0px' : '4px', // Remove margin for mobile
      fontWeight: 500,
      fontSize: isMobile ? '12px' : '16px',
    },
    removeIconWrapper: {
      display: 'flex',
      alignItems: 'center', // Align vertically in mobile view
      justifyContent: 'center',
      position: isMobile ? 'relative' : 'relative',
      top: isMobile ? '7px' : '0', // Ensure it's centered horizontally
    },
    removeIcon: {
      fontSize: isMobile ? '15px' : '20px',
      color: 'red',
    },
    
    noteCounter: {
      display: 'flex',
      marginTop: '4px',
      fontSize: '12px',
      color: note.length > MAX_NOTE_LENGTH ? '#d32f2f' : '#666666',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: isMobile ? 'center' : 'flex-end',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '12px' : '16px',
      marginTop: '24px',
    },
    continueButton: {
      border: '2px solid #2872C1',
      borderRadius: '2px',
      width: isMobile ? '100%' : 'auto',
      backgroundColor: '#2872C1',
      color: '#fff',
      padding: '8px 16px',
    },
    addDocumentButton: {
      textTransform: 'none',
      border: '2px solid #1C5087',
      borderRadius: '2px',
      color: '#1C5087',
      padding: '8px 16px',
      cursor: 'pointer',
    },
  };

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  useEffect(() => {
    const userAgent = navigator.userAgent;
    
    // Check if it's Safari but NOT Chrome on iOS or desktop
    const isSafari = (
      userAgent.indexOf("Safari") !== -1 &&
      userAgent.indexOf("Chrome") === -1 && // Exclude Chrome on desktop
      userAgent.indexOf("CriOS") === -1 &&  // Exclude Chrome on iOS
      userAgent.indexOf("Edg") === -1 &&    // Exclude Edge
      userAgent.indexOf("OPR") === -1       // Exclude Opera
    );
    
    // Only show notification for Safari users
    if (isSafari) {
      openSnackbar('For the better experience, we recommend using Chrome.', {
        variant: 'warning',
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        autoHideDuration: 5000,
        TransitionComponent: Slide,
        TransitionProps: {
          timeout: {
            enter: 500,
            exit: 500,
          },
        },
      });
    }
   }, [openSnackbar]);

  useEffect(() => {
    if (openHistoryFromPreview) {
      setShowHistory(true);
      setActiveTab('sent'); // Switch to the Sent tab
      setTimeout(() => {
        historyRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [openHistoryFromPreview]);
  
  const handleRemoveFile = () => {
    setFile(null);
    setPdf(null);
    if (fileRef.current) {
      fileRef.current = null;
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z\s-']+$/;
    return nameRegex.test(name);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    if (!newEmail.trim()) {
      setFormErrors(prev => ({
        ...prev,
        email: 'Email is required'
      }));
    } else if (!isValidEmail(newEmail)) {
      setFormErrors(prev => ({
        ...prev,
        email: 'Please enter a valid email address'
      }));
    } else {
      setFormErrors(prev => ({
        ...prev,
        email: ''
      }));
    }
  };


  const handleDragOver = e => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);// Use the openSnackbar function
    const droppedFile = event.dataTransfer.files[0];
    const MAX_FILE_SIZE_MB = 10;
  
    if (droppedFile) {
      if (droppedFile.type === 'application/pdf') {
        if (droppedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          openSnackbar(`The file exceeds the maximum size limit of ${MAX_FILE_SIZE_MB}MB.`, { 
            variant: 'error' 
          });
        } else {
          setFile(droppedFile);
          processFile(droppedFile);
          openSnackbar('File uploaded successfully!');
        }
      } else {
        openSnackbar('Please upload only PDF files.', 'warning');
      }
    }
  };
  
  const handleGoBack = () => {
    setShowPreview(false);
  };

  const handleContinue = () => {
    const errors = {
      email: !email.trim() ? 'Email is required' : 
             !isValidEmail(email) ? 'Please enter a valid email address' : '',
      name: !name.trim() ? 'Full Name is required' : 
            !isValidName(name) ? 'Full Name should only contain letters and spaces' : '',
      title: !title.trim() ? 'Document Name is required' : 
            note.length > MAX_NOTE_LENGTH ? `Title exceeds maximum length of ${MAX_NOTE_LENGTH} characters` : '',
      note: !note.trim() ? 'Note to recipient is required' : 
            note.length > MAX_NOTE_LENGTH ? `Note exceeds maximum length of ${MAX_NOTE_LENGTH} characters` : ''
    };
  
    setFormErrors(errors);
    if (!file) {
      alert('Please upload a PDF file first.');
      return;
    }
    if (Object.values(errors).every(error => !error)) {
      setShowPreview(true);
    }
  };
  
  const handleNameChange = (e) => {
    const newName = e.target.value;
  
    if (newName.length > 25) {
      setFormErrors((prev) => ({
        ...prev,
        name: 'Full Name cannot exceed 25 characters',
      }));
      return; // Prevent updating the name if it exceeds 25 characters
    }
  
    setName(newName);
  
    if (!newName.trim()) {
      setFormErrors((prev) => ({
        ...prev,
        name: 'Full Name is required',
      }));
    } else if (!isValidName(newName)) {
      setFormErrors((prev) => ({
        ...prev,
        name: 'Full Name should only contain letters and spaces',
      }));
    } else {
      setFormErrors((prev) => ({
        ...prev,
        name: '',
      }));
    }
  };
  
  const handleNoteChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= MAX_NOTE_LENGTH) {
      setNote(inputText);
      setFormErrors({
        ...formErrors,
        note: false
      });
    }
  };

  const handletitleChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= MAX_NOTE_LENGTH) {
      setTitle(inputText);
      setFormErrors({
        ...formErrors,
        title: ''
      });
    }
  };
  

  const processFile = file => {
    if (file) {
      fileRef.current = file;
      const fileReader = new FileReader();
      fileReader.onload = function() {
        const typedArray = new Uint8Array(this.result);
        const loadingTask = pdfjsLib.getDocument(typedArray);
        loadingTask.promise
          .then(loadedPdf => {
            setPdf(loadedPdf);
          })
          .catch(error => {
            console.error('Error loading PDF: ', error);
          });
      };
      fileReader.readAsArrayBuffer(file);
    }
  };

  const handleShowHistory = () => {
    setShowHistory(true);
    setActiveTab('received');
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errors = {
      email: !email.trim(),
      name: !name.trim(),
      title: !title.trim(),
      note: !note.trim()
    };
    setFormErrors(errors);
    if (Object.values(errors).some(error => error)) {
      return;
    }

    setSubmittedData({
      email,
      name,
      title,
      note,
      fileName: file ? file.name : 'No file uploaded'
    });
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    const MAX_FILE_SIZE_MB = 10;
  
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          openSnackbar(`The file exceeds the maximum size limit of ${MAX_FILE_SIZE_MB}MB.`, 'error');
        } else {
          setFile(selectedFile);
          processFile(selectedFile);
          openSnackbar('File uploaded successfully!');
        }
      } else {
        openSnackbar('Please upload only PDF files.', 'warning');
      }
    }
  };
  
  async function saveSignatureToDB(
    note,
    recipientName,
    senderName,
    senderID,
    senderEmail,
    recipientEmail,
    file,
    dateCoordinates,
    fullnameCoordinates,
    signatureCoordinates,
    create,
    title,
  ) {
    try {

      const formData = new FormData();
      formData.append('note', note);
      formData.append('recipientName', recipientName);
      formData.append('senderID', senderID);
      formData.append('senderName', senderName);
      formData.append('senderEmail', senderEmail);
      formData.append('recipientEmail', recipientEmail);
      formData.append('file', file); // Attach the file itself to form data
      formData.append('dateCoordinates', JSON.stringify(dateCoordinates));
      formData.append('fullnameCoordinates', JSON.stringify(fullnameCoordinates));
      formData.append('signatureCoordinates', JSON.stringify(signatureCoordinates));
      formData.append('create', create);
      formData.append('title', title);
      const response = await eSignatureService.addSignature(formData);
      handleContinue();
    } catch (err) {
      console.error('Error saving signature:', err);
  
      // Check if the error response contains specific properties
      if (err && err.error === 'Recipient not found') {
        throw new Error('Recipient not found');
      } else {
        throw new Error('An unexpected error occurred while saving the signature');
      }
    }
  }
  
  return (
    <Box
    style={{
      ...(showPreview || showHistory
        ? {}
        : {
            backgroundColor: '#F8F8F8',
            padding: isMobile ? '12px' : '24px 210px',
          }),
    }}
  >
    {showHistory ? (
      <HistoryPage historyRef={historyRef} user={user} />
    ) : (
      <Box>
        {!showPreview ? (
          <Box>
            <form onSubmit={handleSubmit}>
              <Box style={styles.headerBox}>
                <Typography style={styles.headerText}>
                  ADD DOCUMENT
                </Typography>
                <Button
                  onClick={handleShowHistory}
                  style={styles.historyButton}
                >
                  VIEW HISTORY
                </Button>
              </Box>
  
              <Box
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  ...styles.dropZone,
                  backgroundColor: dragging ? '#e0e0e0' : '#fff',
                  border:'1px solid #cccccc'
                }}
              >
                <Box style={styles.dropZoneContent}>
                  {!file ? (
                    <>
                      <img
                        src={FileuploadIcon}
                        alt="File upload icon"
                        style={styles.uploadIcon}
                      />
                      <Typography
                        color="textSecondary"
                        style={{ marginBottom: '16px' }}
                      >
                        Drag File Here
                      </Typography>
                    </>
                  ) : (
                    <Box style={styles.fileNameContainer}>
                    <Box style={styles.fileNameWrapper}>
                      <Typography style={styles.uploadedLabel}>
                        File uploaded:
                      </Typography>
                      <Typography style={styles.fileName} title={file.name}>
                        {file.name}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={handleRemoveFile}
                      style={styles.removeIconWrapper} // Added a wrapper for better alignment
                    >
                      <CloseIcon style={styles.removeIcon} />
                    </IconButton>
                  </Box>
                  
                  )}
  
                  <label>
                    <Button
                      variant="outlined"
                      component="span"
                      style={{
                        textTransform: 'none',
                        borderRadius: '2px',
                        border: '2px solid #1C5087',
                        color: '#1C5087',
                      }}
                    >
                      + ADD DOCUMENT 
                    </Button>
                    <input
                      type="file"
                      hidden
                      accept="application/pdf"
                      onChange={handleFileSelect}
                    />
                  </label>
                </Box>
              </Box>
  
              <Typography style={styles.headerText}>
              RECIPIENT INFORMATION
              </Typography>
  
              <Box style={styles.recipientBox}>
                <StyledTextField
                  
                  fullWidth
                  size="small"
                  label="Full Name"
                  value={name}
                  onChange={handleNameChange}
                  error={!!formErrors.name}
                  helperText={formErrors.name ? formErrors.name : ''}
                  variant="outlined"
                />
  
                <StyledTextField
                  
                  fullWidth
                  size="small"
                  label="Email Address"
                  value={email}
                  onChange={handleEmailChange}
                  error={formErrors.email}
                  helperText={formErrors.email ? formErrors.email : ''}
                  variant="outlined"
                />
              </Box>
  
              <Box style={styles.recipientBox}>
                <StyledTextField
                  fullWidth
                  size="small"
                  label="Document Name"
                  value={title}
                  onChange={handletitleChange}
                  error={formErrors.title}
                  helperText={formErrors.title ? formErrors.title : ''}
                  variant="outlined"
                />
              </Box>
  
              <Box>
              <StyledTextField
  
  fullWidth
  multiline
  rows={3}
  label="Add Note"
  value={note}
  onChange={handleNoteChange}
  error={formErrors.note}
  helperText={formErrors.note ? formErrors.note : ''}
  variant="outlined"
  inputProps={{
    maxLength: MAX_NOTE_LENGTH,
    style: { padding: '0' }
  }}
/>
                <Typography
                  style={{
                    ...styles.noteCounter,
                    ...(note.length > MAX_NOTE_LENGTH
                      ? styles.errorCounter
                      : {}),
                  }}
                >
                  {note.length}/{MAX_NOTE_LENGTH} characters
                </Typography>
              </Box>
  
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '16px',
                }}
              >
                <Button
                  style={{
                    border: '2px solid #2872C1',
                    borderRadius: '2px',
                  }}
                  variant="contained"
                  type="button"
                  onClick={handleContinue}
                >
                  CONTINUE
                </Button>
              </Box>
            </form>
          </Box>
        ) : (
          <PDFPreviewComponent
            pdf={pdf}
            name={name}
            email={email}
            title={title}
            note={note}
            fileName={file.name}
            file={file}
            callMyFunction={saveSignatureToDB}
            onGoBack={handleGoBack}
          />
        )}
      </Box>
    )}
  </Box>  
  );
};

export default SendForSignatureComponent;
