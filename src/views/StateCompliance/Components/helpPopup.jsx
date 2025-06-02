import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    IconButton,
    Typography,
    Button,
    Divider,
    TextField,
    Autocomplete,
    Switch,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { styled } from '@mui/material/styles';

// Custom switch styling
const IOSSwitch = styled((props) => (
    <Switch {...props} />
))(({ theme }) => ({
    width: 38,
    height: 20,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 3,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
                opacity: 1,
                border: 0,
            },
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.5,
        },
    },
    '& .MuiSwitch-thumb': {
        width: 14,
        height: 14,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
        opacity: 1,
    },
}));

function HelpPopup({ helpPopup, setHelpPopup }) {
    return (
        <React.Fragment>
            <Dialog
                open={helpPopup}
                onClose={() => setHelpPopup(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="md"
                sx={{padding:'20px'}}
            >
                <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', textAlign: 'left', alignItems: 'center' }}>
                    <Typography variant="h5" fontWeight="semi-bold">
                        Generating State Compliance Report Instructions
                    </Typography>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => setHelpPopup(false)}
                        aria-label="close"
                    >
                        <CloseIcon sx={{ color: '#757575' }} />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ paddingBottom: '20px', paddingLeft:'40px' }}>
                    <DialogContentText id="alert-dialog-description">
                        {/* Add Certificate Section */}
                        <Typography variant="body1" sx={{ marginTop: '15px', paddingBottom: '8px', fontWeight: '600' }}>
                            Add Certificate
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                margin: '10px 0',
                                color: '#fff',
                                backgroundColor: '#0B66BF',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <AddRoundedIcon sx={{ marginRight: '8px' }} />
                            ADD CERTIFICATE
                        </Button>
                        <Typography paragraph sx={{ fontSize: '16px' }}>
                            {'To add a CME certificate, click the "Add Certificate" button to add CME or regulatory certificates and licenses.'}
                        </Typography>

                        <Divider sx={{ margin: '20px 0', backgroundColor: '#E0E0E0' }} />

                        {/* My State Toggle Section */}
                        <Typography variant="body1" sx={{ marginTop: '15px', paddingBottom: '8px', fontWeight: '600' }}>
                            My State Toggle
                        </Typography>
                        <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0' }}>
                            <IOSSwitch />
                            <Typography sx={{ marginLeft: '10px', fontSize: '16px' }}>My State</Typography>
                        </div>
                        <Typography paragraph sx={{ fontSize: '16px' }}>
                            This toggle button allows you to view only the states where you have uploaded your physician license. If off, all states will be displayed.
                        </Typography>

                        <Divider sx={{ margin: '20px 0', backgroundColor: '#E0E0E0' }} />

                        {/* State Selection Section */}
                        <Typography variant="body1" sx={{ marginTop: '15px', paddingBottom: '8px', fontWeight: '600' }}>
                            State Selection
                        </Typography>
                        <Autocomplete
                            sx={{ width: '20%', margin: '10px 0' }}
                            disabled
                            getOptionLabel={(option) => option.name}
                            id="state-dropdown"
                            options={[] /* Add your state options here */}
                            renderInput={(params) => <TextField {...params} label="State" fullWidth />}
                        />
                        <Typography paragraph sx={{ fontSize: '16px' }}>
                            This dropdown will display the states. (If the toggle is off, all states are shown).
                        </Typography>

                        <Divider sx={{ margin: '20px 0', backgroundColor: '#E0E0E0' }} />

                        {/* Generate Report Section */}
                        <Typography variant="body1" sx={{ marginTop: '15px', paddingBottom: '8px', fontWeight: '600' }}>
                            Generate Report
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{
                                color: '#fff',
                                backgroundColor: '#0B66BF',
                                height: '50px',
                                width: '200px',
                                margin: '10px 0',
                                fontSize: '16px',
                            }}
                        >
                            Generate Report
                        </Button>
                        <Typography paragraph sx={{ fontSize: '16px' }}>
                            After selecting a state from the dropdown, click this button to generate your report.
                        </Typography>

                        <Divider sx={{ margin: '20px 0', backgroundColor: '#E0E0E0' }} />

                        {/* View Rules Section */}
                        <Typography variant="body1" sx={{ marginTop: '15px', paddingBottom: '8px', fontWeight: '600' }}>
                            View Rules
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            sx={{
                                height: '50px',
                                width: '150px',
                                margin: '10px 0',
                                fontSize: '16px',
                            }}
                        >
                            View Rules
                        </Button>
                        <Typography paragraph sx={{ fontSize: '16px' }}>
                            Clicking this button will show you the compliance requirement rule.
                        </Typography>

                        <Divider sx={{ margin: '20px 0', backgroundColor: '#E0E0E0' }} />

                        {/* Tracker Section */}
                        <Typography variant="body1" sx={{ marginTop: '15px', paddingBottom: '8px', fontWeight: '600' }}>
                            Tracker
                        </Typography>
                        <Typography paragraph sx={{ fontSize: '16px' }}>
                            Use the tracker option to view added CME certificates.
                        </Typography>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}

export default HelpPopup;
