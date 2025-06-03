import React, { useEffect, useState } from "react"
import { cme_states as states, CME_LicenseType, CME_RequestType, ProfessionWithCertificates } from '../../../appConstants';
import { useSelector } from "react-redux";
import { Checkbox, Popper, Grid, Button, DialogContent, Box, DialogActions, Typography } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import { grey } from '@mui/material/colors';
import { DatePicker, LocalizationProvider, DesktopDatePicker, MobileDatePicker } from '@mui/x-date-pickers';
import StateSpecificCMECervices from 'src/services/stateSpecificCMEService';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckIcon from '@mui/icons-material/Check';
import { TextField, Tooltip, Autocomplete, Select, DialogTitle, Dialog, DialogContentText, tooltipClasses, ToggleButton, ListItemText } from '@mui/material';
import moment from "moment";
import { SERVER_URL } from "../../../settings";
// import { Page } from "@react-pdf/renderer";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { createFilterOptions, tableCellClasses } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useSnackbar } from "notistack";
import HelpIcon from '@mui/icons-material/Help';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { CertificatesContext } from '../../../context/CertificatesContext';
import CMERulesPopup from "./viewRulePopup";
import HelpPopup from "./helpPopup";
import useBreakpoints from "../../../hooks/useBreakpoints";
import { IOSSwitch } from "../../../components/CMECompliance";

