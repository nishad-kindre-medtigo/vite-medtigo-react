import React, { useState } from 'react';
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AccordionBox, AccordionHead, AccordionTabs, AccordionExpandIcon, StatesButton, styles, UserAccordionTabs } from '.';
import useBreakpoints from 'src/hooks/useBreakpoints';
import { ReportTypes, states } from 'src/appConstants';
import { Link } from 'react-router-dom';
import { StateWiseRenew } from '../../../../views/StateCompliance';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefaultRounded';
import CheckBoxIcon from '@mui/icons-material/CheckBoxRounded';
import moment from 'moment';
import MailOutlineIcon from '@mui/icons-material/Email';
import { cme_colors } from '../../../../components/CMECompliance/style_guides';

const UserCollapse = ({ userId, title,stateData, selectedStates, nonCompliantStates, compliantStates, tableData, complianceReports, tableHeadData }) => {
  const { isMobile } = useBreakpoints();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [compliance_Reports, setComplianceReports]= useState([])
  // 0 -> non compliant
  // 1 -> compliant

  const handleExpandClick = () => setIsExpanded(prev => !prev);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  }

  React.useEffect(()=>{
    if(tableHeadData.nonCompliantStates.count==0){
      setActiveTab(1);
    }
    let filteredReports=[];
    filteredReports = complianceReports.filter(item => item.userId == tableHeadData.user)
    if(filteredReports.length>0){
      const sortedData = filteredReports.sort((a, b) => {
        return a.isProviderCompliant - b.isProviderCompliant; // Descending order: `true` first
        // return a.isLicenseUploaded - b.isLicenseUploaded; // Ascending order: `false` first
      });
      setComplianceReports(sortedData)
      
      // If any state does not have cme equirement for renewal then for that we are getting total_credits_required==-1
    }

  },[tableData,title,complianceReports])


  return (
    <AccordionBox>
      {/* ACCORDION TITLE */}
      <AccordionHead isExpanded={isExpanded}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        <Box style={{ display: 'flex', flexDirection:'row', alignItems: 'center' }}>
            <Typography style={{ fontSize: '20px', fontWeight: '500', marginRight:'10px' }}>
              {title}
            </Typography>

            <Tooltip arrow title={tableHeadData.email}>
              <MailOutlineIcon />
            </Tooltip>
          </Box>
          <Box style={{ display: 'flex', flexDirection:'row', alignItems: 'center' }}>
          {!isMobile && <UserAccordionTabs tableHeadData={tableHeadData} isExpanded={isExpanded} activeTab={activeTab} handleTabChange={handleTabChange} isMobile={isMobile} />}
          <IconButton onClick={handleExpandClick}>
            <AccordionExpandIcon />
          </IconButton>
          </Box>

        </Box>

        {isMobile && <UserAccordionTabs tableHeadData={tableHeadData} isExpanded={isExpanded} activeTab={activeTab} handleTabChange={handleTabChange} isMobile={isMobile} />}
      </AccordionHead>

      {/* ACCORDION DETAILS */}
      <Collapse in={isExpanded} classes={{ root: 'customRootStyle' }}>
        <TableContainer>
          <Table style={{ minWidth: 650 }} aria-label="collapsible table">
            <TableHead>
              <TableRow style={{ background: '#F9F9F9' }}>
                <TableCell sx={{ px: 4 }} style={styles.tableCell}>State Names</TableCell>
                <TableCell align="center" style={styles.tableCell}>
                  Renewal cycle
                </TableCell>
                <TableCell align="center" style={styles.tableCell}>
                 Expiration
                </TableCell>
                <TableCell align="center" width={250} style={styles.tableCell}>
                 Compliance Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                complianceReports.length > 0 &&
                complianceReports.map(report => {
                  if(tableHeadData.user != report.userId) return;
                  const complianceData = report;
                  const stateName = stateData.find(it => it.state_id == report.state).state;
                  const stateRenwal = StateWiseRenew(report.state) / 365;

                    const expirationDate = moment(report.licenseExpirationDate); // Adjust the format as needed
                    const isLicenseUploaded = complianceData.isLicenseUploaded; // Adjust the format as needed

                    // Calculate today's date
                    const today = moment();

                    // Parse the expiration date
                    
                    // Calculate the difference in days
                    let differenceInDays = expirationDate.diff(today, 'days');
                    if(!isLicenseUploaded) differenceInDays='N/A';
                    else if(differenceInDays<=0) differenceInDays='Expired';
                    else if(differenceInDays==1) differenceInDays=differenceInDays+' day';
                    else if(differenceInDays>1) differenceInDays=differenceInDays+' days';
                  const LinkComp=()=>{return(<Link
                    to={{
                      pathname: `/team-compliance/${ReportTypes.singleUserSingleState}`,
                      state: { data: complianceData || {}, licenseStatus:differenceInDays=='N/A'?'Not uploaded':differenceInDays }
                    }}
                    style={{ color: '#000', fontWeight:'600', fontSize:'16px'  }}
                  >
                    View
                  </Link>)}
                    return (
                      <TableRow key={report}>
                        <TableCell sx={{ py: 0.5, px: 4 }}>
                          {stateName || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ py: 0.5 }} align="center">
                          {stateRenwal} {stateRenwal == 1 ? 'Year' : 'Years'}
                        </TableCell>
                        <TableCell align="center" sx={{ color: differenceInDays == 'Expired' ? cme_colors.nonCompliant : '' }} >
                          {differenceInDays}
                        </TableCell>
                        <TableCell align="center">
                          {
                            report.isProviderCompliant ?
                              <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                                <CheckBoxIcon color='success' />
                                <LinkComp />
                              </Box>
                              :
                              <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                                <DisabledByDefaultIcon color='error' />
                                <LinkComp />
                              </Box>
                          }
                        </TableCell>
                        
                      </TableRow>
                    );
                }) 
              }

            </TableBody>
            {
              compliance_Reports.length>1 &&
            <TableFooter>
              <TableRow>
                <TableCell align="right" colSpan={4} sx={{ py: 1.5, borderBottom: 'none' }}>
                  <Link
                    to={{
                      pathname: `/team-compliance/${ReportTypes.singleUserMultiState}`,
                      state: {stats:tableHeadData, data: compliance_Reports}
                    }}>
                    <Typography style={styles.tableFooter}>
                      View All States Report
                    </Typography>
                  </Link>
                </TableCell>
              </TableRow>
            </TableFooter>
            }
          </Table>
        </TableContainer>
      </Collapse>
    </AccordionBox>
  );

};

export default UserCollapse;
