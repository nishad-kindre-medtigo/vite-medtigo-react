import React from 'react';
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import moment from 'moment';
import { CONNECT_URL } from 'src/settings';

const NotesPopup = ({ viewNotesData, openNotesDialog, setOpenNotesDialog }) => {
  return (
    <Dialog
      open={openNotesDialog}
      onClose={() => setOpenNotesDialog(false)}
      fullWidth
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          color: '#000000'
        }}
      >
        <Typography
          style={{
            fontWeight: 'bold',
            color: '#15487F'
          }}
        >
          View Note
        </Typography>
      </DialogTitle>
      <div
        style={{
          backgroundColor: '#15487F',
          height: '2px',
          width: '100%'
        }}
      ></div>
      <DialogContent
        style={{
          backgroundColor: '#ffffff',
          color: '#000000',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
          }}
        >
          <Typography>
            {viewNotesData && viewNotesData.Certificate_Name}
          </Typography>
          <Typography>
            <span
              style={{
                fontWeight: 'bold',
                color: '#000000'
              }}
            >
              State:{' '}
            </span>
            {viewNotesData && viewNotesData.state}
          </Typography>
          <Typography>
            <span
              style={{
                fontWeight: 'bold',
                color: '#000000'
              }}
            >
              Analyst Name:{' '}
            </span>
            {viewNotesData && viewNotesData.AnalystName}
          </Typography>
          <Typography>
            <span
              style={{
                fontWeight: 'bold',
                color: '#000000'
              }}
            >
              Added On:{' '}
            </span>
            {viewNotesData &&
              moment(viewNotesData.Notes_Date.split('T')[0]).format(
                'MMMM DD YYYY'
              )}
          </Typography>
          <Typography>
            <span
              style={{
                fontWeight: 'bold',
                color: '#000000'
              }}
            >
              Note:{' '}
            </span>
            {viewNotesData && viewNotesData.Certificate_Note}
          </Typography>
          <Typography>
            <span
              style={{
                fontWeight: 'bold',
                color: '#000000'
              }}
            >
              Attachment:{' '}
            </span>{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href={`${viewNotesData &&
                `${CONNECT_URL}` +
                  viewNotesData.Attachment_File}`}
            >
              View
            </a>
          </Typography>
        </div>
      </DialogContent>
      <DialogActions
        style={{
          backgroundColor: '#ffffff',
          color: '#000000'
        }}
      >
        <Button
          className="btn"
          style={{
            position: '20px',
            right: '15px',
            bottom: '10px'
          }}
          variant="contained"
          color="primary"
          onClick={() => {
            setOpenNotesDialog(false);
          }}
        >
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotesPopup;
