import React, { useState } from 'react';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Tooltip, TextField, Box } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
export const ConfirmationDialog = ({ 
    open, 
    title, 
    msg, 
    note, 
    setNote, // Function to update the note state
    onConfirm, 
    onCancel 
}) => {
    return (
        <Dialog
            fullWidth
            open={open}
            onClose={onCancel}
            aria-labelledby="confirmation-dialog-title"
            aria-describedby="confirmation-dialog-description"
        >
            <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <Box p={2} sx={{background:'#F0F0F0'}}>
                {msg || 'Recipient: PersonA@gmail.com'}
                </Box>
                <TextField
                    label="Add a note"
                    fullWidth
                    multiline
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)} // Update note state on change
                    margin="normal"
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={onConfirm} variant="contained" color="primary" autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const MailIconWithDialog = ({ email = 'abd@test.com', disabled, payload, handleSendEmail, icon_color, title}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [note, setNote] = useState('');

    React.useEffect(()=>{},[disabled])

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleConfirm = () => {
        handleSendEmail({...payload,note}); // Send the email via the callback
        setDialogOpen(false);
    };

    return (
        <>
        <Tooltip title={title} placement='bottom' arrow>
            <IconButton
                disabled={disabled}
                style={{
                    color: '#3A3A3A', // faded color when disabled
                    cursor: disabled ? 'default' : 'pointer',
                    pointerEvents: disabled ? 'none' : 'auto',
                    opacity: disabled ? 0.7 : 1,
                }}
                ripp
                aria-label="send mail"
                onClick={handleOpenDialog}
            >
                {
                    disabled?
                    <MarkEmailReadIcon/>:<MailIcon color={icon_color?icon_color:'#000'}/>
                }
            </IconButton>

            <ConfirmationDialog
                setNote={setNote}
                note={note}
                open={dialogOpen}
                title="Confirm Action"
                msg={`Recipient: ${email}`}
                onConfirm={handleConfirm}
                onCancel={handleCloseDialog}
            />
        </Tooltip>
        </>
    );
};

export default MailIconWithDialog;
