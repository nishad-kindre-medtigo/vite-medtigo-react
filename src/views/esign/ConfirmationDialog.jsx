import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const ConfirmationDialog = ({ open, onClose, onConfirm, recipientEmail, fieldsCount, buttonDisabled }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        style: {
          width: isMobile ? '95%' : '460px',
          maxWidth: isMobile ? '95%' : '460px',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          margin: isMobile ? '16px' : 'auto'
        }
      }}
    >
      <DialogTitle 
        style={{ 
          paddingBottom: 0,
          paddingTop: '1rem',
          paddingLeft: isMobile ? '1rem' : '2rem',
          paddingRight: isMobile ? '1rem' : '2rem',
          fontWeight: 500,
          fontSize: isMobile ? '1rem' : '1.15rem',
          color: '#000',
        }}
      >
        Confirm Details
      </DialogTitle>
      
      <hr style={{ 
        margin: '0',
        border: 'none',
        borderTop: '1px solid #E5E7EB',
        width: '100%'
      }} />
      <DialogContent style={{padding: isMobile ? '20px 16px' : '',}}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow 
                style={{ 
                  backgroundColor: '#F8F8F8' 
                }}
              >
                <TableCell 
                  style={{ 
                    paddingY: '1.5rem',
                    paddingX: isMobile ? '1rem' : '2rem',
                    fontWeight: 400,
                    fontSize: isMobile ? '0.85rem' : '0.9rem',
                    color: '#000',
                    borderBottom: 'none'
                  }}
                >
                  Recipient
                </TableCell>
                <TableCell 
                  style={{ 
                    paddingY: '1.5rem',
                    paddingX: isMobile ? '1rem' : '2rem',
                    fontWeight: 400,
                    fontSize: isMobile ? '0.85rem' : '0.9rem',
                    color: '#000',
                    borderBottom: 'none',
                    textAlign:'center',
                  }}
                >
                  Fields
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell 
                  style={{ 
                    paddingY: '1.5rem',
                    paddingX: isMobile ? '1rem' : '2rem',
                    color: 'rgba(0,0,0,0.6)',
                    fontSize: isMobile ? '13px' : '0.9rem',
                    borderBottom: 'none',
                  }}
                >
                  {recipientEmail}
                </TableCell>
                <TableCell 
                  style={{ 
                    paddingY: '1.5rem',
                    paddingX: isMobile ? '1rem' : '2rem',
                    fontSize: isMobile ? '0.85rem' : '0.9rem',
                    borderBottom: 'none',
                    textAlign: 'center',
                  }}
                >
                  {fieldsCount}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
  
      <DialogActions 
        style={{ 
          paddingLeft: isMobile ? '1rem' : '3rem', 
          paddingRight: isMobile ? '16px' : '24px', 
          paddingBottom: isMobile ? '1rem' : '2rem',
          marginTop: '-1rem',
        }}
      >
        <Button 
          onClick={onClose}
          variant="outlined"
          style={{
            textTransform: 'none',
            borderColor: '#2872C1',
            color: '#2872C1',
            fontSize: isMobile ? '0.85rem' : '0.9rem',
            fontWeight: 400,
            minWidth: isMobile ? '70px' : '80px',
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm}
          variant="contained"
          style={{
            textTransform: 'none',
            backgroundColor: buttonDisabled ? '#ccc' : '#2872C1',
            fontSize: isMobile ? '0.85rem' : '0.9rem',
            fontWeight: 400,
            boxShadow: 'none',
            minWidth: isMobile ? '70px' : '80px',
            cursor: buttonDisabled ? 'not-allowed' : 'pointer',
          }}
          disabled={buttonDisabled}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;