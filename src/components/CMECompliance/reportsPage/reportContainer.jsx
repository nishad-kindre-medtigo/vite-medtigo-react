import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Container, Accordion, AccordionSummary, AccordionDetails, Switch, styled, Typography, useMediaQuery, useTheme, Tooltip, Grid, Collapse, Box, TableFooter } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Divider from '@mui/material/Divider';
import FmdBadIcon from '@mui/icons-material/PriorityHighOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AnnouncementOutlinedIcon from '@mui/icons-material/FmdBad'; 
// import PriorityHighOutlinedIcon from '@mui/icons-material/';
import React from 'react'
import { StyledTableCell } from "../../../views/StateCompliance";
import { grey } from "@mui/material/colors";
import moment from "moment";
import { states } from "../../../appConstants";
import { cme_colors } from "../style_guides";
import { ComplianceTagSmall } from "../index";
import { ClickableTooltip } from "../../../views/StateCompliance/Components";
import { tooltipClasses } from "@mui/material";
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
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        borderBottom:'none'
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
        fontWeight: 600,
        fontSize: '14px',
        textAlign: 'center',
        padding: '6px 16px',
        border: 'none', // Remove borders from
        color:'#7C7C7C'
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
function ReportContainer({ licenseStatus, compliance_report, title, state, isCompliant, expirationDate,showStatus=false }) {
    const theme = useTheme();
    const [expanded, setExpanded] = React.useState(true);
    const [expanded2, setExpanded2] = React.useState(true);
    const [reportReuirements, setReportRequirements] = React.useState([]);
    const [total_credits_required, setCreditsRequired] = React.useState(0)
    const [total_generic_credits, setGenericCredits] = React.useState(0)
    const [require_credits_1, setCreditsType1Required] = React.useState(0)
    const [require_credits_2, setCreditsType2Required] = React.useState(0)
    const [gained_credits_1, setCreditsType1Gained] = React.useState(0)
    const [gained_credits_2, setCreditsType2Gained] = React.useState(0)
    const [total_require_credits, setRequiredCredits] = React.useState(0)
    const [showRule, setShowRule] = React.useState(false);
    const [totalCreditRuleNote, setTotalCreditRuleNote] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [generic_certificates, setGenericCertificates] = React.useState([])
    const [open2, setOpen2] = React.useState(false);


    const handleChange =
        (panel) => (event, isExpanded) => {
            if (panel == 'panel1') {
                setExpanded(!expanded);
            } else {
                setExpanded2(!expanded2);
            }
        };

    React.useEffect(() => {

        if (compliance_report) {
            InitiateCMEReport();
        }
    }, [compliance_report])


    const InitiateCMEReport = async () => {
        try {
            setLoading(true)
            // NEED TO GET CERTIFICATE ID OF SELECTED PROFESSION
            const res = compliance_report;
            // setLicenseExpirationDate(res.end_date);

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
            setLoading(false)
            setExpanded(true)
            setExpanded2(true)
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    const handleClose = () => {
        setOpen2(false);
    };
    const handleToggle = () => {
        if (isMobile) {
            setOpen2((prev) => !prev);
        }
    };

    if (!compliance_report) {
        return <ReportLoader />
    }
    if (compliance_report.total_credits_required == -1) {
        return (<>
            {title && <Box display={'flex'} flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{sm:'end',xs:'start'}} justifyContent={'space-between'}>
                <Box display={'flex'} flexDirection={'row'} alignItems={'baseline'} paddingBottom={'5px'}>
                    <Typography style={{ fontWeight: '500', fontSize: '24px', color: cme_colors.dark }}> {title}</Typography>

                    {showStatus && <Typography style={{ color:isCompliant? cme_colors.compliant:cme_colors.nonCompliant, padding: '0 10px' }}>
                        {isCompliant ? 'Compliant' : 'Not compliant'}
                    </Typography>}
                </Box>
                <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                <p>
                    <strong style={{ fontWeight: '600' }}>State License:  </strong> {(licenseStatus== 'Expired' || licenseStatus == 'Not uploaded')?licenseStatus:expirationDate}
                </p>
                {
                        (licenseStatus == 'Expired' || licenseStatus == 'Not uploaded') &&
                        <ClickableTooltip
                        placement={'bottom-end'}
                        Icon={<InfoOutlinedIcon color="error"/>}
                        customIcon={true}
                        title={licenseStatus == 'Expired' ? "Your state physician license is expired and this report is generated considering today's date." : licenseStatus == 'Not uploaded' ? "Your state physician license is not uploaded and this report is generated considering today's date." : null}>
                        </ClickableTooltip>
                    }
                </Box>
            </Box>
            }

            <Box style={{ marginBottom: '10px', background: "#F6F6F6", width: '100%', height: '10vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography>The State of <span style={{ fontWeight: 'bold' }}> {state} </span> does not require any amount of CMEs to be completed for renewal of a license.</Typography>
            </Box>
        </>
        )
    }
    return (
        <>
            {title && <Box display={'flex'} flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{sm:'end',xs:'start'}} justifyContent={'space-between'}>
                <Box 
                display={'flex'} 
                flexDirection={{ xs: 'column', sm: 'row' }}
                alignItems={'baseline'}>
                    <Typography style={{ fontWeight: '500', fontSize: '24px', color: cme_colors.dark }}> {title}</Typography>
                    {showStatus && <Typography style={{  color:isCompliant? cme_colors.compliant:cme_colors.nonCompliant, padding: '0 10px' }}>
                        {isCompliant ? 'Compliant' : 'Not compliant'}
                    </Typography>}
                </Box>
                <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                <p>
                <strong style={{ fontWeight: '600' }}>State License:  </strong> {(licenseStatus == 'Not uploaded')?licenseStatus:expirationDate}
                </p>
                    {
                        (licenseStatus == 'Expired' || licenseStatus == 'Not uploaded') &&
                        <ClickableTooltip
                            placement={'bottom-end'}
                            Icon={<InfoOutlinedIcon color={licenseStatus == 'Not uploaded'?"disabled":"error"} />}
                            customIcon={true}
                            title={licenseStatus == 'Expired' ? "Your state physician license is expired and this report is generated considering today's date." : licenseStatus == 'Not uploaded' ? "Your state physician license is not uploaded and this report is generated considering today's date as expiration of state license." : null}>
                        </ClickableTooltip>
                    }
                </Box>
            </Box>
        }

            <Accordion
                elevation={0}
                style={{ width: '100%', marginTop: '10px', background: '#FAFAFA', padding: '0', border: '1px solid #DFDFDF', borderTop: 'none' }}
                expanded={expanded} onChange={handleChange('panel1')}>
                <AccordionSummary
                    style={{ background: '#F3F3F3', border: '1px solid #DFDFDF', height: '10px' }}
                    expandIcon={<ExpandMoreIcon color="action" sx={{ fontSize: '38px' }} />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h2 className='' style={{ color: '#000', fontWeight: '500', fontSize: '20px' }}>Required Credits</h2>
                    </div>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0}}>
                    <TableContainer
                        style={{ padding: '0px', width: '100%' }}
                    >
                        <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
                            <TableHead>
                                <TableRow style={{ borderBottom: '2px solid #DFDFDF', borderCollapse: 'initial' }}>
                                    <TableCell style={{ color: '#000', fontWeight: '600' }}>Credit Type  </TableCell>
                                    <TableCell width={140} style={{ color: '#000', textAlign: 'center', fontWeight: '600' }}> Required </TableCell>
                                    <TableCell width={140} style={{ color: '#000', textAlign: 'center', fontWeight: '600' }} align="center">Completed </TableCell>
                                    <TableCell width={140} style={{ color: '#000', textAlign: 'center', fontWeight: '600' }} align="center">Result</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow style={{ borderBottom: '2px solid #DFDFDF', height: '20px' }}>
                                    <TableCell style={{ color: '#000' }}> AMA PRA Category 1</TableCell>
                                    <TableCell style={{ color: '#000', textAlign: 'center' }}> {require_credits_1 || 0}</TableCell>
                                    <TableCell style={{ color: '#000', textAlign: 'center' }}> {gained_credits_1 || 0} </TableCell>
                                    <TableCell style={{ color: '#000', textAlign: 'center' }}>
                                        {
                                            require_credits_1 == 0 & gained_credits_1 == 0 ?
                                                <IndeterminateCheckBoxRoundedIcon color="disabled" />
                                                : require_credits_1 <= gained_credits_1 ?
                                                    <CheckBoxIcon color='success' /> : <DisabledByDefaultRoundedIcon color='error' />
                                        }
                                    </TableCell>

                                </TableRow>

                                <TableRow style={{ height: '30px', borderBottom: '2px solid #DFDFDF', }}>
                                    <TableCell style={{ color: '#000' }}> AMA PRA Category 2</TableCell>
                                    <TableCell style={{ color: '#000', textAlign: 'center' }}> {require_credits_2 || 0}</TableCell>
                                    <TableCell style={{ color: '#000', textAlign: 'center' }} align="center"> {gained_credits_2 || 0} </TableCell>
                                    <TableCell style={{ color: '#000', textAlign: 'center' }} align="center">

                                        {
                                            require_credits_2 == 0 & gained_credits_2 == 0 ?
                                                <IndeterminateCheckBoxRoundedIcon color="disabled" /> : require_credits_2 <= gained_credits_2 ?
                                                    <CheckBoxIcon color='success' /> : <DisabledByDefaultRoundedIcon color='error' />
                                        }
                                    </TableCell>
                                </TableRow>

                                <TableRow style={{ height: '30px', borderBottom: '2px solid #DFDFDF' }}>
                                    <TableCell style={{ color: '#000' }}> Total Credit
                                        {
                                            totalCreditRuleNote &&
                                            <ClickableTooltip placement={'bottom-start'} title={totalCreditRuleNote} Icon={<AnnouncementOutlinedIcon color="primary" />} customIcon={true}>
                                            </ClickableTooltip >
                                        }
                                    </TableCell>
                                    <TableCell style={{ color: '#000', textAlign: 'center' }}> {total_credits_required || 0}</TableCell>
                                    <TableCell style={{ color: '#000', textAlign: 'center' }} align="center"> {(total_require_credits + +total_generic_credits) || 0} </TableCell>
                                    <TableCell style={{ color: '#000' }} align="center">
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
                    </TableContainer >
                </AccordionDetails>
            </Accordion>

            <Accordion
                elevation={0}
                style={{ width: '100%', marginTop: '30px', background: '#F3F3F3', border: '1px solid #DFDFDF', borderTop: 'none', marginBottom: '15px' }}
                expanded={expanded2} onChange={handleChange('panel2')}>
                <AccordionSummary
                    style={{ background: '#F3F3F3', border: '1px solid #DFDFDF', height: '10px' }}
                    expandIcon={<ExpandMoreIcon color="action" sx={{ fontSize: '38px' }} />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h2 className='' style={{ color: '#000', fontWeight: '500', fontSize: '20px' }}>Required Certificates</h2>
                    </div>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0}}>
                    <Grid style={{ overflow: 'hidden', width: '100%', background: '#FAFAFA', borderRadius: '5px' }} >
                        <TableContainer >
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow style={{ fontSize: '14px' }}>
                                        <TableCell style={{ color: '#000', fontWeight: '600' }}>Certificate Category</TableCell>
                                        <TableCell width={130} style={{ width: '130px', color: '#000', fontWeight: '600' }} align="center">Required  </TableCell>
                                        <TableCell width={130} style={{ width: '130px', color: '#000', fontWeight: '600' }} align="center">Completed </TableCell>
                                        <TableCell width={130} style={{ width: '130px', color: '#000', fontWeight: '600' }} align="center">Result</TableCell>
                                    </TableRow>
                                </TableHead>
                                {
                                    reportReuirements.length > 0 &&
                                    reportReuirements.map((it, index) => {
                                        return <Row key={index} row={it} />
                                    })
                                }
                            </Table>
                        </TableContainer>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </>
    )
}

