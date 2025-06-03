import React, { useState, useEffect } from 'react'
import { Box, Collapse, IconButton, Tab, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Tabs, Tooltip, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AccordionBox, AccordionHead, AccordionTabs, AccordionExpandIcon, StatesButton, styles } from '../../AdminView/TeamCompliance/components';
import useBreakpoints from 'src/hooks/useBreakpoints';
import { ReportTypes, states } from 'src/appConstants';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { StateWiseRenew } from '../../StateCompliance';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefaultRounded';
import CheckBoxIcon from '@mui/icons-material/CheckBoxRounded';
import moment from 'moment';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { cme_colors } from '../../../components/CMECompliance/style_guides';

function StatesAccordian({ stateData, complianceReports, tableHeadData }) {
    const { isMobile } = useBreakpoints();
    const [isExpanded, setIsExpanded] = useState(true);
    const handleExpandClick = () => setIsExpanded(prev => !prev);

    if (!tableHeadData) return;
    return (
        <Box mt={2} mb={4}>
            <AccordionBox>
                {/* ACCORDION TITLE */}
                <AccordionHead isExpanded={isExpanded}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography style={{ flexGrow: 1, fontSize: '20px', fontWeight: '500' }}>
                            Compliance Report
                        </Typography>
                        {!isMobile && <UserAccordionTabs tableHeadData={tableHeadData} isExpanded={isExpanded} isMobile={isMobile} />}
                        <IconButton onClick={handleExpandClick}>

                            {
                                isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />
                            }
                        </IconButton>
                    </Box>

                    {isMobile && <UserAccordionTabs tableHeadData={tableHeadData} isExpanded={isExpanded} isMobile={isMobile} />}
                </AccordionHead>

                {/* ACCORDION DETAILS */}
                <Collapse in={isExpanded} classes={{ root: 'customRootStyle' }}>
                    <TableContainer>
                        <Table style={{ minWidth: 650 }} aria-label="collapsible table">
                            <TableHead>
                                <TableRow style={{ background: '#F9F9F9' }}>
                                    <TableCell sx={{ px: 4 }} style={styles.tableCell}>State</TableCell>
                                    <TableCell align="center" width={200} style={styles.tableCell}>
                                        Renewal cycle
                                    </TableCell>
                                    <TableCell align="center" width={200} style={styles.tableCell}>
                                        Expires In
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
                                        if (tableHeadData.user != report.userId) return;
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
                                        let daysGap = differenceInDays;
                                        if (!isLicenseUploaded) differenceInDays = 'N/A';
                                        else if (differenceInDays <= 0) differenceInDays = 'Expired';
                                        if(differenceInDays>180) differenceInDays = '180+ days'
                                        else if(differenceInDays>90) differenceInDays = '90+ days'
                                        else if (differenceInDays > 1) differenceInDays = differenceInDays + ' days';
                                        else if (differenceInDays == 1) differenceInDays = differenceInDays + ' day';
                                        const LinkComp = () => {
                                            return (
                                              <Link
                                                to={{
                                                  pathname: `/monitoring-renewal/ce-cme/report/${ReportTypes.myComplianceSingleReport}`,
                                                  state: {
                                                    data: complianceData || {},
                                                    licenseStatus: differenceInDays === 'N/A' ? 'Not uploaded' : differenceInDays,
                                                  },
                                                }}
                                                style={{
                                                  color: '#000',
                                                  fontSize: '16px',
                                                  textDecoration: 'underline',
                                                  transition: 'color 0.1s',
                                                }}
                                                onMouseEnter={(e) => (e.target.style.color = '#2872C1')}
                                                onMouseLeave={(e) => (e.target.style.color = '#000')}
                                              >
                                                {stateName}
                                              </Link>
                                            );
                                          };
                                          
                                        return (
                                            <TableRow key={report}>
                                                <TableCell sx={{ py: 0.5, px: 4 }}>
                                                <LinkComp />
                                                </TableCell>
                                                <TableCell sx={{ py: 0.5 }} align="center">
                                                    {stateRenwal} {stateRenwal == 1 ? 'Year' : 'Years'}
                                                </TableCell>
                                                <TableCell align="center" sx={{ color: differenceInDays == 'Expired' ? cme_colors.nonCompliant : '' }} >
                                                    {daysGap>180?"180+ days":daysGap>120?"120+ days":daysGap>90?"90+ days":differenceInDays}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {
                                                        report.isProviderCompliant ?
                                                            <Tooltip title={'Compliant'} placement='right' arrow>
                                                                <CheckBoxIcon color='success' />
                                                            </Tooltip>
                                                            :
                                                            <Tooltip title={'Not Compliant'} placement='right' arrow>
                                                                <DisabledByDefaultIcon color='error' />
                                                            </Tooltip>
                                                    }
                                                </TableCell>

                                            </TableRow>
                                        );
                                    })
                                }

                            </TableBody>
                            {
                                complianceReports.length > 1 &&
                                < TableFooter >
                                <TableRow>
                                    <TableCell align="right" colSpan={4} sx={{ py: 1.5, borderBottom: 'none' }}>
                                        <Link
                                            to={{
                                                pathname: `/monitoring-renewal/ce-cme/report/${ReportTypes.myCompliance}`,
                                                state: { stats: tableHeadData, data: complianceReports }
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
        </Box>
    )
}

export default StatesAccordian

// Compliant & Not-Compliant Tabs
const UserAccordionTabs = ({
    tableHeadData,
    isMobile
}) => {
    React.useEffect(() => {

    }, [tableHeadData])
    return (
        <Tabs>
            <Tab
                label={`Not Compliant${isMobile ? ` ${tableHeadData.nonCompliantStates.count}` : ` States ${tableHeadData.nonCompliantStates.count}`}`}
                sx={{
                    ...styles.tab,
                    cursor: 'default',
                    px: 0,
                    mr: 3,
                    color: cme_colors.dark,
                    lineHeight: '28px'
                }}
                disableRipple
            />
            <Tab
                label={`Compliant${isMobile ? ` ${tableHeadData.compliantStates.count}` : ` States ${tableHeadData.compliantStates.count}`}`}
                sx={{
                    ...styles.tab,
                    cursor: 'default',
                    px: 0,
                    mr: 1,
                    color: cme_colors.dark,
                    lineHeight: '28px'
                }}
                disableRipple
            />
        </Tabs>
    );
};