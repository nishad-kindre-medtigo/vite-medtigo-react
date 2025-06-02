import React, { useState, useEffect, useCallback ,useRef } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs, 
  Tab,
  CircularProgress,
  useTheme, useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import eSignatureService from '../../services/esignatureService';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DescriptionIcon from '@mui/icons-material/Description';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import SendForSignatureComponent from './SendForSignatureComponent';
import { useOpenSnackbar } from "../../hooks/useOpenSnackbar"
// import { StyledTabs, StyledTab, TabsContainer } from './StyledComponents';
// import { tableStyles } from './styles';

const TabsContainer = (props) => (
  <Box
    {...props}
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      marginBlock: '20px',
      width: '100%',
    }}
  />
);

const StyledTabs = (props) => (
  <Tabs
    {...props}
    sx={{
      display: 'flex',
      minHeight: '33px',
      boxShadow: '0px 2px 8px 0px #0000001C',
      borderRadius: '2px',
      overflow: 'hidden',
      width: 'fit-content',
      '& .MuiTabs-indicator': {
        display: 'none',
        backgroundColor: 'transparent',
      },
    }}
  />
);

const StyledTab = (props) => (
  <Tab
    {...props}
    sx={{
      width: '124px',
      paddingBlock: 0,
      minHeight: '33px',
      fontSize: '16px',
      fontWeight: 600,
      backgroundColor: '#fff',
      border: '1px solid #2872C1',
      color: '#2872C1',
      '&.Mui-selected': {
        backgroundColor: '#2872C1',
        color: '#fff !important',
      },
      '&:first-of-type': {
        borderTopLeftRadius: '2px',
        borderBottomLeftRadius: '2px',
      },
      '&:last-of-type': {
        borderTopRightRadius: '2px',
        borderBottomRightRadius: '2px',
      },
    }}
  />
);

const tableStyles = {
  table: {
    minWidth: '1260px',
    '& .MuiTableCell-root': {
      color: 'black',
      padding: '8px !important',
      '@media (max-width: 600px)': {
        padding: '8px',
        fontSize: '12px',
        paddingRight: '14px !important',
        width:'150px'
      },
      fontSize: '14px',
      textAlign: 'center',
      fontWeight: 400
    },
    '& .MuiTableCell-root:first-child': {
      paddingLeft: '40px !important',
      textAlign: 'left',
      '@media (max-width: 600px)': {
        paddingLeft: '24px !important',
      },
    },
    '& .MuiTableCell-root:last-child': {
      paddingRight: '3px !important',
      padding:'15px !important',
      '@media (max-width: 600px)': {
        paddingRight: '0px !important',
      },
    },
    '& .MuiTableCell-head': {
      fontSize: '16px',
      borderTop: 'none',
      fontWeight: 600,
      '@media (max-width: 600px)': {
        fontSize: '14px',
        width:'130px !important'
      },
    },
    '& .MuiTableCell-head:first-child': {
      paddingLeft: '40px !important',
      '@media (max-width: 600px)': {
        paddingLeft: '24px !important',
      },
    },
    '& .MuiTableBody-root .MuiTableRow-root .MuiTableCell-root:first-child': {
      paddingLeft: '40px !important',
      '@media (max-width: 600px)': {
        paddingLeft: '24px !important',
        width:'150px'
      },
    },
    '& .MuiSelect-select': {
      color: 'black',
    },
  },
  actionCell: {
    display: 'flex !important',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px !important',
    '& .action-content': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      width: '100%',
    },
    '& .MuiIconButton-root': {
      padding: '4px',
    },
    '& .MuiButton-root': {
      textTransform: 'uppercase',
      backgroundColor: '#2872C1',
      color: 'white',
      fontSize: '16px',
      borderRadius: '2px',
      letterSpacing: '0.03em',
      fontWeight: 600,
      '&:hover': {
        backgroundColor: '#1e5c9c',
      },
    },
    '@media (max-width: 600px)': {
      padding: '8px !important',
      '& .action-content': {
        gap: '4px',
      },
      '& .MuiIconButton-root': {
        padding: '2px',
      },
      '& .MuiButton-root': {
        fontSize: '12px',
        padding: '4px 8px',
      },
    },
  },
  scrollbar: {
    scrollbarWidth: 'thin',
    scrollbarColor: 'black',
  },
  tableFooter: {
    '& .MuiTableCell-root': {
      fontSize: '14px',
      fontWeight: 600,
      '@media (max-width: 600px)': {
        fontSize: '14px',
      },
    },
  },
  pagination: {
    '& .MuiTableCell-root': {
      padding: '0px !important',
    },
    '& .MuiTablePagination-root': {
      fontSize: '14px',
    },
    '& .MuiToolbar-root': {
      minHeight: '20px !important',
    },
    '& .MuiTablePagination-toolbar': {
      fontSize: '14px',
    },
    '& .MuiTablePagination-selectLabel': {
      fontSize: '14px',
    },
    '& .MuiTablePagination-displayedRows': {
      fontSize: '14px',
    },
    '& .MuiTablePagination-select': {
      fontSize: '14px',
    },
    '& .MuiTablePagination-actions': {
      fontSize: '14px',
    },
    border: 'none !important',
    backgroundColor: '#FFF',
    '@media (max-width: 600px)': {
      '& .MuiTablePagination-root, & .MuiTablePagination-toolbar, & .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select, & .MuiTablePagination-actions': {
        fontSize: '12px',
      },
    },
  },
  placeHolder: {
    fontSize: '16px',
    backgroundColor: '#FFFFFF',
    height: '35vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
    '@media (max-width: 600px)': {
      fontSize: '14px',
    },
  },
};

