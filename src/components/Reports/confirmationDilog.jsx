import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

export const ConfirmationDialog = ({ open, title, msg, onConfirm, onCancel }) => {
    return (
      <Dialog
        fullWidth
        open={open}
        onClose={onCancel}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
        sx={{
            "& .MuiDialog-paper": {
              minWidth: "50%", // Set the minimum width to 70%
            },
          }}
      >
        <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
        <DialogContent>
          {/* Add any content you want here */}
         {msg || 'Are you sure you want to proceed with this action?'}
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={onConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };