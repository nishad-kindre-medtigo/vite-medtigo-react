import { Typography } from '@mui/material';
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { Box, Grid, IconButton } from '@mui/material';
import { CME_RequestType, states } from 'src/appConstants';
import moment from 'moment';
import { StateWiseRenew } from 'src/views/StateCompliance';
import useBreakpoints from 'src/hooks/useBreakpoints';
import ReportContainer from './reportContainer';
import { ComplianceTag, ComplianceTagSmall, PageNav } from '..';
import BackButtonWithTitle from 'src/components/Reports';


function SingleUserSingleState() {
    const location = useLocation();
    const { isMobile } = useBreakpoints();
    const [state, setState] = useState('3993767000000019003');
    const [user, setUser] = useState('3993767000000019003');
    const [renewal,setRenewal]=React.useState(2);
    const data = location.state?.data;
    const {licenseStatus} = location.state;
    React.useEffect(() => {
        if (data) {
            setReportData(data)
        }
    }, [data])

    React.useEffect(() => {
    }, [state])

    const setReportData = (data) => {
        setUser(data.userName == 'N/A' ? data.email : data.userName)
        setState(data.state)
        let renewal = StateWiseRenew(data.state) / 365
        const renewalCycle = renewal == 1 ? ' Year' : ' Years';
        setRenewal(renewal+' '+renewalCycle);
    }
    // state name
    // user email
    return (
        <>
            <Grid container display={'flex'} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Grid style={{ display: "flex", flexDirection: 'column'}}>
                    <Box mb={2}>
                    <BackButtonWithTitle Title={`Compliance Report for ${user}`}/>
                    </Box>
                </Grid>

                <Grid>
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
            <ReportContainer compliance_report={data.compliance_report} title={states.find(it => it.id == state).name} state={states.find(it => it.id == state).name} licenseStatus={licenseStatus} isCompliant={data.isProviderCompliant}/>
        </>
    )
}



export default SingleUserSingleState
