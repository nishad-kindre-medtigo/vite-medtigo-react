import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton, MenuItem, Paper, Select, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, tooltipClasses, Typography,Autocomplete, TextField, Chip, Box } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { CMEComplianceRuleSet } from "../../../appConstants";

const CMERulesPopup = ({ showRule, setShowRule, selectedStates }) => {
    const [stateRule, setStateRules] = React.useState({
        "State": "",
        "State_ID": "",
        "Profession": "",
        "LicenseType": "",
        "RequestType": "",
        "RenewalCycle": "",
        "Note": 'Anything',
        "Requirements": []
    });
    const [currentState, setCurrentState] = React.useState(selectedStates[0]);

    React.useEffect(() => {
        if (currentState) setRule();
    }, [currentState]);

    const setRule = () => {
        const found = CMEComplianceRuleSet.find(it => it.State_ID == (currentState.id).toString());
        setStateRules(found || {});
    };

    return (
        <Dialog
            PaperProps={{
                sx: {
                    width: '80vw', // Set to 80% of the viewport width
                    maxWidth: '80vw', // Ensure the maximum width does not exceed 80vw
                    height: '600px', // Fixed height
                    overflowY: 'auto', // Enable vertical scrolling for content
                    padding: '20px'
                },
            }}
            open={showRule}
            onClose={() => setShowRule(false)}
        >
            <DialogTitle
                sx={{
                    fontSize: '18px',
                    textAlign: 'left',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant="h6" align="center">
                    {"CME Requirements and Rules for Physician License Renewal"}
                </Typography>
                <span style={{ cursor: 'pointer' }} onClick={() => setShowRule(false)}>
                    <CloseIcon sx={{ color: 'gray' }} />
                </span>
            </DialogTitle>
            <DialogContent style={{ width: '100%' }}>
                {/* <Box
                overflow={'auto'}
                display={'flex'}
                flexDirection={'row'}
                >
                    {
                        selectedStates.map(item=><Chip style={{marginRight:'10px', borderRadius:'20px'}} color="primary" variant={currentState.id==item.id?'filled':'outlined'} onClick={() => setCurrentState(item)} label={item.name} />)
                    }
                </Box> */}
                {/* State Selector */}
                    <>
                        <Autocomplete
                            disableClearable
                            value={currentState}
                            onChange={(e, newValue) => setCurrentState(newValue)}
                            options={selectedStates}
                            getOptionLabel={(option) => option.name} // Display the 'name' of the state
                            style={{ width: '200px', marginTop:'10px' }}
                            renderInput={(params) => <TextField {...params} label="States" variant="outlined" />}
                            isOptionEqualToValue={(option, value) => option.id === value} // Ensures proper comparison between option and selected value
                        />

                    </>
                {/* Rule Details */}
                <ul style={{ paddingLeft: '15px', marginTop: '20px' }}>
                    <li style={{ fontSize: '14px' }}>
                        Profession - <span style={{ fontWeight: '500' }}>{stateRule?.Profession}</span>
                    </li>
                    <li style={{ fontSize: '14px' }}>
                        License Type - <span style={{ fontWeight: '500' }}>{stateRule?.LicenseType}</span>
                    </li>
                    <li style={{ fontSize: '14px' }}>
                        Request Type - <span style={{ fontWeight: '500' }}>{stateRule?.RequestType}</span>
                    </li>
                    {stateRule?.RenewalCycle !== '-' && (
                        <li style={{ fontSize: '14px' }}>
                            Renewal Cycle - <span style={{ fontWeight: '500' }}>{stateRule?.RenewalCycle}</span>
                        </li>
                    )}
                </ul>

                {stateRule?.Requirements?.length > 0 && (
                    <TableContainer sx={{ marginTop: '15px' }} component={Paper} elevation={0}>
                        <Table
                            sx={{
                                border: '1px solid #ddd',
                                width: '100%',
                            }}
                            aria-label="simple table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ borderRight: '1px solid #ddd', fontWeight: '500' }} width={300}>
                                        Category
                                    </TableCell>
                                    <TableCell style={{ borderRight: '1px solid #ddd', fontWeight: '500' }} width={300}>
                                        Credits
                                    </TableCell>
                                    <TableCell style={{ borderRight: '1px solid #ddd', fontWeight: '500' }}>
                                        Details
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stateRule?.Requirements.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell style={{ borderRight: '1px solid #ddd' }}>{item.Topic}</TableCell>
                                        <TableCell style={{ borderRight: '1px solid #ddd' }}>{item.Requirement}</TableCell>
                                        <TableCell style={{ borderRight: '1px solid #ddd' }}>{item.Note}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>
        </Dialog>

    );
};
export default CMERulesPopup;