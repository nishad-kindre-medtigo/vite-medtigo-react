import React, { useState, useEffect } from 'react';
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckBoxIcon from '@mui/icons-material/CheckBoxRounded';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefaultRounded';
import { AccordionBox, AccordionHead, AccordionTabs, AccordionExpandIcon, StatesButton, styles } from '.';
import useBreakpoints from 'src/hooks/useBreakpoints';
import { ReportTypes, states } from 'src/appConstants';
import { Link } from 'react-router-dom';
import { cme_colors } from 'src/components/CMECompliance/style_guides';
import moment from 'moment';
const StateCollapse = ({ firstItem, title, tableData, complianceReports, tableHeadData, selectedState, setSelectedState }) => {
  const { isMobile } = useBreakpoints();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [stateName,setStateName] = useState(null)
  const [compliance_Reports, setComplianceReports]= useState([])
  const [no_requirement, setNoCMERequirement]= useState(false)
  // 0 -> non compliant
  // 1 -> compliant
  const [isActive, setIsActive] = useState(false); // Local state to keep accordion highlighted

  const handleExpandClick = () => setIsExpanded(prev => !prev);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  }
  
  useEffect(()=>{
    if(complianceReports && title && tableData){
      title && setStateName(states.find(it=>it.id==title).name);
      let filteredReports=[];
      filteredReports = complianceReports.filter(item=>item.state==title)
      // filteredReports = filteredReports.sort((a, b) => b.isProviderCompliant - a.isProviderCompliant);
      if(filteredReports.length>0){
        const sortedData = filteredReports.sort((a, b) => {
          return a.isProviderCompliant - b.isProviderCompliant; // Descending order: `true` first
          // return a.isLicenseUploaded - b.isLicenseUploaded; // Ascending order: `false` first
        });
        setComplianceReports(sortedData)
        
        // If any state does not have cme equirement for renewal then for that we are getting total_credits_required==-1
        setNoCMERequirement(filteredReports[0].compliance_report.total_credits_required==-1)
      }
    }
  },[tableData,title,complianceReports])

    // Scroll to the current certificate (accordion) when selectedState changes
    useEffect(() => {
      if (title === selectedState) {
        setIsActive(true); // Highlight the accordion

        // Find the element using its ID and scroll to it
        const element = document.getElementById(title); // Use the title as the ID
        if (element) {
          window.scrollTo({
            top: element.offsetTop, // Scroll to the top of the element
            behavior: 'smooth', // Smooth scroll
          });
        }

        // Reset `selectedState` after scrolling is complete
        setTimeout(() => {
          setSelectedState(null); // Call parent handler to reset the state
        }, 1000); // Adjust timeout duration as needed
      }
    }, [selectedState, title]); 

    return (
      <Box id={title}>
      <AccordionBox sx={{ mt: firstItem ? 0 : 2 }} selected={isActive || title === selectedState}>
        {/* ACCORDION TITLE */}
        <AccordionHead isExpanded={isExpanded}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ px:2 }} style={{ flexGrow: 1, fontSize: '20px', fontWeight: '500' }}>
              {stateName}
            </Typography>
            {!isMobile && <AccordionTabs tableHeadData={tableHeadData} isMobile={isMobile} />}
            <IconButton onClick={handleExpandClick}>
              <AccordionExpandIcon />
            </IconButton>
          </Box>
  
          {isMobile && <AccordionTabs tableHeadData={tableHeadData} isMobile={isMobile} />}
        </AccordionHead>
  
        {/* ACCORDION DETAILS */}
        <Collapse in={isExpanded} classes={{ root: 'customRootStyle' }}>
          <TableContainer>
            <Table style={{ minWidth: 650 }} aria-label="collapsible table">
              <TableHead>
                <TableRow style={{ background: '#F9F9F9' }}>
                  <TableCell sx={{ px:4 }} style={styles.tableCell}>User Names</TableCell>
                  <TableCell align="left" style={styles.tableCell}>
                    Email Address
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
                {tableData.map((row, index) => {
                    let isReportAvailable=complianceReports.find(item =>row.user==item.userId && title==item.state)
                    if(!isReportAvailable) return;

                    const expirationDate = moment(isReportAvailable.licenseExpirationDate); // Adjust the format as needed
                    const isLicenseUploaded = isReportAvailable.isLicenseUploaded; // Adjust the format as needed

                    // Calculate today's date
                    const today = moment();

                    // Parse the expiration date
                    
                    // Calculate the difference in days
                    let differenceInDays = expirationDate.diff(today, 'days');
                    if(!isLicenseUploaded) differenceInDays='N/A';
                    else if(differenceInDays<=0) differenceInDays='Expired';
                    else if(differenceInDays==1) differenceInDays=differenceInDays+' day';
                    else if(differenceInDays>1) differenceInDays=differenceInDays+' days';
                    const LinkCom=()=>{
                      return(<Link
                        to={{
                          pathname: `/team-compliance/${ReportTypes.singleUserSingleState}`,
                          state: { data: isReportAvailable, licenseStatus:differenceInDays=='N/A'?'Not uploaded':differenceInDays  }
                        }}
                        style={{ color: '#000', fontWeight:'600', fontSize:'16px'  }}
                      >
                        View
                      </Link>)
                    }
                    return (
                        <TableRow key={index}>
                          <TableCell sx={{ px: 4 }}>{row.userName}</TableCell>
                          <TableCell  align="left">
                            {row.email}
                          </TableCell>
                          <TableCell align="center" sx={{color:differenceInDays=='Expired'?cme_colors.nonCompliant:''}} >
                            {differenceInDays}
                          </TableCell>
                          <TableCell align="center">
                            
                            {
                              no_requirement ?
                              <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                              <CheckBoxIcon color='success' />
                              <Typography color={'gray'} fontWeight={600}>View</Typography>
                              </Box>
                              :
                              row.compliantStates.states.includes(title) ?
                                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                                  <CheckBoxIcon color='success' />
                                  <LinkCom/>
                                </Box>
                                :
                                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                                  <DisabledByDefaultIcon color='error'/>
                                  <LinkCom/>
                                </Box>
                            }
                          </TableCell>
                        </TableRow>
                      )
                    }
                )}
              </TableBody>
              {
                compliance_Reports.length>1 && 
              <TableFooter>
                <TableRow>
                  <TableCell align="right" colSpan={5} sx={{ py: 1.5, borderBottom: 'none' }}>
                      {
                        no_requirement ?
                          <Typography style={{fontSize: '14px', color: cme_colors.nonCompliant }}>
                            <strong>Note</strong>: The State of <strong> {stateName}</strong>  does not require any amount of CMEs to be completed for renewal of a license.
                          </Typography>
                          :
                          <Link
                            to={{
                              pathname: `/team-compliance/${ReportTypes.multiUserSingleState}`,
                              state: { stats: tableHeadData, data: compliance_Reports }
                            }}
                            style={{
                              textDecoration: 'underline',
                              textDecorationColor: cme_colors.primary,
                              color: cme_colors.primary,
                            }}
                            >
                            <Typography style={{ textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
                              View All Users Reports for {stateName}
                            </Typography>
                          </Link>
                      }
                  </TableCell>
                </TableRow>
              </TableFooter>
              }
            </Table>
          </TableContainer>
        </Collapse>
      </AccordionBox>
      </Box>
    );
 
};

export default StateCollapse;
