import React, { useRef } from 'react'
import { useLocation } from 'react-router-dom';
import ReportContainer from '../../../components/CMECompliance/reportsPage/reportContainer';
import { CME_RequestType, cme_states, states } from '../../../appConstants';
import { Box, FormControl, Grid, IconButton, MenuItem, Select, Tooltip, Typography } from '@mui/material';
import { StateWiseRenew } from '../../StateCompliance';
import useBreakpoints from 'src/hooks/useBreakpoints';
import moment from 'moment';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleUp';
import { PageNav } from '../../AdminView/TeamCompliance/components';
import { DefaultPlaceHolder, PlaceHolder } from '../../../components/CMECompliance';
import { useParams } from 'react-router-dom';
import StateSpecificCMECervices from 'src/services/stateSpecificCMEService';

function SingleUserMultiState() {
    const location = useLocation();
    const { isMobile } = useBreakpoints();
    const [notCompliantOn, isNotCompliantOn]=React.useState(true);
    const [stats, setStats]=React.useState(null);
    const [data, setData]=React.useState(null);
    const [loading, setLoading]=React.useState(null);
    const [complianceState, setComplianceState] = React.useState('Not Compliant State');
    
    const topRef = useRef(null);
    const { userId,stateId } = useParams();
    
    React.useEffect(() => { 
        (async () => {
                setLoading(true);
                await generateReport();
                setLoading(false);
            })();
    }, [])
    const scrollToTop = () => {
        topRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    

    const handleChange = (event) => {
        isNotCompliantOn(!notCompliantOn);
        setComplianceState(event.target.value);
      };



    const generateReport = async () => {
        try {
            const allStatesSelected = stateId === 'all';
            let states_list = allStatesSelected
                ? cme_states.map(it => it.id)
                : stateId.split(',');

                // i want to check the states_list if it valid id or not
                // if it is not valid remove it from list
                const validStates = cme_states.map(it => it.id);
                states_list = states_list.filter(it => validStates.includes(it));

            const payload = {
                states_list,
                userIDs: [userId],
                deptIds: [],
                all_states: allStatesSelected,
                all_users: false,
                selfReport: true,
            };

            const res = await StateSpecificCMECervices.GenerateTeamCMEReport(payload);
            if(res.user_compliance_data.length > 0){
            setStats(res.userStats?.[0] || {});
            setData(res.user_compliance_data || []);
            // setStats(res.user_compliance_data[0])
            }
        } catch (error) {
            console.log(error);
        } finally{
            setLoading(false);
        }
    }

    if(!stats || !data)
        return (<> 
        <Typography variant='h5' style={{textAlign:'center', marginTop:'20px'}}>No reports available</Typography>
        </>)
    else if(loading)
        return (<> 
        <PlaceHolder loading title={'Fetching complete report'}/>
         </>)

    return (
        <>
            {/* <Tooltip title='Scroll to top'>
         <IconButton size='large' color='info' onClick={scrollToTop} style={scrollToTopButtonStyle}>
         <ArrowCircleLeftIcon/>
        </IconButton>
        </Tooltip> */}
            <Grid container display={'flex'} direction={'row'} justifyContent={'space-between'} alignItems={'center'} style={{ marginBottom: '10px' }}>
                <Grid ref={topRef} item>
                    <PageNav backTo={'/monitoring-renewal/ce-cme/report'} Title={`Compliance Report`} />
                    <Box 
                    display={'flex'} alignItems={'center'} gap={'6px'} flexWrap={'wrap'}>
                    <FormControl
                        fullWidth
                        variant="filled"
                        style={{
                            width: '250px',
                            fontWeight: '600',
                            boxShadow: 'none',
                            border: 'none',
                        }}
                    >
                        <Select
                            disableUnderline
                            value={complianceState}
                            onChange={handleChange}
                            labelId="compliance-select-label"
                            displayEmpty
                            sx={{
                                background:'#F2F2F2',
                                fontWeight: '600',
                                padding: '5px', // Padding for the selected value
                                '& .MuiSelect-select': {
                                    padding: '10px', // Padding inside the select box for the selected text
                                },
                            }}
                        >
                            <MenuItem value={'Not Compliant State'}>Not Compliant State</MenuItem>
                            <MenuItem value={'Compliant State'}>Compliant State</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{padding:'10px', borderRadius:'2px',background: '#F2F2F2'}}>
                        <Typography variant='h6' >{notCompliantOn?stats.nonCompliantStates.count:stats.compliantStates.count}</Typography>
                    </Box>
                    </Box>
                </Grid>
                <Grid display={'flex'} direction={'column'} justifyContent={'space-between'} alignItems={'flex-start'}>
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
            {(notCompliantOn && stats.nonCompliantStates.count == 0) ?
                <DefaultPlaceHolder title='No reports available.' />
                : (!notCompliantOn && stats.compliantStates.count == 0) ?
                    <DefaultPlaceHolder title='No reports available' />
                    :
                    data.length > 0 ?

                        data.map(item => {
                            const expirationDate = moment(item.licenseExpirationDate); // Adjust the format as needed
                            const isLicenseUploaded = item.isLicenseUploaded; // Adjust the format as needed
                            const today = moment();
                            let differenceInDays = null
                            if (!isLicenseUploaded) differenceInDays = 'Not uploaded';
                            else {
                                differenceInDays = expirationDate.diff(today, 'days');
                                if (differenceInDays <= 0) differenceInDays = 'Expired';
                            }
                            const renewal = StateWiseRenew(item.state) / 365
                            const renewalCycle = renewal == 1 ? ' Year' : ' Years'
                            const state = states.find(it => it.id == item.state)?.name;
                            if ((notCompliantOn && !item.isProviderCompliant) || (!notCompliantOn && item.isProviderCompliant)) {
                                return (
                                    <ReportContainer
                                        key={state}
                                        expirationDate={moment(expirationDate).format('D MMM, YYYY')}
                                        licenseStatus={differenceInDays}
                                        isCompliant={item.isProviderCompliant}
                                        compliance_report={item.compliance_report}
                                        state={state}
                                        title={state}
                                    />
                                );
                            }
                        })
                        : null
            }

            {/* </Box> */}
        </>
    )
}

export default SingleUserMultiState