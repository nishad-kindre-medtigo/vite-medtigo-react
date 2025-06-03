import React, { useEffect, useState } from "react"
import { cme_states as states } from 'src/appConstants';
import './style.css';
import { useSelector } from "react-redux";
import StateSpecificCMECervices from 'src/services/stateSpecificCMEService';
import { Box, Grid, TableCell } from '@mui/material';
import { tableCellClasses } from "@mui/material";
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import FilterPanel from "./Components/filterPanel";
import { PlaceHolder } from "../AdminView/TeamCompliance/components";
import StatesAccordian from "./Components/statesAccordian";
import AllStatesReports from "./Components/allStatesReports";
import { useParams } from "react-router-dom";
import SingleReport from "./Components/singleReport";

export const StyledTableCell = (props) => (
    <TableCell
      {...props}
      sx={{
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: '#FAFAFA',
          color: 'black', // Replace `theme.palette.common.black` with static value
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }}
    />
  );

export const StateWiseRenew = (state) => {
    let renewalYear = 730;

    if (state == '3993767000000047571') { // Michigan state
        renewalYear = 1095;
    } else if (state == '3993767000000047211') { // Kentucky state
        renewalYear = 1095;
    }
    else if (state == '3993767000000047427') { // Alabama state
        renewalYear = 365;
    } else if (state == '3993767000000047139') { // Arkansas state
        renewalYear = 365;
    } else if (state == '3993767000000047491') { // Illinois state
        renewalYear = 1095;
    } else if (state == '3993767000000047199') { // Kansas state
        renewalYear = 365;
    } else if (state == '3993767000000047539') { // Louisiana state
        renewalYear = 365;
    } else if (state == '3993767000000047235') { // Minnesota state
        renewalYear = 1095;
    } else if (state == '3993767000000047743') { // Nevada state
        renewalYear = 1095;
    } else if (state == '3993767000000047311') { // North Dakota state
        renewalYear = 1095;
    } else if (state == '3993767000000047631') { // Louisiana state
        renewalYear = 365;
    } else if (state == '3993767000000026017') { // Connecticut state
        renewalYear = 365;
    } else if (state == '3993767000000047391') { // Washington state
        renewalYear = 1460;
    } else if (state == '3993767000000023401') { // Wyoming state
        renewalYear = 1095;
    }
    return renewalYear;
}