function Row({ row }) {
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const handleClose = () => {
        setOpen2(false);
    };
    const handleToggle = () => {
        if (isMobile) {
            setOpen2((prev) => !prev);
        }
    };
    React.useEffect(() => { }, [row])
    const LightTooltip = styled(({ className, ...props }) => (
        <Tooltip
            open={open2}
            onClose={handleClose}
            onOpen={() => !isMobile && setOpen2(true)}
            {...props} placement={isMobile ? "bottom" : "right"} slotProps={{ popper: { sx: { margin: '0px' } } }} classes={{ popper: className }} />
    ))(({ theme }) => ({

        [`& .${tooltipClasses.tooltip}`]: {
            maxWidth: 500,
            backgroundColor: '#4C4B4B',
            color: 'white',
            boxShadow: theme.shadows[1],
            padding: '12px',
            fontSize: 11,
        },
    }));
    return (
        <React.Fragment>
            <TableRow style={{ borderBottom: row.completed_certificates.length < 1 ? '2px solid #DFDFDF' : '2px solid #FAFAFA' }}>
                <TableCell style={{ color: '#000' }} align="left">
                    
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
                        {row.certificate_category}
                    {
                        row.note &&
                        <ClickableTooltip placement={'bottom-start'} title={row.note} Icon={<AnnouncementOutlinedIcon color="primary"/>} customIcon={true}>
                        </ClickableTooltip >
                    }
                </TableCell>
                <TableCell width={140} style={{ color: '#000' }} align="center">{row.credits}</TableCell>
                <TableCell width={140} style={{ color: '#000' }} align="center">{row.gained_credits}</TableCell>
                <TableCell width={140} style={{ color: '#000' }} align="center">
                {
                    row.credits==0?<IndeterminateCheckBoxRoundedIcon color="disabled" /> :
                    row.completed_by_user ? <CheckBoxIcon color='success' /> : <DisabledByDefaultRoundedIcon color='error' />}</TableCell>
            </TableRow>
                {
                    row.completed_certificates.length > 0 &&
            <TableRow style={{ paddingTop: '20px', borderBottom: '2px solid' }}>
                    <TableCell style={{ padding: 0, borderBottom: '2px solid #DFDFDF' }} colSpan={14}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box>
                                <Table style={{ background: '#F3F3F3', boxShadow:'inset 0 2px 5px rgba(0,0,0,0.2)', }} size="medium" aria-label="simple table">
                                    <TableHead>
                                        <TableRow style={{  borderBottom: '2px solid #DFDFDF' }}>
                                            <TableCell style={{ ...tableStyles.internalTableHeaderCell, ...tableStyles.firstColumn }}>Activity</TableCell>
                                            <TableCell style={{ ...tableStyles.internalTableHeaderCell, ...tableStyles.appliedColumn }}>Applied to Current Cycle</TableCell>
                                            <TableCell style={{ ...tableStyles.internalTableHeaderCell, ...tableStyles.completionDateColumn }}>Completion Date</TableCell>
                                            <TableCell style={{ ...tableStyles.internalTableHeaderCell, ...tableStyles.earnedCreditsColumn }}>Earned Credits</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.completed_certificates.map((item) => (
                                            <TableRow key={Math.random(100) * 100} >
                                                <TableCell
                                                padding="24px"
                                                    component="th" scope="row" align="left">
                                                    <p
                                                        style={{ color: '#000', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                                                    >
                                                        {item.certificate_name}
                                                    </p>
                                                </TableCell>
                                                <TableCell style={{ color: '#000' }} align="center">{item.does_apply ? 'Yes' : 'No'}</TableCell>
                                                <TableCell style={{ color: '#000' }} align="center">{moment(item.issue_date).format('ll')}</TableCell>
                                                <TableCell style={{ color: '#000' }} align="center">{item.gained_credits}</TableCell>

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

const Loader = () => {
    const loaderStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '10vh', // Full viewport height
        backgroundColor: 'transparent', // Light background color
    };

    const spinnerStyle = {
        border: '6px solid #f3f3f3', // Light grey background
        borderTop: '6px solid #3498db', // Blue spinner
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 0.5s linear infinite', // Animation
    };

    return (
        <div style={loaderStyle}>
            <div style={spinnerStyle}></div>
        </div>
    );
};

// Adding keyframes for spinning animation using inline styles
const ReportLoader = () => {
    return (
        <div>
            <Loader />
            <style>
                {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
            </style>
            Generating report...
        </div>
    );
};

export default ReportContainer
