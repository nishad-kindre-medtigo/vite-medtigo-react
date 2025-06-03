import React, { useCallback, useEffect, useState } from 'react';
import { Box, Table, Tooltip, TableContainer, Paper, TableBody, TableCell, TableHead, TableFooter, TableRow, TablePagination, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/InfoRounded';
import Label from '../../../../../components/Label';
import moment from 'moment';
import axios from '../../../../../utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Header from './Header';
import TableSkeleton from '../../components/TableSkeleton';
import { calculateHours, calculateTotalPayment, roundHours } from '../../utils';
import { mainStyles } from '../RequestPayment';
import { tableStyles } from '../RequestPayment/ShiftsTable';

const RequestDurationTable = () => {
  const classes = tableStyles;
  const mainClasses = mainStyles;
  const { id: userID } = useSelector(state => state.account.user);
  const { requestId } = useParams();

  const isMountedRef = useIsMountedRef();
  const [isLoading, setLoading] = useState(false);
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [shiftsData, setShiftsData] = useState([]);
  const [userRequest, setUserRequest] = useState({});

  const totalRegularWorkingHours = shiftsData.totalRegularWorkingHours || null;
  const totalOvertimeHours = shiftsData.totalOverTimeHours || null;
  const totalShiftRate = shiftsData.totalShiftRate || null;
  const shiftDetails = shiftsData.paymentObjectDetails;

  useEffect(() => {
    getUserRequestData(userID);
  }, [userID]);

  useEffect(() => {
    if (userRequest.paymentStartDate && userRequest.paymentEndDate) {
      getShiftsData(page, limit, userRequest.paymentStartDate, userRequest.paymentEndDate);
    }
  }, [page, limit, userRequest]);

  // Get current payment request data with status, requested amount, approved amount
  const getUserRequestData = useCallback(
    (userID) => {
      setLoading(true);
      axios
        .post('/schedule/allRequestPayments', {
          userID,
        })
        .then(response => {
          if (isMountedRef.current) {
            const { data, status } = response.data;
            const newData = data.find(item => item.id === parseInt(requestId));
            setUserRequest(status ? newData : {});
            setLoading(false);
          }
        })
        .catch(error => {
          console.error('Error fetching shifts data:', error);
          if (isMountedRef.current) {
            setUserRequest({});
            setLoading(false);
          }
        });
    },
    [isMountedRef, requestId]
  );

  // Get all shifts data in current payment request
  const getShiftsData = useCallback(
    (page, limit, startDate, endDate) => {
      setLoading(true);
      const offset = page + 1;
      const url = `/schedule/requestPayment?page=${offset}&limit=${limit}`;

      axios
        .post(url, { startDate, endDate, userID, alreadyRequestMade: true })
        .then(response => {
          if (isMountedRef.current) {
            const { data, status } = response.data;
            setShiftsData(status ? data : []);
            setCount(status ? data.totalCount : 0);
            setLoading(false);
          }
        })
        .catch(error => {
          console.error('Error fetching shifts data:', error);
          if (isMountedRef.current) {
            setShiftsData([]);
            setCount(0);
            setLoading(false);
          }
        });
    },
    [isMountedRef, userID]
  );

  const handleLimitChange = event => {
    setLimit(parseInt(event.target.value));
    setPage(0);
  };

  return (
    <Box sx={mainClasses.root}>
      <Header id={parseInt(requestId)} status={userRequest.status} userRequest={userRequest} startDate={userRequest.paymentStartDate} endDate={userRequest.paymentEndDate}/>
      {isLoading ? (
        <TableSkeleton columns={10}/>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={classes.scrollbar}
          style={{
            overflowX: 'auto',
            backgroundColor: 'transparent',
            border: shiftDetails && '2px solid #DFDFDF',
            borderRadius: '4px',
            marginTop: '6px'
          }}
        >
          {shiftDetails && (
            <Table sx={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Schedule</TableCell>
                  <TableCell>Shift</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Hours</TableCell>
                  <TableCell>Overtime</TableCell>
                  <TableCell>
                    Amount
                    <Tooltip arrow title="Amount = (Regular Working Hours &#215; Shift Rate) + (Overtime Hours &#215; Overtime Rate)">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" style={{ color: 'darkgrey' }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>Hospital</TableCell>
                  <TableCell>Department</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shiftDetails?.map((row) => (
                  <TableRow hover sx={{'&:hover': {background: '#F9F9F9'}}} key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>
                      <Tooltip arrow title={`${row.shiftData.shiftName.schedule.name}`}>
                          {row.shiftData.shiftName.schedule.name.length > 21
                            ? `${row.shiftData.shiftName.schedule.name.slice(0, 21)}...`
                            : row.shiftData.shiftName.schedule.name}
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip arrow title={`${row.shiftData.shiftName.shiftName}`}>
                          {row.shiftData.shiftName.shiftName.length > 21
                            ? `${row.shiftData.shiftName.shiftName.slice(0, 21)}...`
                            : row.shiftData.shiftName.shiftName}
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {row.shiftData.start_time.slice(0, 5) +
                        ' - ' +
                        row.shiftData.end_time.slice(0, 5)}
                    </TableCell>
                    <TableCell>
                      {moment(row.start_date).format('MMM DD, YYYY')}
                    </TableCell>
                    <TableCell>
                      {calculateHours( row.shiftData.start_time, row.shiftData.end_time) + ' hr'}
                    </TableCell>
                    <TableCell>
                      {row.extraTime ? (
                        roundHours(row.extraTime) + ' hr'
                      ) : (
                        <Label color="error">N/A</Label>
                      )}
                    </TableCell>
                    <TableCell>
                      {row.shiftData.price ? (
                        calculateTotalPayment(row)
                      ) : (
                        <Label color="error">N/A</Label>
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip arrow title={`${row.shiftData.shiftName.schedule.departments.hospitals.name}`}>
                          {row.shiftData.shiftName.schedule.departments.hospitals.name.length > 18
                            ? `${row.shiftData.shiftName.schedule.departments.hospitals.name.slice(0, 18)}...`
                            : row.shiftData.shiftName.schedule.departments.hospitals.name}
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip arrow title={`${row.shiftData.shiftName.schedule.departments.name}`}>
                          {row.shiftData.shiftName.schedule.departments.name.length > 18
                            ? `${row.shiftData.shiftName.schedule.departments.name.slice(0, 18)}...`
                            : row.shiftData.shiftName.schedule.departments.name}
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={classes.tableFooter}>
                  <TableCell style={{ textAlign: 'right' }} colSpan={5}>
                    Total
                  </TableCell>
                  <TableCell colSpan={1}>
                    {totalRegularWorkingHours ? (
                      `${totalRegularWorkingHours} hrs`
                    ) : (
                      <Label color="error">N/A</Label>
                    )}
                  </TableCell>
                  <TableCell colSpan={1}>
                    {totalOvertimeHours ? (
                      `${totalOvertimeHours.toFixed(2)} hrs`
                    ) : (
                      <Label color="error">N/A</Label>
                    )}
                  </TableCell>
                  <TableCell colSpan={1}>
                    {totalShiftRate ? (
                      `$${totalShiftRate}`
                    ) : (
                      <Label color="error">N/A</Label>
                    )}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    sx={classes.pagination}
                    count={count}
                    rowsPerPage={limit}
                    page={page}
                    rowsPerPageOptions={[10, 30, 60]}
                    onPageChange={(_, page) => setPage(page)}
                    onRowsPerPageChange={handleLimitChange}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          )}
        </TableContainer>
      )}
    </Box>
  );
};

export default RequestDurationTable;
