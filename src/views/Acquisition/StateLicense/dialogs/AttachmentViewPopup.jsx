import React from 'react';
import { ListItemText, Dialog, DialogTitle, DialogContent, ListItemSecondaryAction, List, ListItem, Typography, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { FilePresent } from '@mui/icons-material';
import { SERVER_URL } from '../../../../settings';

export default function AttachmentViewPopup({ open, onClose, attachments, fileName }) {
  const handleViewAttachment = attachment => {
    window.open(SERVER_URL + attachment, '_blank');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'grey.400',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h6" component="h2">
          Attachments
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <List
          sx={{
            maxHeight: 300,
            overflowY: 'auto'
          }}
        >
          {attachments.split(',').map((attachment, indx) => {
            const currentFileName = fileName
              ? fileName.split(',')[indx]
              : `Attachment ${indx + 1}`;
            const displayName =
              currentFileName.length > 100
                ? `${currentFileName.slice(0, 97)}...`
                : currentFileName;

            return (
              <ListItem key={`attachment-${indx}`}>
                <ListItemText
                  primary={
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <FilePresent color="action" />
                      <Typography
                        component="span"
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {displayName}
                      </Typography>
                    </div>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleViewAttachment(attachment)}>
                    <VisibilityIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
}
