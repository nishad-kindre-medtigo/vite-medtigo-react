import React, { useContext, useRef } from 'react'
import { useLocation } from 'react-router-dom';
import ReportContainer from './reportContainer';
import { CME_RequestType, designations, states } from '../../../appConstants';
import { Box, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Tooltip, Typography } from '@mui/material';
import { StateWiseRenew } from '../../../views/StateCompliance';
import useBreakpoints from 'src/hooks/useBreakpoints';
import { ClickableComplianceTag, ComplianceTag, DefaultPlaceHolder, PageNav } from '../index';
import moment from 'moment';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleUp';
import { scrollToTopButtonStyle } from '../style_guides';
import BackButtonWithTitle from '../../Reports';
import { InfoDialog, InfoIconTooltip } from '../../../views/AdminView/LicenseReports/Components';
import { ReportFilterContext } from 'src/context/ReportFilterContext';

function SingleUserMultiState() {
    const location = useLocation();
    const { isMobile } = useBreakpoints();
    const [open, setOpen] = React.useState(false);
    const [complianceState, setComplianceState] = React.useState('Not Compliant State');
    const data = location.state?.data || [];
    const departmentName = location.state?.departmentName || null;
    const [notCompliantOn, isNotCompliantOn]=React.useState(true);
    const stats = location.state?.stats || { nonCompliantStates: {count:0}, compliantStates: {count:0} };
    const topRef = useRef(null);
    const scrollToTop = () => {
        topRef.current.scrollIntoView({ behavior: 'smooth' });
      };
      const handleOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);
        const handleChange = (event) => {
            isNotCompliantOn(!notCompliantOn);
            setComplianceState(event.target.value);
          };
    if(!data[0]){
        return <DefaultPlaceHolder title='No reports available' />  
    }
    return (
        <>
        {/* <Tooltip title='Scroll to top'>
         <IconButton size='large' color='info' onClick={scrollToTop} style={scrollToTopButtonStyle}>
         <ArrowCircleLeftIcon/>
        </IconButton>
        </Tooltip> */}
            <Grid container display={'flex'} direction={'row'} justifyContent={'space-between'} alignItems={'center'} style={{marginBottom:'10px'}}>
                <Grid ref={topRef} item>
                    <Box mb={2} sx={{display:'flex', alignItems:'center'}}>
                    <BackButtonWithTitle title={`${data[0].userName != 'N/A' ? data[0].userName : data[0].email}`}/>
                    <div style={{marginBottom:'15px'}}>
                    <InfoIconTooltip onClick={handleOpen}/>
                    </div>
                    </Box>
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
                                    background: '#F2F2F2',
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
                        <Box sx={{ padding: '10px', borderRadius: '2px',background: '#F2F2F2' }}>
                            <Typography variant='h6' >{notCompliantOn ? stats.nonCompliantStates.count : stats.compliantStates.count}</Typography>
                        </Box>

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
            {(notCompliantOn && stats.nonCompliantStates.count == 0) ?
                <DefaultPlaceHolder title='No reports available' />
                : (!notCompliantOn && stats.compliantStates.count == 0) ?
                    <DefaultPlaceHolder title='No reports available' />
                    :
                data.length > 0 ?
                    data.map((item, index) => {
                        const expirationDate = moment(item.licenseExpirationDate); // Adjust the format as needed
                        const isLicenseUploaded = item.isLicenseUploaded; // Adjust the format as needed
                        const today = moment();
                        let differenceInDays=null
                        if (!isLicenseUploaded) differenceInDays = 'Not uploaded';
                        else{
                            differenceInDays = expirationDate.diff(today, 'days');
                            if (differenceInDays <= 0) differenceInDays = 'Expired';
                        }
                        const renewal = StateWiseRenew(item.state) / 365
                        const renewalCycle = renewal == 1 ? ' Year' : ' Years'
                        const state = states.find(it => it.id == item.state)?.name;
                        
                        if ((notCompliantOn && !item.isProviderCompliant) || (!notCompliantOn && item.isProviderCompliant)) {
                            return (
                                <ReportContainer
                                    key={index}
                                    expirationDate={moment(expirationDate).format('D MMM, YYYY')}
                                    licenseStatus={differenceInDays}
                                    isCompliant={item.isProviderCompliant}
                                    compliance_report={item.compliance_report}
                                    state={state}
                                    title={'Compliance Report for '+state}
                                />
                            );
                        }
                        
                    })
                    : null
            }
            <InfoDialog
                    open={open}
                    title="User information:"
                    details={[
                        { label: 'Email', value: data[0].email},
                        { label: 'Profession', value: designations.find(des=>des.id==data[0].profession_id)?.name },
                        { label: 'Department', value:departmentName}
                      ]}
                    onClose={handleClose}
                  />
             {/* </Box> */}
        </>
    )
}

export default SingleUserMultiState