const styles = {
  container: {
    backgroundColor: '#f9f9f9',
    padding: '0px !important'
  },
  headerBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerText: {
    fontFamily: 'Poppins',
    fontSize: '20px',
    fontWeight: '400',
    lineHeight: '30px',
    letterSpacing: '0.03em',
    color: '#000000'
  },
  historyButton: {
    fontFamily: 'Poppins',
    fontSize: '20px',
    fontWeight: '400',
    lineHeight: '30px',
    letterSpacing: '0.03em',
    color: '#2872C1',
    textTransform: 'none',
    textDecoration: 'underline',
    '&:hover': {
      background: 'none'
    }
  },
  dropZone: {
    border: '1px solid #CCCCCC !important',
    borderRadius: '2px !important',
    padding: '24px',
    marginBottom: '24px',
    position: 'relative',
    minHeight: '200px'
  },
  dropZoneContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '168px',
    paddingBottom: '24px'
  },
  uploadIcon: {
    width: 50,
    height: 50,
    marginBottom: 16,
    color: '#CCCCCC'
  },
  addDocumentButton: {
    textTransform: 'none',
    border: '1px solid #1C5087 !important',
    borderRadius: '2px !important',
    color: '#1C5087',
    borderColor: '#1C5087',
    '&:hover': {
      borderColor: '#1C5087'
    }
  },
  recipientBox: {
    border: '1px solid #CCCCCC !important',
    borderRadius: '2px !important',
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: '20px',
    display: 'flex',
    gap: '16px',
    marginBottom: '24px'
  },
  statusBox: {
    borderRadius: '4px',
    padding: '4px 8px',
    display: 'inline-block',
    textTransform: 'capitalize'
  },
  continueButton: {
    border: '1px solid #2872C1 !important',
    borderRadius: '2px !important'
  },
  fileNameContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px'
  },
  removeIcon: {
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: '#fff'
    }
  },
  noteCounter: {
    display: 'flex',
    marginTop: '4px',
    fontSize: '12px',
    color: '#666666'
  },
  
  errorCounter: {
    color: '#d32f2f'  // Material-UI error color
  },
  toggleContainer: {
    display: 'flex',
    justifyContent:'center',
        alignItems: 'center',
        height: '100%',
        marginBlock: '20px'
  },
  toggleButton: {
    '&.MuiToggleButton-root': {
      textTransform: 'none',
      padding: '6px 24px',
      backgroundColor: '#fff',
      border: '1px solid #DFDFDF',
      color: '#666',
      '&.Mui-selected': {
        backgroundColor: '#1976d2',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#1565c0',
        },
      },
    },
  }
};

