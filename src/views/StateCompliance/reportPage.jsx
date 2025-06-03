import React, { useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Collapse,
    IconButton,
    Box,
    Tooltip,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { cme_colors } from '../../components/CMECompliance/style_guides';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import { ClickableTooltip } from './Components';
import { grey } from '@mui/material/colors';
import moment from 'moment';
import { cme_states } from 'src/appConstants';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const tableStyles = {
    tableHead: {
        // backgroundColor: '#FFF', // No background color for headings
    },
    tableHeaderCell: {
        fontWeight: 'semi-bold',
        textAlign: 'center',
        padding: '10px 16px',
    },
    tableCell: {
        textAlign: 'center',
        padding: '10px 16px',
        height: '50px'
    },
    firstColumn: {
        textAlign: 'left', // Left-align for the first column
        padding: '10px 5px',
        display: 'flex',
        alignItems: 'center',
        marginLeft: '10px',
    },
    sectionHeading: {
        // paddingLeft: '16px',
        marginTop: '0px',  // Remove top margin
        fontWeight: 'semi-bold',
        backgroundColor: '#F3F3F3', // Set background color to #F3F3F3
        padding: '10px', // Add padding for better spacing
        paddingBottom: '10px', // Optional: Add a little bottom margin for spacing
        // borderTop: '1px solid #ccc',
    },
    accordion: {
        // background:'#F3F3F3',
        borderRadius: '0px',
        boxShadow: 'none', // Remove the default box shadow
        // borderLeft: '1px solid #ccc', // Add border to accordion
        // borderRadius: '4px', // Optional: Rounded corners for accordion
    },
    accordionSummary: {
        background: '#F3F3F3',
        border: '1px solid #ccc',
        display: 'flex',               // Align items in a row
        justifyContent: 'space-between', // Ensure space between elements
        alignItems: 'center',          // Vertically center all items
        padding: '0px',
        marginBottom: '10px'
    },

    complianceStatus: {
        marginLeft: 'auto',
        fontWeight: 'semi-bold',
    },
    internalTable: {
        margin: 0,
        padding: 0,
        borderCollapse: 'collapse',
        backgroundColor: '#F3F3F3', // Set background color to #F3F3F3 for the whole internal table
    },
    internalTableHeaderCell: {
        fontWeight: 'normal',
        textAlign: 'center',
        padding: '6px 16px',
        border: 'none', // Remove borders from
    },
    internalTableCell: {
        textAlign: 'center',
        padding: '6px 16px',
        // backgroundColor: '#F3F3F3', // Apply the same background color to internal table cells
        border: 'none', // Remove borders from internal table cells
    },
    internalFirstColumn: {
        textAlign: 'left',
        padding: '6px 16px',
        backgroundColor: '#F3F3F3', // Apply the same background color to the first column of internal table
        border: 'none', // Remove borders from internal first column
    },

    // Column width adjustments for main table
    requiredColumn: {
        width: '15%',
    },
    completedColumn: {
        width: '15%',
    },
    resultColumn: {
        width: '15%',
    },

    // Column width adjustments for internal table
    appliedColumn: {
        width: '20%',
    },
    completionDateColumn: {
        width: '20%',
    },
    earnedCreditsColumn: {
        width: '15%',
    },

    // Fix row height and vertical alignment of icons
    tableRow: {
        height: '50px', // Set a fixed height for rows
    },
    resultIcon: {
        verticalAlign: 'middle', // Align icons in the middle of the cell
    },
};

const CMECompliance = ({ report, expand }) => {
    const [total_credits_required, setCreditsRequired] = useState(0)
    const [total_generic_credits, setGenericCredits] = useState(0)
    const [generic_certificates, setGenericCertificates] = useState([])
    const [require_credits_1, setCreditsType1Required] = useState(0)
    const [require_credits_2, setCreditsType2Required] = useState(0)
    const [gained_credits_1, setCreditsType1Gained] = useState(0)
    const [gained_credits_2, setCreditsType2Gained] = useState(0)
    const [total_require_credits, setRequiredCredits] = useState(0)
    const [totalCreditRuleNote, setTotalCreditRuleNote] = React.useState(null);
    const [reportReuirements, setReportRequirements] = useState([]);
    const [state, setState] = useState(null);
    const [isProviderCompliant, setComplianceStatus] = useState(false);
    const [liceseExpiration, setLiceseExpiration] = useState('N/A');
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLicenseExpired, setIsLicenseExpired] = useState(false);
    const [isLicenseUploaded, setIsLicenseUploaded] = useState(false);
    const handleToggle = (_, expanded) => {
        setIsExpanded(expanded);
    };

    React.useEffect(() => {
        if (report) {
            const LicenseUploaded = report.isLicenseUploaded; // Adjust the format as needed
            const LicenseExpired = moment(report.licenseExpirationDate).isBefore(); // Adjust the format as needed
            setLiceseExpiration(moment(report.licenseExpirationDate).format('MMM D, YYYY'))
            LicenseUploaded && setIsLicenseExpired(LicenseExpired)
            setIsLicenseUploaded(LicenseUploaded)

            const res = report.compliance_report
            setState(cme_states.find(st => st.id == report.state).name || null)
            setComplianceStatus(report.isProviderCompliant)
            setReportRequirements(res.data || []);
            setGenericCertificates(res.genericCertificates)
            setCreditsRequired(res.total_credits_required);

            setCreditsType1Required(res.credit_1_required);
            setCreditsType2Required(res.credit_2_required);
            setCreditsType1Gained(res.credit_1_gained);
            setCreditsType2Gained(res.credit_2_gained);

            setGenericCredits(res.generic_credits_earned)
            setRequiredCredits(res.required_credits_earned)
            setTotalCreditRuleNote(res.note_for_total_credit);

        }
    }, [report])

    React.useEffect(() => {
        if (expand) {
            setIsExpanded(true)
        }
    }, [expand])

    return (
        <div>
            <Accordion onChange={handleToggle} style={{ ...tableStyles.accordion, ...{ margin: isExpanded ? '20px 0' : '0px 0', transition: '0.3s ease' } }}>
                <AccordionSummary
                    style={{ ...tableStyles.accordionSummary }}
                >
                    <Box display={'flex'} flexDirection={'column'} width="100%" px={2}>
                        {/* First Row: State Name and Compliance Status */}
                        <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={'10px'} justifyContent={'space-between'}>
                            <Box display={'flex'} flexDirection={'row'} alignItems={'baseline'} gap={'10px'} justifyContent={'flex-start'}>
                                <Typography variant="h6" style={{ width: 'fitContent' }}>
                                    {state}
                                </Typography>
                                <Typography
                                    style={{
                                        ...tableStyles.complianceStatus,
                                        marginLeft: '0px',
                                        color: isProviderCompliant ? cme_colors.compliant : cme_colors.nonCompliant,
                                    }}
                                >
                                    {isProviderCompliant ? 'Compliant' : 'Not Compliant'}
                                </Typography>
                            </Box>
                            <Box display={'flex'} flexDirection={'row'} alignItems={'inherit'} gap={'10px'} justifyContent={'flex-start'}>
                                {/* Second Row: Expiration */}
                                <p>
                                    <strong style={{ fontWeight: '600' }}>License Expiration :  </strong> {isLicenseUploaded?liceseExpiration:'N/A'}  <br />
                                </p>
                                {
                                    isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />
                                }
                            </Box>
                        </Box>
                        {isExpanded && (
                            <Typography
                                variant="subtitle2"
                                style={{
                                    marginTop: '8px',
                                    color: cme_colors.secondaryText,
                                    fontWeight: 'normal',
                                }}
                            >
                                {total_credits_required === -1 ? (
                                    <>
                                        <strong style={{ fontWeight: '600' }}>Note: </strong>
                                        The State of {state} does not require any amount of CMEs to be completed for renewal of a license.
                                    </>
                                ) : !isLicenseUploaded ? (
                                    <>
                                        <strong style={{ fontWeight: '600' }}>Note: </strong>
                                        {"State Physician license is not uploaded and this report is generated considering today's date."}
                                    </>
                                ) : isLicenseExpired ? (
                                    <>
                                        <strong style={{ fontWeight: '600' }}>Note: </strong>
                                        {"Your state physician license is expired and this report is generated considering today's date."}
                                    </>
                                ) : null}
                            </Typography>
                        )}

                    </Box>
                </AccordionSummary>

                {
                    total_credits_required != -1 &&
                    <AccordionDetails>
                        {/* Required Credits Table */}
                        <Box
                            sx={{
                                border: '1px solid #ccc',
                                // borderLeft: '1px solid #ccc',
                                // borderTop: '1px solid #ccc',
                                // borderRight: '1px solid #ccc',
                            }}
                        >
                            <Typography variant="h6" style={tableStyles.sectionHeading}>
                                Required Credits
                            </Typography>
                            <TableContainer>
                                <Table sx={{ background: '#FAFAFA' }}>
                                    <TableHead style={tableStyles.tableHead}>
                                        <TableRow>
                                            <TableCell style={{ ...tableStyles.tableHeaderCell, ...tableStyles.firstColumn }}>Credit Type</TableCell>
                                            <TableCell style={{ ...tableStyles.tableHeaderCell, ...tableStyles.requiredColumn }}>Required</TableCell>
                                            <TableCell style={{ ...tableStyles.tableHeaderCell, ...tableStyles.completedColumn }}>Completed</TableCell>
                                            <TableCell style={{ ...tableStyles.tableHeaderCell, ...tableStyles.resultColumn }}>Result</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow style={tableStyles.tableRow}>
                                            <TableCell style={{ ...tableStyles.tableCell, ...tableStyles.firstColumn }}>AMA PRA Category 1</TableCell>
                                            <TableCell style={{ ...tableStyles.tableCell, ...tableStyles.requiredColumn }}> {require_credits_1 || 0}</TableCell>
                                            <TableCell style={{ ...tableStyles.tableCell, ...tableStyles.requiredColumn }}> {gained_credits_1 || 0}</TableCell>
                                            <TableCell style={{ ...tableStyles.tableCell, ...tableStyles.completedColumn }}> {
                                                require_credits_1 == 0 & gained_credits_1 == 0 ?
                                                    <IndeterminateCheckBoxRoundedIcon color="warning" />
                                                    : require_credits_1 <= gained_credits_1 ?
                                                        <CheckBoxIcon color='success' /> : <DisabledByDefaultRoundedIcon color='error' />
                                            }</TableCell>
                                        </TableRow>

                                        <TableRow style={tableStyles.tableRow}>
                                            <TableCell style={{ ...tableStyles.tableCell, ...tableStyles.firstColumn }}>AMA PRA Category 2</TableCell>
                                            <TableCell style={{ ...tableStyles.tableCell, ...tableStyles.requiredColumn }}> {require_credits_2 || 0}</TableCell>
                                            <TableCell style={{ ...tableStyles.tableCell, ...tableStyles.requiredColumn }}> {gained_credits_2 || 0}</TableCell>
                                            <TableCell style={{ ...tableStyles.tableCell, ...tableStyles.completedColumn }}> {
                                                require_credits_2 == 0 & gained_credits_2 == 0 ?
                                                    <IndeterminateCheckBoxRoundedIcon color="warning" />
                                                    : require_credits_2 <= gained_credits_2 ?
                                                        <CheckBoxIcon color='success' /> : <DisabledByDefaultRoundedIcon color='error' />
                                            }</TableCell>
                                        </TableRow>

                                        <TableRow style={tableStyles.tableRow}>
                                            <TableCell style={{ ...tableStyles.tableCell, ...tableStyles.firstColumn, ...{ borderBottom: '1px solid none' } }}>Total Credit

                                                {
                                                    totalCreditRuleNote &&
                                                    <ClickableTooltip title={totalCreditRuleNote}></ClickableTooltip>
                                                }
                                            </TableCell>
                                            <TableCell style={{ ...tableStyles.tableCell, ...tableStyles.requiredColumn }}>{total_credits_required || 0}</TableCell>
                                            <TableCell style={{ ...tableStyles.tableCell, ...tableStyles.requiredColumn }}>{(total_require_credits + +total_generic_credits) || 0}</TableCell>
                                            <TableCell style={{ ...tableStyles.tableCell, ...tableStyles.completedColumn }}>
                                                {
                                                    total_credits_required <= (total_require_credits + +total_generic_credits) ?
                                                        <CheckBoxIcon color='success' /> : <DisabledByDefaultRoundedIcon color='error' />
                                                }

                                                <Tooltip>
                                                    <img></img>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                        <Box
                            sx={{
                                marginTop: '10px',
                                marginBottom: '20px',
                                border: '1px solid #ccc',
                                // borderLeft: '1px solid #ccc',
                                // borderTop: '1px solid #ccc',
                                // borderRight: '1px solid #ccc',
                            }}
                        >
                            <Typography variant="h6" style={{ ...tableStyles.sectionHeading, }}>
                                Required Certificates
                            </Typography>
                            <TableContainer>
                                <Table sx={{ background: '#FAFAFA' }}>
                                    <TableHead style={tableStyles.tableHead}>
                                        <TableRow>
                                            <TableCell style={{ ...tableStyles.tableHeaderCell, ...tableStyles.firstColumn }}>Category</TableCell>
                                            <TableCell style={{ ...tableStyles.tableHeaderCell, ...tableStyles.requiredColumn }}>Required</TableCell>
                                            <TableCell style={{ ...tableStyles.tableHeaderCell, ...tableStyles.completedColumn }}>Completed</TableCell>
                                            <TableCell style={{ ...tableStyles.tableHeaderCell, ...tableStyles.resultColumn }}>Result</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            reportReuirements.length > 0 &&
                                            reportReuirements.map((it, index) => {
                                                return <Row key={index} row={it} />
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </AccordionDetails>
                }
            </Accordion>
        </div>
    );
};

export default CMECompliance;


function Row({ row }) {
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => { }, [row])

    return (
        <React.Fragment>
            <TableRow style={{ borderBottom: row.completed_certificates.length < 1 ? '2px solid #DFDFDF' : '2px solid #FAFAFA' }}>
                <TableCell style={{ ...tableStyles.tableCell, ...tableStyles.firstColumn, ...{ borderBottom: 'none' } }}>
                    {row.certificate_category}
                    {
                        <IconButton
                            style={{ background: 'transparent' }}
                            color=""
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon sx={{ color: grey[500] }} /> : <KeyboardArrowDownIcon sx={{ color: grey[500] }} />}
                        </IconButton>}
                    {
                        row.note &&
                        <ClickableTooltip title={row.note} arrow style={{ background: 'transparent' }}>
                        </ClickableTooltip >
                    }
                </TableCell>
                <TableCell style={{ ...tableStyles.tableCell, ...tableStyles.requiredColumn }}>{row.credits}</TableCell>
                <TableCell style={{ ...tableStyles.tableCell, ...tableStyles.requiredColumn }}>{row.gained_credits}</TableCell>
                <TableCell style={{ ...tableStyles.tableCell, ...tableStyles.requiredColumn }}>
                    {row.completed_by_user ? <CheckBoxIcon color='success' /> : <DisabledByDefaultRoundedIcon color='error' />}</TableCell>
            </TableRow>
            {
                row.completed_certificates.length > 0 &&
                <TableRow style={{ border: 'none' }}>
                    <TableCell colSpan={4} sx={{ padding: 0 }}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box>
                                <Table style={{ background: '#F3F3F3', boxShadow:'inset 0 2px 5px rgba(0,0,0,0.2)', }} size="medium" aria-label="simple table">
                                    <TableHead>
                                        <TableRow sx={{ paddingLeft: '16px' }}>
                                            <TableCell style={{ ...tableStyles.internalTableHeaderCell, ...tableStyles.firstColumn }}>Activity</TableCell>
                                            <TableCell style={{ ...tableStyles.internalTableHeaderCell, ...tableStyles.appliedColumn }}>Applied to Current Cycle</TableCell>
                                            <TableCell style={{ ...tableStyles.internalTableHeaderCell, ...tableStyles.completionDateColumn }}>Completion Date</TableCell>
                                            <TableCell style={{ ...tableStyles.internalTableHeaderCell, ...tableStyles.earnedCreditsColumn }}>Earned Credits</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.completed_certificates.map((item) => (
                                            <TableRow key={Math.random(100) * 100} style={{ height: '50px' }}>
                                                <TableCell
                                                    style={{ ...tableStyles.internalTableCell, ...tableStyles.firstColumn }}
                                                    padding='10px'
                                                    component="th" scope="row" align="left">
                                                    <p
                                                        style={{ color: '#000', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                                                    >
                                                        {item.certificate_name}
                                                    </p>
                                                </TableCell>
                                                <TableCell style={{ ...tableStyles.internalTableCell, ...tableStyles.appliedColumn }}>{item.does_apply ? 'Yes' : 'No'}</TableCell>
                                                <TableCell style={{ ...tableStyles.internalTableCell, ...tableStyles.appliedColumn }}>{moment(item.issue_date).format('ll')}</TableCell>
                                                <TableCell style={{ ...tableStyles.internalTableCell, ...tableStyles.appliedColumn }}>{item.gained_credits}</TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            }
        </React.Fragment>
    );
}
