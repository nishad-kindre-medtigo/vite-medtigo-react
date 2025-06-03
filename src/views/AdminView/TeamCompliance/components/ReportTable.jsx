import { UserClick, StatesButton } from '../../../../components/CMECompliance';
import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Collapse,
    TablePagination,
    Box,
    Drawer, 
    Slide,
    Skeleton,
    CircularProgress
} from "@mui/material";
import MailIconWithDialog from '../../../../components/Reports/IconWithPopup';
import { ReportTypes } from 'src/appConstants';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import { cme_colors } from '../../../../components/CMECompliance/style_guides';
import CloseIcon from "@mui/icons-material/Close";
import SingleUserSingleStateDrawer from '../../../../components/CMECompliance/reportsPage/singleUserSingleStateDrawer';
import { tr } from 'date-fns/locale';
import StateSpecificCMECervices from 'src/services/stateSpecificCMEService';
const ReportTable = (
    {
        title,
        userData,
        complianceReports,
        departmentList,
        loadMoreUsers,
        count,
        showGroupColumn,
        loading
    }
) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [preparingData, setPreparingData] = React.useState(false);
    const [visited, setVisited] = React.useState([0]);
    const [disabledUsers, setDisabledUsers] = useState({});

    // State for the drawer
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedUserData, setSelectedUserData] = useState(null);

    const openSnackbar = useOpenSnackbar();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        if (!visited.includes(newPage)) {
            setVisited([...visited, newPage]);
            loadMoreUsers();
        }
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Open Drawer Function
    const handleUserClick = (row) => {
        setPreparingData(true);
        setDrawerOpen(true);
        const userReports = complianceReports.filter((item) => row.user === item.userId);
        const stats = userData.find((us) => us.user === row.user);
        const deptNames = row.detps
            .map((it) => departmentList.find((dept) => dept.id === it))
            .filter((dept) => dept !== undefined)
            .map((dept) => dept.name)
            .join(", ");

        setSelectedUserData({ userReports, stats, departmentName: deptNames });
        setPreparingData(false);
    };

    React.useEffect(() => {
    }, [userData, title, complianceReports, departmentList, disabledUsers])

    const handleSendEmail = async (payload) => {
        
        const res = await StateSpecificCMECervices.SendCMEReportToProvider(payload);

        if(res){
        openSnackbar(`Sent Mail to ${payload.email}`);
        setDisabledUsers(prev => ({
            ...prev,
            [payload.email]: true
        }));

        }
    };

    return (
        <Box
            sx={{
                mb: 2,
                width: '100%',
                background: '#FAFAFA',
                border: '1px solid #DFDFDF',
                boxShadow: 'none',
                borderRadius: '4px',
                overflow: 'hidden',
            }}
        >
            <Collapse in={true}>
                <TableContainer>
                    {/* <AccordionTable> */}
                    <Table>
                        <TableHead sx={{ fontWeight: 600 }}>
                            <TableRow sx={{ fontWeight: 600 }}>
                                <TableCell sx={{ fontWeight: 600 }} width={300}>Name</TableCell>
                                {
                                    showGroupColumn && <TableCell sx={{ fontWeight: 600 }} width={300}>Group</TableCell>
                                }
                                <TableCell align='center' sx={{ fontWeight: 600 }} width={150}>Not Compliant States</TableCell>
                                <TableCell align='center' sx={{ fontWeight: 600 }} width={150}>Compliant States</TableCell>
                                <TableCell align='center' sx={{ fontWeight: 600 }} width={100}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userData.length > 0 && userData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                let userReports = complianceReports.filter(item => row.user == item.userId)
                                let stats = userData.find(us => us.user == row.user)
                                let deptNames = row.detps
                                    .map(it => departmentList.find(dept => dept.id == it))
                                    .filter(dept => dept !== undefined) // Remove undefined values
                                    .map(dept => dept.name);

                                return (
                                    <TableRow hover key={index} sx={{ padding: '0px' }}>
                                        <TableCell width={300}>
                                            <UserClick
                                                name={row.userName}
                                                onClick={() => {
                                                    setSelectedUserData({ userReports, stats, departmentName: deptNames });
                                                    
                                                    setDrawerOpen(true);}}
                                            // onClick={() => {
                                            //     if (userReports.length < 0) {
                                            //         return;
                                            //     }
                                            //     history.push({
                                            //         pathname: `/admin/reports/ce_cme/${ReportTypes.singleUserMultiState}`,
                                            //         state: {
                                            //             data: userReports,
                                            //             stats: stats,
                                            //             departmentName: deptNames.join(", "),
                                            //         },
                                            //     });
                                            // }}
                                            />
                                            {/* {<CircularProgress size={20} color="primary" />} */}

                                            {/* <Typography 
                                            sx={{
                                                color: cme_colors.primary,
                                                textDecoration: "underline" // Removes underline
                                            }}
                                        onClick={() => {
                                                    setSelectedUserData({ userReports, stats, departmentName: deptNames });
                                                    
                                                    setDrawerOpen(true);}}>
                                            {row.userName}
                                        </Typography> */}

                                        </TableCell>
                                        {
                                            showGroupColumn &&
                                            <TableCell width={300}>
                                                <Typography
                                                    sx={{
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        maxWidth: "200px", // Adjust as needed
                                                        display: "inline-block",
                                                        textDecoration: "none" // Removes underline
                                                    }}
                                                    title={deptNames.join(", ")}
                                                >
                                                    {deptNames.join(", ")}
                                                </Typography>
                                            </TableCell>
                                        }

                                        <TableCell align='center' width={150}>
                                            <StatesButton variant={'error'} title={stats.nonCompliantStates.count == 0 ? 'No not compliant states' : `Not compliant states are: ${stats.nonCompliantStates.stateNames}`}>
                                                <Typography color={cme_colors.nonCompliant}>
                                                    States {stats.nonCompliantStates.count}
                                                </Typography>
                                            </StatesButton>

                                        </TableCell>
                                        <TableCell align='center' width={150}>
                                            <StatesButton variant={'success'} title={stats.compliantStates.count == 0 ? 'No compliant states' : `Compliant states are: ${stats.compliantStates.stateNames}`}>
                                                <Typography color={cme_colors.compliant}>
                                                    States {stats.compliantStates.count}
                                                </Typography>
                                            </StatesButton>
                                        </TableCell>
                                        <TableCell align='center' width={100}>
                                            <MailIconWithDialog
                                                email={row.email}
                                                disabled={disabledUsers[row.email]}
                                                payload={{
                                                    "email": row.email,
                                                    "stateId": "all",
                                                    "compliantStates": stats.compliantStates.count,
                                                    "notCompliantStates": stats.nonCompliantStates.count,
                                                    "user": row.user,
                                                    "name": row.userName
                                                }}
                                                handleSendEmail={handleSendEmail}
                                                title={disabledUsers[row.email] ? "Mail Sent" : 'Send report email'}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                            )}
                        </TableBody>
                    </Table>
                    {/* </AccordionTable> */}
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10]}
                    component="div"
                    count={count.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    // disabled={loading}
                />
            </Collapse>
            {selectedUserData &&
                <UserReportDrawer
                    loading={preparingData}
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    userReports={selectedUserData.userReports}
                    stats={selectedUserData.stats}
                    departmentName={selectedUserData.departmentName}
                />
            }
        </Box>
    );
};