const HistoryPage = ({ historyRef, openHistoryFromPreview, initialTab}) => {
   const user = useSelector(state => state.account.user);
  const classes = tableStyles;
  const theme = useTheme();
  const openSnackbar = useOpenSnackbar();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState('received');
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [signatureHistory, setSignatureHistory] = useState([]);
  const [tooltipTitle, setTooltipTitle] = useState('Copy Link');
  const [open, setOpen] = useState(false);
  const [showSendForSignature, setShowSendForSignature] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNote, setSelectedNote] = React.useState('');
  const [selectedCountry, setSelectedCountry] = React.useState('');
  const [selectedIpAddress, setSelectedIpAddress] = React.useState('');
  const tableRef = useRef(null); 
  const tabsRef = useRef(null); 
  const hasWindowReloaded = useRef(false);
  const [cachedData, setCachedData] = useState({
    sent: [],
    received: [],
    lastFetched: {
      sent: null,
      received: null
    }
  });
  

  // useEffect(() => {
  //   if (initialTab === 'received' && !hasWindowReloaded.current) {
  //     hasWindowReloaded.current = true;
  //     window.location.reload();
  //   }
  // }, [initialTab]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);  // Make sure initialTab is a valid string ('received' or 'sent')
    }
  }, [initialTab]);

//  useEffect(() => {
//     if (openHistoryFromPreview) {
//       // setShowHistory(true);
//       setActiveTab('sent'); // Switch to the Sent tab
//     }
//   }, [openHistoryFromPreview]);

const fetchSignatureHistory = useCallback(async () => {
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
  
  try {
    const senderID = user?.id;
    if (!senderID) {
      console.error('No sender ID available');
      setIsLoading(false);
      setSignatureHistory([]);
      return;
    }

    // Check if we have valid cached data
    const lastFetchTime = cachedData.lastFetched[activeTab];
    const isCacheValid = lastFetchTime && (Date.now() - lastFetchTime) < CACHE_DURATION;
    
    if (isCacheValid && cachedData[activeTab].length >= 0) { // Changed from > 0 to >= 0 to handle empty arrays
      setSignatureHistory(cachedData[activeTab]);
      setIsLoading(false);
      return;
    }

    const response = await eSignatureService.getSignature(
      null,
      senderID,
      activeTab
    );

    if (response?.data?.data && Array.isArray(response.data.data)) {
      const sortedHistory = response.data.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      // Update cache
      setCachedData(prev => ({
        ...prev,
        [activeTab]: sortedHistory,
        lastFetched: {
          ...prev.lastFetched,
          [activeTab]: Date.now()
        }
      }));
      
      setSignatureHistory(sortedHistory);
    } else {
      console.error('Invalid response format or no data found:', response);
      setSignatureHistory([]);
    }
  } catch (error) {
    console.error('Error fetching signature history:', error);
    setSignatureHistory([]);
  } finally {
    setIsLoading(false);
  }
}, [activeTab, user?.id, cachedData]);

useEffect(() => {
  fetchSignatureHistory();
}, [activeTab, fetchSignatureHistory]);

const handleTabChange = (newTab) => {
  if (newTab === activeTab) return;
  setSignatureHistory([]); // Clear current data
  setIsLoading(true); // Show loading state
  setActiveTab(newTab);
};

const handleChangePage = (event, newPage) => {
  setPage(newPage);
  
  // Scroll to the top of the page after state update
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, 10);
};

  const handleIconClick = () => {
    setShowSendForSignature(true);  
    setShowHistory(false); 
  };

  const handleReturnToHistory = () => {
    setShowSendForSignature(false);
    setShowHistory(true);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    
    // Scroll to the top of the page after state update
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 10);
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        const isMobile = window.innerWidth <= 768; // Adjust breakpoint based on your needs
  
        if (isMobile) {
          // Mobile view: Show Snackbar
          openSnackbar('Link is copied!');
        } else {
          // Desktop view: Show Tooltip
          setTooltipTitle('Copied!');
          setOpen(true); // Show tooltip on desktop
          setTimeout(() => {
            setTooltipTitle('Copy Link');
            setOpen(false);
          }, 2000);
        }
      })
      .catch((err) => console.error('Failed to copy: ', err));
  };


  const handleSignNow = (signatureID) => {
    if (signatureID) {
      navigate(`/addsignature?id=${signatureID}`);
    } else {
      console.error('No signatureID provided for signing.');
    }
  };

  const handleOpenFile = (filePath) => {
    const fileUrl = `https://dev.medtigo.com/${filePath}`;
    window.open(fileUrl, '_blank');
  };

  const getPageData = (data) => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  };

 const handleClickOpen = (country, ipAddress) => {
  setSelectedCountry(country);
  setSelectedIpAddress(ipAddress);
  setOpenDialog(true);
};