function FilterPanel({
    states_options,
    my_state,
    setMyState,
    setDialogError,
    GenerateReport,
    setShowRule,
    showRule,
    setHelpPopup,
    helpPopup,
    selectedStates,
    setSelectedStates,
    errorDialog,
    errorDialogMsg,
    reportGenerated,
    setExapndAll,
    setLoading,
    loading,
}) {
    const { isMobile } = useBreakpoints();
    const [request_type, setRequestType] = useState('renewal');
    const [license_type, setLicenseType] = useState('Full');
    const [onFocus, setOnFocus] = useState(false);

    const CustomPopper = (props) => {
        return (
            <Tooltip
                componentsProps={{
                    tooltip: {
                        sx: {
                            textAlign: 'center',
                            backgroundColor: '#FFF',  // White background
                            color: '#9B1C1C',           // Maroon text color
                            fontSize: '12px',          // Optional: Adjust text size if needed
                            border: '1px solid #F3F3F3', // Optional: Add a border to the tooltip
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        },
                    },
                }}
                open={selectedStates.length >= 5 && onFocus}
                title="You can select up to 5 states only" // Your tooltip text here
                placement="bottom" // Tooltip position
            >
                <Popper {...props} />
            </Tooltip>
        );
    };

    return (
        <>
            <Grid container direction="row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                <Grid container size={{ xs: 12, md: 8 }} style={{ display: 'flex', alignItems: 'center', gap: "10px" }}>
                    <Grid size={2} style={{ width: '50px' }}>
                    <Box
                            sx={{
                                height: 50,
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: "10px",
                            }}
                        >
                            <Tooltip title='Enabling this will show only those states for which you have uploaded your physician license in state drop down' arrow>
                            <Typography>My State</Typography>
                            </ Tooltip>
                            <IOSSwitch
                                checked={my_state}
                                onChange={() =>{
                                    localStorage.setItem('my_comp_my_state',my_state?false:true);
                                    setMyState(prev=>!prev);
                                    setSelectedStates([]);
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Autocomplete
                            multiple
                            disableCloseOnSelect
                            disableClearable={loading}
                            id="states-select"
                            // PopperComponent={CustomPopper}
                            options={
                                my_state
                                    ? states_options.sort((a, b) => {
                                        if (selectedStates.length === 0) {
                                            return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
                                        } else {
                                            const isASelected = selectedStates.some((state) => state.id === a.id);
                                            const isBSelected = selectedStates.some((state) => state.id === b.id);
                                            return isBSelected - isASelected;
                                        }
                                    })
                                    : states.sort((a, b) => {
                                        if (selectedStates.length === 0) {
                                            return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
                                        } else {
                                            const isASelected = selectedStates.some((state) => state.id === a.id);
                                            const isBSelected = selectedStates.some((state) => state.id === b.id);
                                            return isBSelected - isASelected;
                                        }
                                    })
                            }
                            value={selectedStates} // Bind to the selectedStates array
                            onChange={(event, newValue) => {
                                // Prevent more than 5 selections
                                setSelectedStates(newValue);
                            }}
                            getOptionLabel={(option) => option.name} // Customize the label based on the state object
                            renderTags={(value, getTagProps) => {
                                // Conditionally render label based on the length of selectedStates
                                if (selectedStates.length === 1) {
                                    return <p>State: 1</p>;
                                } else {
                                    return <p>States: {selectedStates.length}</p>;
                                }
                            }}
                            renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        onFocus={() => setOnFocus(true)}
                                        onBlur={() => setOnFocus(false)}
                                        label={selectedStates.length == 1 ? 'State' : 'States'}
                                        variant="outlined"
                                        InputProps={{
                                            ...params.InputProps,
                                            style: { height: '50px' }, // Adjust input height here
                                        }}
                                    />
                               

                            )}
                            renderOption={(props, option, { selected }) => {
                                // Disable the checkbox if the maximum number of selections is reached and the current option is not already selected
                                const isDisabled = false;

                                return (
                                    <li {...props} style={{ height: '40px', cursor: selectedStates.length >= 5 ? 'default' : 'pointer' }}> {/* Adjust the height as needed */}
                                        <Checkbox
                                            checked={selected}
                                            disabled={isDisabled} // Disable checkbox when the condition is met
                                            style={{ marginRight: 8 }}
                                        />
                                        <ListItemText primary={option.name} />
                                    </li>
                                );
                            }}
                            isOptionEqualToValue={(option, value) => option.id === value.id} // Use unique identifier for comparison
                        />
                    </Grid>


                    <Grid size={{ xs: 12, md: 3 }}>
                        <Button
                            disabled={selectedStates.length === 0}
                            fullWidth
                            onClick={()=>GenerateReport('button')}
                            style={{
                                color: '#fff',
                                backgroundColor: selectedStates.length === 0 ? '#A9A9A9' : '#0B66BF', // Change color when disabled
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '16px',
                                height: '50px',
                                cursor: selectedStates.length === 0 ? 'not-allowed' : 'pointer', // Change cursor when disabled
                                opacity: selectedStates.length === 0 ? 0.6 : 1, // Dim the button when disabled
                            }}
                        >
                            Generate Report
                        </Button>

                    </Grid>
                    {
                        selectedStates.length > 0
                        &&
                        <Grid size={{ xs: 12, md: 2 }}>
                            <Button
                                fullWidth
                                disabled={selectedStates.length === 0}
                                onClick={() => setShowRule(true)}
                                color="primary"
                                variant="outlined"
                                style={{
                                    height: '50px',
                                    color: selectedStates.length === 0 ? '#A9A9A9' : '#1976D2', // Gray text when disabled, primary color otherwise
                                    borderColor: selectedStates.length === 0 ? '#D3D3D3' : '#1976D2', // Gray border when disabled, primary otherwise
                                    backgroundColor: selectedStates.length === 0 ? '#F5F5F5' : 'transparent', // Light gray background when disabled
                                    cursor: selectedStates.length === 0 ? 'not-allowed' : 'pointer', // 'not-allowed' cursor when disabled
                                }}
                            >
                                View Rules
                            </Button>

                        </Grid>
                    }
                    <Grid size={{ xs: 12, md: 1 }}>
                        <span className="help_button"
                            onClick={() => setHelpPopup(true)}
                        >
                            <HelpIcon sx={{ fontSize: 30 }} color="primary" />
                            <label style={{ textDecoration: 'underline', cursor: 'pointer' }}>Help</label>
                        </span>
                    </Grid>


                </Grid>
                {
                    reportGenerated && selectedStates.length!=0 &&
                    <Grid container isize={{ xs: 12, md: 2 }}>
                        <div >
                            <div style={{
                                '@media (min-width: 960px)': {
                                    display: 'flex', justifyContent: 'flex-end'
                                }
                            }}>
                                <span style={{ fontSize: isMobile && '14px', display: 'inline-block', flexDirection: 'row', width: 'fit-content', justifyContent: 'flex-end' }}>
                                    {true && <React.Fragment>
                                        <p> <strong style={{ fontWeight: '600' }}> License Type :  </strong> {CME_LicenseType.find(it => it.value == license_type).label} <br /> <strong style={{ fontWeight: '600' }}> Request Type :  </strong> {CME_RequestType.find(it => it.value == request_type).label}

                                        </p>
                                    </React.Fragment>
                                    }

                                </span>
                            </div>
                        </div>
                    </Grid>
                }
            </Grid>

            <Dialog
                open={errorDialog}
                onClose={() => setDialogError(false)}
                PaperProps={{
                    style: {
                        height: 'fit-content',
                        paddingBottom: '20px'
                    },
                }}
            >
                <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <DialogTitle>
                        Note
                    </DialogTitle>
                </div>
                <DialogContent style={{ width: '500px' }}>
                    <DialogContentText>{errorDialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button variant="contained" style={{ background: '#2872C1' }} color="primary" onClick={() => setDialogError(false)}>Ok</Button>
                </DialogActions>
            </Dialog>
            {selectedStates.length > 0 &&
                <CMERulesPopup showRule={showRule} setShowRule={setShowRule} selectedStates={selectedStates} />
            }

            <HelpPopup helpPopup={helpPopup} setHelpPopup={setHelpPopup} />
        </>
    )
}

export default FilterPanel
