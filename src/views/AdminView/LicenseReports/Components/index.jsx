import React from "react";
import InfoIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from "@mui/icons-material/Close";
import { Tooltip, IconButton, Typography, Box, Divider } from "@mui/material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";

export const InfoIconTooltip = ({ title, placement, onClick }) => {
    return (
        <Tooltip placement={placement || "right"} arrow title={title || "More information"}>
            <IconButton onClick={onClick} color="primary">
                <InfoIcon color="action" />
            </IconButton>
        </Tooltip>
    );
};

export const InfoDialog = ({ open, title, details, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth // Ensures the dialog can expand
      slotProps={{
        paper: {
          sx: {
            boxShadow: 'none', // Remove the default box shadow from dialog paper
            backgroundColor: '#fff', // Optional: Set dialog paper background color
            width: '400px', // Set the fixed width to 500px
            maxWidth: '400px', // Ensures the max width is 500px as well
          },
        },
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.1)', // Lighter backdrop color
          },
        },
      }}
    >
      <DialogTitle>
        <Box sx={{padding:'0px'}} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Typography style={{fontSize:'20px'}}>
            {title}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon color="action" />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider sx={{ margin: 0 }} /> {/* Horizontal line after title */}
      <DialogContent>
        {details.length>0 && details.map((detail, index) => (
          <Typography key={index} variant="body1" gutterBottom>
            <strong>{detail.label}</strong>: {detail.value}
          </Typography>
        ))}
      </DialogContent>
    </Dialog>
  );
};