const handleClickOpenNote = (note) => {
  setSelectedNote(note); // Set the selected note
  setOpenNoteDialog(true); // Open the dialog
};

const handleClose = () => {
  setOpenDialog(false);
};

const handleNoteClose = () => {
  setOpenNoteDialog(false); // Close the dialog
  setSelectedNote(''); // Clear the selected note
};

const LoadingState = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="200px">
    <CircularProgress />
  </Box>
);

  return (
    <Box>
       {showSendForSignature && (
        <SendForSignatureComponent onBack={handleReturnToHistory} />
      )}
      
      {showHistory && (
        <Box style={{backgroundColor: '#F8F8F8',
          padding: isMobile ? '12px':'24px'}}>
      <Box 
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        }}
    >
      <Box 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: isMobile ? '100%' : 'auto'
        }}
      >
        <ArrowBackIosNewRoundedIcon
          style={{
            color: '#000',
            fontSize: 20,
            cursor: 'pointer'
          }}
          onClick={handleIconClick}
        />
        <Typography
          style={{
            fontWeight: 500,
            fontSize: isMobile ? '18px' : '22px',
            textTransform: 'uppercase',
            cursor:'pointer'
          }}
          onClick={handleIconClick}
        >
          {activeTab} HISTORY
        </Typography>
      </Box>
      
      <Box style={{ width: isMobile ? '100%' : 'auto' }}>
        <TabsContainer>
        <StyledTabs
  ref={tabsRef}
  value={activeTab}
  onChange={(event, newTab) => handleTabChange(newTab)}
  textColor="primary"
  variant={isMobile ? "fullWidth" : "scrollable"}
  scrollButtons="auto"
>
  <StyledTab value="received" label="RECEIVED" />
  <StyledTab value="sent" label="SENT" />
