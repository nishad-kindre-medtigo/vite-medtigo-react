import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { CME_RequestType, cme_states, states } from 'src/appConstants';
import moment from 'moment';
// import { StateWiseRenew } from '../../../StateCompliance';
import useBreakpoints from 'src/hooks/useBreakpoints';
import ReportContainer from '../../../components/CMECompliance/reportsPage/reportContainer';
import { ComplianceTag, ComplianceTagSmall, PageNav } from '../../AdminView/TeamCompliance/components';
import { useParams } from "react-router-dom";
import StateSpecificCMECervices from 'src/services/stateSpecificCMEService';
import { PlaceHolder } from '../../../components/CMECompliance';


function SingleReport() {
    const { isMobile } = useBreakpoints();
    const [state, setState] = useState('3993767000000019003');
    const [data,setData]=React.useState(null);
    const [licenseStatus,setLicenseStatus]=React.useState(null);
    const { userId,stateId } = useParams();
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        if (userId && stateId) {
            (async () => {
                setIsLoading(true);
                setState(stateId)
                await generateReport();
                setIsLoading(false);
            })();
        }
    }, [userId, stateId]);
    

    const generateReport=async()=>{
        try {
            const allStatesSelected = stateId === 'all';
            let states_list = allStatesSelected
                ? cme_states.map(it => it.id)
                : stateId.split(',');

            let payload = {
                states_list: states_list,
                userIDs: [userId],
                deptIds: [],
                all_states: false,
                all_users: false,
                selfReport: true
            };
            
            let res = null;
            if (!res) {
                res = await StateSpecificCMECervices.GenerateTeamCMEReport(payload);
            }
        setData(res.user_compliance_data[0])
        setLicenseStatus(setDetails(res.user_compliance_data[0]));
        } catch (error) {
            console.log(error);
        }
    }

    const setDetails = (data) => {
        const report = data;
        const expirationDate = moment(report.licenseExpirationDate); // Adjust the format as needed
        const isLicenseUploaded = report.isLicenseUploaded; // Adjust the format as needed
        
        // Calculate today's date
        const today = moment();

        // Parse the expiration date

        // Calculate the difference in days
        let differenceInDays = expirationDate.diff(today, 'days');
        if (!isLicenseUploaded) differenceInDays= 'Not uploaded';
        else if (differenceInDays <= 0) differenceInDays = 'Expired';
        return differenceInDays;
    }
    // implement loading state for if data==null
    if (isLoading)
        return (<>
            <PlaceHolder loading title={'Fetching complete report'} />
        </>)
    else if (!data)
        return (<>
            <Typography variant='h5' style={{ textAlign: 'center', marginTop: '20px' }}>No reports available</Typography>
        </>)
    return (
        <>
            <Grid container display={'flex'} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Grid style={{ display: "flex", flexDirection: 'column'}}>
                    <PageNav backTo={'/monitoring-renewal/ce-cme/report'} Title={`Compliance Report`} /> 
                </Grid>

                <Grid item>
                    <span style={{ fontSize: isMobile && '14px', display: 'inline-block', flexDirection: 'row', width: 'fit-content', justifyContent: 'flex-end' }}>
                        {<React.Fragment>
                            <p> <strong style={{ fontWeight: '600' }}> State License Type :  </strong> Full License <br /> <strong style={{ fontWeight: '600' }}> Request Type :  </strong> {CME_RequestType[1].label}  <br />
                            </p>
                        </React.Fragment>
                        }

                    </span>
                </Grid>

            </Grid>
            {/* report starts here */}
            <ReportContainer 
            expirationDate={moment(data.licenseExpirationDate).format('D MMM, YYYY')}
            compliance_report={data.compliance_report} 
            title={states.find(it => it.id == state).name} 
            state={states.find(it => it.id == state).name} 
            licenseStatus={licenseStatus} 
            isCompliant={data.isProviderCompliant}
            showStatus={true}/>
        </>
    )
}



export default SingleReport