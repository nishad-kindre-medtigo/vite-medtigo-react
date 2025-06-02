import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, Collapse, IconButton, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { StatesButton } from '.';
import { AccordionExpandIcon, AccordionBox, AccordionHead, AccordionTable, UserClick } from '../../../../components/CMECompliance';
import useBreakpoints from '../../../../hooks/useBreakpoints';
import { ReportTypes, states } from '../../../../appConstants';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { cme_colors } from '../../../../components/CMECompliance/style_guides';
import { ConfirmationDialog } from '../../../../components/Reports/confirmationDilog';
import MailIconWithDialog from '../../../../components/Reports/IconWithPopup';
import { useOpenSnackbar } from '../../../../hooks/useOpenSnackbar';

const DepartmentCollapse = ({ firstItem, title, tableData, complianceReports, tableHeadData, selectedState, setSelectedState,
  userStates,
  departmentList,
  reportType,
  loadMoreUsers,
  loadMoreStates,
  hasMoreUsers,
  hasMoreStates,
  loading

}) => {
  const { isMobile } = useBreakpoints();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showNotCompliant, setShowNotCompliant] = useState(true); // Toggle state
  const [departmentName, setDepartmentName] = useState(null)
  const [compliance_Reports, setComplianceReports] = useState([])
  const navigate = useNavigate();
  const openSnackbar = useOpenSnackbar();
  // 0 -> non compliant
  // 1 -> compliant
  const [isActive, setIsActive] = useState(false); // Local state to keep accordion highlighted
    const [dialog, setDialog] = useState(false);

  const handleSendEmail = email => {
    openSnackbar(`Sent Mail to ${email}`);
  };

  const handleExpandClick = () => setIsExpanded(prev => !prev);
  const toggleColumn = () => {
    setShowNotCompliant((prev) => !prev);
  };

  useEffect(() => {
    if (complianceReports && title && tableData && departmentList.length > 0) {
      if (title!='-1') {
        const department = departmentList.find(it => it.id === title);
        setDepartmentName(department?.name);
      }
      
      let filteredReports = [];
      filteredReports = complianceReports.filter(item => item.departments.includes(title))
      let sortedReports = filteredReports.sort((a, b) => b.isProviderCompliant - a.isProviderCompliant);
      setComplianceReports(sortedReports)
    }
   
  }, [tableData, title, complianceReports, departmentList])

  React.useEffect(()=>{
    setIsExpanded(!(tableHeadData.users.length==0))
  },[tableHeadData])

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

  React.useEffect(()=>{
  },[userStates, tableData, complianceReports,tableHeadData])

  return (
    <Box id={title}>
      <AccordionBox>
        {/* ACCORDION TITLE */}
        <AccordionHead isExpanded={isExpanded}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'space-between', sm: 'flex-start' },
                gap: 2,
                pl: { xs: 0, sm: 2 },
                pt: { xs: 2, sm: 0 },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              <Typography
                component="span"
                style={{ fontSize: '20px', fontWeight: '500' }}
              >
                {departmentName}
              </Typography>
              {isExpanded ? (
                  <MailIconWithDialog
                    icon_color={'primary'}
                    email={'abd@test.com'}
                    handleSendEmail={handleSendEmail}
                  />
              ) : <></>}
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: { xs: '100%', sm: 'auto' },
                justifyContent: { xs: 'space-between', sm: 'flex-start' }
              }}
            >
              <Typography pr={2} style={{ fontSize: '16px', fontWeight: '700' }}>
                Total Individuals {tableHeadData.users.length}
              </Typography>
              <IconButton onClick={handleExpandClick}>
                <AccordionExpandIcon isExpanded={isExpanded} />
              </IconButton>
            </Box>
          </Box>
        </AccordionHead>

        {/* ACCORDION DETAILS */}
        <Collapse in={isExpanded} classes={{ root: 'customRootStyle' }}>
        {
          tableHeadData.users.length>0?
          <TableContainer>
            <AccordionTable>
              <TableHead>
              <TableRow>
                <TableCell width={500}>Name</TableCell>
                {!reportType && (
                  <>
                    <TableCell width={150}>Not Compliant States</TableCell>
                    <TableCell width={150}>Compliant States</TableCell>
                  </>
                )}
                {reportType == 'not_compliant' && (
                  <TableCell width={150}>Not Compliant States</TableCell>
                )}
                {reportType == 'compliant' && (
                  <TableCell width={150}>Compliant States</TableCell>
                )}
                <TableCell width={100}>Actions</TableCell>
              </TableRow>

              </TableHead>
              <TableBody>
                {tableData.map((row, index) => {
                  let userReports = complianceReports.filter(item => row.user == item.userId)
                  let stats = userStates.find(us => us.user == row.user)
                  let isDepartmentUser = tableHeadData.users.find(item => row.user == item.userId)
                  if (userReports.length == 0 || !isDepartmentUser) return;

                  const nonCompliantReports = [];
                  const compliantReports = [];

                  // Loop through each compliance report
                  userReports.forEach(report => {
                    const stateId = report.state; // Extract the state ID from the report

                    // Check if the state is in nonCompliant_states or compliant_states
                    if (stats.nonCompliantStates.states.includes(stateId)) {
                      nonCompliantReports.push(report);
                    } else if (stats.compliantStates.states.includes(stateId)) {
                      compliantReports.push(report);
                    }
                  });
                  return (
                    <TableRow hover key={index}>
                      <TableCell>
                        <UserClick
                          name={row.userName}
                          onClick={() => {
                            if (userReports.length < 0) {
                              return;
                            }
                            navigate({
                              pathname: `/admin/reports/ce_cme/${ReportTypes.singleUserMultiState}`,
                              state: {
                                data: userReports,
                                stats: stats,
                                departmentName: departmentName,
                              },
                            });
                          }}
                        />
                      </TableCell>
                      {!reportType && (
                        <>
                          <TableCell>
                            <StatesButton variant={'error'} title={`Not compliant states are: ${stats.nonCompliantStates.stateNames}`}>
                              <Typography color={cme_colors.nonCompliant}>
                                States {stats.nonCompliantStates.count}
                              </Typography>
                            </StatesButton>
                          </TableCell>
                          <TableCell>
                            <StatesButton variant={'success'} title={`Compliant states are: ${stats.compliantStates.stateNames}`}>
                              <Typography color={cme_colors.compliant}>
                                States {stats.compliantStates.count}
                              </Typography>
                            </StatesButton>
                          </TableCell>
                        </>
                      )}
                      {reportType === 'not_compliant' && (
                        <TableCell>
                          <StatesButton variant={'error'} title={`Not compliant states are: ${stats.nonCompliantStates.stateNames}`}>
                            <Typography color={cme_colors.nonCompliant}>
                              States {stats.nonCompliantStates.count}
                            </Typography>
                          </StatesButton>
                        </TableCell>
                      )}
                      {reportType === 'compliant' && (
                        <TableCell>
                          <StatesButton variant={'success'} title={`Compliant states are: ${stats.compliantStates.stateNames}`}>
                            <Typography color={cme_colors.compliant}>
                              States {stats.compliantStates.count}
                            </Typography>
                          </StatesButton>
                        </TableCell>
                      )}
                      <TableCell align="center">
                        <MailIconWithDialog
                          email={row.userEmail}
                          handleSendEmail={handleSendEmail}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                </TableBody>
            
            </AccordionTable>
          </TableContainer>
          :
          <Box py={2} sx={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
            <Typography>No Data Available</Typography>
          </Box>
        }
        </Collapse>
      </AccordionBox>
      <ConfirmationDialog
        // ViewAll={() => handleViewReport(licenseReport.map(it=>it.userID))}
        msg={'Send email reminder?'} open={dialog} onCancel={() => setDialog(false)} />
    </Box>
  );

};

export default DepartmentCollapse;