</StyledTabs>
        </TabsContainer>
      </Box>
    </Box>

      <Box style={{ backgroundColor: 'white', marginTop: '10px', border: '1px solid #DFDFDF' }}>
        <Box>
        <TableContainer component={Paper} elevation={0} sx={classes.scrollbar}  ref={tableRef}>
                {isLoading ? (
                  <LoadingState />
                ) : getPageData(signatureHistory).length === 0 ? (
              <Box sx={classes.placeHolder}>
                {activeTab === 'sent' ? 'No Signatures Sent' : 'No Signatures Received'}
              </Box>
            ) : (
              <Table
                sx={classes.table}
                style={{
                  fontSize: '16px',
                  '& .MuiTableCell-root:not(:last-child)': { borderRight: 'none' }
                }}
              >
                <TableHead>
                  <TableRow>
                    {activeTab === 'sent' ? (
                      <>
                        <TableCell style={{ 
    textAlign: 'left',
    padding: isMobile ? '8px' : '14px',
    fontSize: isMobile ? '14px' : '16px' // This preserves desktop font size
  }}>Recipient Name</TableCell>
                        <TableCell>Recipient Email Address</TableCell>
                        <TableCell>Created Date</TableCell>
                        <TableCell>Signed Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell style={{ 
    textAlign: 'left',
    padding: isMobile ? '8px' : '14px',
    fontSize: isMobile ? '12px' : '16px' // This preserves desktop font size
  }}>Sender Name</TableCell>
                        <TableCell>Sender Email Address</TableCell>
                        <TableCell>Created Date</TableCell>
                        <TableCell>Signed Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getPageData(signatureHistory).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ 
    textAlign: 'left',
    padding: isMobile ? '8px' : '14px',
    fontSize: isMobile ? '12px' : '14px' // This preserves desktop font size
  }}>
                        {activeTab === 'sent' ? row.recipientName || '-' : row.sendername || '-'}
                      </TableCell>
                      <TableCell style={{
              userSelect: 'text',
              WebkitTextFillColor: 'inherit',
              textDecoration: 'none',
              WebkitTextDecorationLine: 'none',
              pointerEvents: 'none',
              // Prevent iOS from detecting and styling email addresses
              WebkitTouchCallout: 'none',
              // Prevent data detection on iOS
              WebkitTextSizeAdjust: 'none',
              '-webkit-tap-highlight-color': 'transparent'
            }}>
              <span style={{ 
                pointerEvents: 'none',
                textDecoration: 'none !important'
              }}>
                {activeTab === 'sent' ? row.recipientEmail || '-' : row.senderemail || '-'}
              </span>
            </TableCell>
                      <TableCell>
                        {new Date(row.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        {row.signatureDate
                          ? new Date(row.signatureDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Box
                          style={{
                            ...styles.statusBox,
                            backgroundColor: row.create ? '#FDE8E8' : '#DEF7EC',
                            color: row.create ? '#9B1C1C' : '#03543F'
                          }}
                        >
                          {row.create ? 'Requested' : 'Completed'}
                        </Box>
                      </TableCell>
                      <TableCell 
    sx={classes.actionCell}
    >
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px', // Consistent spacing between icons
        width: '100%' // Take full width to enable center alignment
      }}>
        {/* Note Dialog & Icon */}
        <Tooltip title="Click to view note">
  <IconButton size="small" onClick={() => handleClickOpenNote(row.note)}>
  <DescriptionIcon
  sx={{
    color: '#000',
    ...(activeTab === "received" && row.create === true && { marginRight: isMobile ? '0px' : '11px' })
  }}
/>
  </IconButton>
</Tooltip>
        {/* Location Icon & Dialog */}
        {(row.country || row.ipAddress) && (
          <Tooltip title="Click to view Location">
            <IconButton 
              size="small" 
              onClick={() => handleClickOpen(row.country, row.ipAddress)}
            >
              <LocationOnIcon sx={{ color: '#000' }} />
            </IconButton>
          </Tooltip>
        )}

        {/* Conditional Buttons/Icons based on activeTab */}
        {activeTab === 'received' ? (
          row.create ? (
            <Button
              variant="contained"
              size="small"
              onClick={() => handleSignNow(row.id)}
              sx={{
                textTransform: 'uppercase',
                bgcolor: '#2872C1',
                color: 'white',
                fontSize: '16px',
                borderRadius: '2px',
                letterSpacing: '0.03em',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#1e5c9c'
                }
              }}
            >
              Sign
            </Button>
          ) : (
            <Tooltip title="Click to View File">
              <IconButton size="small" onClick={() => handleOpenFile(row.filepath)}>
                <VisibilityIcon sx={{ color: '#000' }} />
              </IconButton>
            </Tooltip>
          )
        ) : (
          <>
            {activeTab === 'sent' && row.create && (
                <Tooltip 
                title={tooltipTitle} 
                arrow 
                open={isMobile ? open : undefined}  // Always open on mobile click
                disableHoverListener={isMobile}  // Disable hover for mobile
                onClose={() => setOpen(false)}  // Close after timeout
              >
                <IconButton size="small" onClick={() => handleCopyLink(row.url)}>
                  <LinkIcon sx={{ color: '#000' }} />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Click to View file">
              <IconButton size="small" onClick={() => handleOpenFile(row.filepath)}>
                <VisibilityIcon sx={{ color: '#000' }} />
              </IconButton>
            </Tooltip>
          </>
        )}
      </div>

      {/* Dialogs */}
      <Dialog
        open={openNoteDialog}
        onClose={handleNoteClose}
        PaperProps={{
          sx: {
            height: '195px',
            maxHeight: '195px',
            width: '486px',
            maxWidth: '486px'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: 2,
            height: '60px'
          }}
        >
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
            Note From Sender:
          </span>
          <IconButton 
            onClick={handleNoteClose} 
            size="small"
            sx={{ padding: 0.5 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #ccc' }} />
        <DialogContent 
          sx={{ 
            padding: 2,
            fontSize: '14px',
            lineHeight: 1.5,
            color: '#333',
            overflow: 'auto',
            height: 'calc(100% - 60px)'
          }}
        >
          {selectedNote}
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Location Information</DialogTitle>
        <DialogContent>
          <div>
            <p><strong>Place:</strong> {selectedCountry || 'N/A'}</p>
            <p><strong>IP Address:</strong> {selectedIpAddress || 'N/A'}</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

                <TableFooter>
                  <TableRow style={{ backgroundColor: 'white' }}>
                    <TablePagination
                      sx={classes.pagination}
                      rowsPerPageOptions={[5, 10, 25]}
                      count={signatureHistory.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            )}
          </TableContainer>
        </Box>
      </Box>

      </Box>
      )}
    </Box>
  );
};

export default HistoryPage;