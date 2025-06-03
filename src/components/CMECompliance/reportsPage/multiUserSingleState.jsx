import React from 'react'
import { useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { Box, Grid, IconButton } from '@mui/material';
import { CME_RequestType, states } from 'src/appConstants.js';
import moment from 'moment';
import useBreakpoints from 'src/hooks/useBreakpoints.js';
import ReportContainer from './reportContainer';
import { ComplianceTag, PageNav } from '../index';

function MultiUserSingleState() {
    const location = useLocation();
    const { isMobile } = useBreakpoints();
    const [state, setState] = React.useState('3993767000000019003');

    const data = location.state?.data;
    const stats = location.state?.stats;

    React.useEffect(() => {
        if (data) {
            setState(states.find(item => item.id == data[0].state).name)
        }
    }, [data])
    return (
        <>
            <Grid container display={'flex'} direction={'row'} justifyContent={'space-between'} alignItems={'center'} style={{marginBottom:'10px'}}>
                <Grid size={12}>
                    <PageNav Title={`Compliance Report for ${state}`} />
                    <Box display={'flex'} gap={'6px'} flexWrap={'wrap'}>
                    <ComplianceTag variant={'standard'} title={`Not compliant users: ${stats.nonCompliantUsers}`}/>
                    <ComplianceTag variant={'standard'} title={`Compliant users: ${stats.compliantUsers}`}/>
                    </Box>
                </Grid>
                <Grid size={12} display={'flex'} direction={'column'} justifyContent={'space-between'} alignItems={'flex-start'}>
                    <span style={{ fontSize: isMobile && '14px', display: 'inline-block', flexDirection: 'row', width: 'fit-content', justifyContent: 'flex-end' }}>
                        {<React.Fragment>
                            <p> <strong style={{ fontWeight: '600' }}> License Type :  </strong> Full License <br /> <strong style={{ fontWeight: '600' }}> Request Type :  </strong> {CME_RequestType[1].label}  <br />

                            </p>
                        </React.Fragment>
                        }
                    </span>
                </Grid>
            </Grid>
            {/* <Box height={800} overflow={'auto'}> */}
            {
                data.length > 0 ?
                        data.map((item, index) => {
                            const expirationDate = moment(item.licenseExpirationDate); // Adjust the format as needed
                            const isLicenseUploaded = item.isLicenseUploaded; // Adjust the format as needed
                            const today = moment();
                            let differenceInDays=null
                            if (!isLicenseUploaded) differenceInDays = 'Not uploaded';
                            else{
                                differenceInDays = expirationDate.diff(today, 'days');
                                if (differenceInDays <= 0) differenceInDays = 'Expired'
                                else differenceInDays = differenceInDays +' days'

                            }
                            
                            return (<ReportContainer key={index} licenseStatus={differenceInDays} isCompliant={item.isProviderCompliant} compliance_report={item.compliance_report} title={item.userName != 'N/A' ? item.userName : item.email} />)})
                    : null
            }
            {/* </Box> */}
        </>
    )
}



export default MultiUserSingleState