function CMEFeature({ className, showTracker = () => {}}) {
    const { user } = useSelector((state) => state.account);
    const [selectedPreferences, setSelectedPreferences] = useState([]);
    const [states_options, setStates] = useState(states);
    const [selectedStates, setSelectedStates] = useState(JSON.parse(sessionStorage.getItem('my_comp_selected_states')) || []);
    const [addCert, setAddCertDrawe] = useState(false);
    const [errorDialog, setDialogError] = useState(false);
    const [errorDialogMsg, setDialogErrorMsg] = useState('');
    const [showRule, setShowRule] = React.useState(false);
    const [my_state, setMyState] = React.useState(JSON.parse(sessionStorage.getItem('my_comp_my_state'))||false);
    const [loading, setLoading] = useState(false);
    const [helpPopup, setHelpPopup] = useState(false);
    const [reportGenerated, setReportGenerated] = useState(false);
    const [filterChanged, setFilterChanged] = useState(false);
    const openSnackbar = useOpenSnackbar();
    const [userStats, setUserStats] = useState([]);
    const [stateStats, setStateStats] = useState([]);
    const [complianceReport, setComplianceReports] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const { type } = useParams();

    useEffect(() => {
        if (!addCert) {
            getUserPreferences()
        }
    }, [addCert])

    const getUserPreferences = async () => {
        try {
            let res = await StateSpecificCMECervices.GetMyStates();

            if (res.states) {
                res.states.sort(function (a, b) {
                    var textA = a.name;
                    var textB = b.name;
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });
                setSelectedPreferences(res.states);
                if (res.states.length >= 1) {
                    const localmyState = JSON.parse(localStorage.getItem('my_comp_my_state')) ;
                    setMyState(localmyState??true)
                }
                setStates(res.states);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const GenerateReport = async (source) => {
        if ((type && type.includes('type'))) {
            return;
          }
        setLoading(true)
        try {
            setReportGenerated(false);
            // NEED TO GET CERTIFICATE ID OF SELECTED PROFESSION
            let statesList = selectedStates || JSON.parse(sessionStorage.getItem('my_comp_selected_states'));
            
            if (selectedStates && selectedStates.length > 0) {
                statesList = selectedStates.map((item) => item.id);
            }
            if(!user.id || statesList.length == 0){
                setLoading(false)
                return;
            }
            let payload = {
                states_list: statesList,
                userIDs: [user.id],
                deptIds: [219],
                all_states: selectedStates.length >= 50,
                all_users: false,
                selfReport: true
            };
            
            let res = null;
            if (!res) {
                res = await StateSpecificCMECervices.GenerateTeamCMEReport(payload);
            }
            
            setUserStats(res.userStats)
            setStateStats(res.stateStats)
            const sortedData = res.user_compliance_data.sort((a, b) => {
                return a.isProviderCompliant - b.isProviderCompliant; // Descending order: `true` first
                // return a.isLicenseUploaded - b.isLicenseUploaded; // Ascending order: `false` first
            });
            setComplianceReports(sortedData)
            setReportGenerated(true);
            
            sessionStorage.setItem('my_comp_selected_states', JSON.stringify(selectedStates))
            sessionStorage.setItem('my_comp_report_generated', true)
            sessionStorage.setItem('my_comp_payload', JSON.stringify(payload))
            if(source=='button'){
                openSnackbar(res.msg || 'Report generated!');
            }
            setLoading(false)
            setFilterChanged(false);
        } catch (error) {
            setLoading(false)
            console.log(error);
            openSnackbar('Failed to generate report!', 'error');
        }
    }

    React.useEffect(() => {
        if (selectedStates.length == 0) {
            setUserStats([])
            setStateStats([])
            setComplianceReports([])
            setReportGenerated(false);
            sessionStorage.removeItem('my_comp_compliance_data')
        }
        else if(selectedStates){
            setFilterChanged(true);
        } 
        
    }, [selectedStates, my_state])

    React.useEffect(() => {
        GenerateReport();
    }, [])

    if (type == 'my-compliance-reports') { // all state report
        return (
            <Box py={2} paddingTop={4}>
                <AllStatesReports />
            </Box>
        )
    }
    else if (type == 'my-compliance-report') { // single user single state report
        return (
            <Box py={2} paddingTop={4}>
                <SingleReport />
            </Box>
        )
    }
    return (
        <div style={{ marginBottom: 20 }}>
            <Grid>
                <FilterPanel
                    states_options={states_options}
                    my_state={my_state}
                    setMyState={setMyState}
                    setDialogError={setDialogError}
                    errorDialog={errorDialog}
                    errorDialogMsg={errorDialogMsg}
                    GenerateReport={(v)=>GenerateReport(v)}
                    setShowRule={setShowRule}
                    showRule={showRule}
                    setHelpPopup={setHelpPopup}
                    helpPopup={helpPopup}
                    selectedStates={selectedStates}
                    setSelectedStates={setSelectedStates}
                    reportGenerated={reportGenerated}
                    setLoading={setLoading}
                    loading={loading}
                    showTracker={showTracker}
                />

                {
                    selectedStates.length == 0 ? <PlaceHolder title={'Please apply filter to generate report'} /> :
                    loading ? <PlaceHolder loading={true} title={'Generating report...'} /> :
                        (selectedStates.length > 0 && !reportGenerated ) ? <PlaceHolder title={'Click on GENERATE REPORT'} /> :
                                userStats.length > 0 && complianceReport.length > 0 &&
                                    <StatesAccordian
                                        userId={user.id}
                                        tableHeadData={userStats[0]}
                                        stateData={stateStats}
                                        complianceReports={complianceReport}
                                        my_state={my_state}
                                    />
                }
            </Grid>
        </div>
    )
}


export default CMEFeature;