export const SkeletonCMEReport = ({ showGroupColumn, rows, count }) => {
    React.useEffect(() => {
        console.log(rows, 'rows');

    }, [showGroupColumn, rows]);
    return (
        <Box
            sx={{
                mb: 2,
                width: '100%',
                background: '#FAFAFA',
                border: '1px solid #DFDFDF',
                boxShadow: 'none',
                borderRadius: '4px',
                overflow: 'hidden',
            }}
        >
            <Collapse in={true}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }} width={300}>Name</TableCell>
                                {showGroupColumn && <TableCell sx={{ fontWeight: 600 }} width={400}>Group</TableCell>}
                                <TableCell sx={{ fontWeight: 600 }} width={150}>Not Compliant States</TableCell>
                                <TableCell sx={{ fontWeight: 600 }} width={150}>Compliant States</TableCell>
                                <TableCell sx={{ fontWeight: 600 }} width={100}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[...Array(rows)].map((_, index) => (
                                <TableRow hover key={index} sx={{ height: '10px' }}>
                                    <TableCell width={300} align="center">
                                        <Skeleton variant="text" animation="wave" width={300} />
                                    </TableCell>
                                    {showGroupColumn && (
                                        <TableCell width={400} align="center">
                                            <Skeleton variant="text" animation="wave" width={200} />
                                        </TableCell>
                                    )}
                                    <TableCell width={150} align="center">
                                        <Skeleton variant="rectangular" animation="wave" width={150} height={20} />
                                    </TableCell>
                                    <TableCell width={150} align="center">
                                        <Skeleton variant="rectangular" animation="wave" width={150} height={20} />
                                    </TableCell>
                                    <TableCell width={100} align="center">
                                        <Skeleton variant="circular" animation="wave" width={40} height={40} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>
                <TablePagination rowsPerPageOptions={[5, 10]} component="div" disabled count={count} rowsPerPage={rows} page={0} />
            </Collapse>
        </Box>
    );
};

const UserReportDrawer = ({ loading, open, onClose, userReports, stats, departmentName }) => {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            TransitionComponent={Slide} // ✅ This makes the drawer itself slide in/out
            transitionDuration={400} // ✅ Smooth transition speed
            TransitionProps={{ direction: "left" }} // ✅ Ensures it slides from right to left
            sx={{
                "& .MuiDrawer-paper": {
                    width: "60vw", // Adjust width as needed
                    borderTopLeftRadius: "5px",
                    borderTopRightRadius: "5px",
                    padding: "40px",
                },
            }}
        >
            {loading ? (
                <Typography variant="h6">Loading...</Typography>
            ) : (
                <SingleUserSingleStateDrawer
                    data={userReports}
                    stats={stats}
                    departmentName={departmentName}
                    close={onClose}
                />
            )}
        </Drawer>
    );
};


export default ReportTable;
