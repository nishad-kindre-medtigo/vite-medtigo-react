import React from 'react';
import { Box, Table, TableContainer, Paper, TableBody, TableCell, TableHead, TableFooter, TableRow, TablePagination, Tooltip, IconButton} from '@mui/material';
import InfoIcon from '@mui/icons-material/InfoRounded';
import Label from '../../../../../components/Label';
import moment from 'moment';
import { calculateHours, calculateTotalPayment, roundHours } from '../../utils';

export const tableStyles = {
  table: {
    minWidth: '1260px',
    '& .MuiTableCell-root': {
      color: 'black',
      padding: '12px',
      borderTop: '1px solid #DFDFDF',
      borderBottom: '1px solid #DFDFDF',
      fontSize: '14px',
      textAlign: 'center',
      fontWeight: 400,
    },
    '& .MuiTableCell-root:not(:last-child)': {
      borderRight: '1px solid #DFDFDF',
    },
    '& .MuiTableCell-head': {
      fontSize: '16px',
      borderTop: 'none',
      fontWeight: 600,
    },
    '& .MuiSelect-select': {
      color: 'black',
    },
  },
  scrollbar: {
    scrollbarWidth: 'thin',
    scrollbarColor: 'black',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'black',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f0f0f0',
    },
  },
  tableFooter: {
    '& .MuiTableCell-root': {
      fontSize: '16px',
      fontWeight: 600,
    },
  },
  pagination: {
    '& .MuiTableCell-root': {
      padding: '0px !important',
    },
    '& .MuiTablePagination-root': {
      fontSize: '14px',
    },
    '& .MuiToolbar-root': {
      minHeight: '20px !important',
    },
    '& .MuiTablePagination-toolbar': {
      fontSize: '14px',
    },
    '& .MuiTablePagination-selectLabel': {
      fontSize: '14px',
    },
    '& .MuiTablePagination-displayedRows': {
      fontSize: '14px',
    },
    '& .MuiTablePagination-select': {
      fontSize: '14px',
    },
    '& .MuiTablePagination-actions': {
      fontSize: '14px',
    },
    border: 'none !important',
    backgroundColor: '#F9F9F9',
  },
  placeHolder: {
    fontSize: '16px',
    marginTop: '16px',
    backgroundColor: '#F8F8F8',
    height: '35vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
  },
  // Media queries for responsiveness
  '@media (max-width: 768px)': {
    table: {
      minWidth: '100%',
      '& .MuiTableCell-root': {
        fontSize: '12px',
        padding: '8px',
      },
      '& .MuiTableCell-head': {
        fontSize: '14px',
      },
    },
    pagination: {
      '& .MuiTablePagination-root': {
        fontSize: '12px',
      },
      '& .MuiTablePagination-toolbar': {
        fontSize: '12px',
      },
    },
  },
};

const ShiftsTable = ({ count, page, setPage, limit, setLimit, shiftsData, startDate, endDate }) => {
  const classes = tableStyles;
  const shiftDetails = shiftsData.paymentObjectDetails;
  const totalRegularWorkingHours = shiftsData.totalRegularWorkingHours;
  const totalOvertimeHours = shiftsData.totalOverTimeHours;
  const totalShiftRate = shiftsData.totalShiftRate;

  const handleLimitChange = event => {
    setLimit(parseInt(event.target.value));
    setPage(0);
  };

  return (
    <>
      {shiftDetails ? (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={classes.scrollbar}
          style={{
            overflowX: 'auto',
            backgroundColor: 'transparent',
            border: shiftDetails && '1px solid #DFDFDF',
            borderRadius: '4px',
            marginTop: '6px'
          }}
        >
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
                      <InfoIcon fontSize="small" style={{ color: 'darkgrey' }}/>
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>Hospital</TableCell>
                <TableCell>Department</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shiftDetails?.map((row) => {
                const scheduleName = row.shiftData.shiftName.schedule.name;
                const shiftName = row.shiftData.shiftName.shiftName;
                const startTime = row.shiftData.start_time;
                const endTime = row.shiftData.end_time;
                const hospitalName = row.shiftData.shiftName.schedule.departments.hospitals.name;
                const departmentName = row.shiftData.shiftName.schedule.departments.name;

                return (
                  <TableRow hover sx={{'&:hover': {background: '#F9F9F9'}}} key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>
                      <Tooltip arrow title={`${scheduleName}`}>
                        {scheduleName.length > 21 ? `${scheduleName.slice(0, 21)}...` : scheduleName}
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip arrow title={`${shiftName}`}>
                        {shiftName.length > 21 ? `${shiftName.slice(0, 21)}...` : shiftName}
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {startTime.slice(0, 5) +
                        ' - ' +
                        endTime.slice(0, 5)}
                    </TableCell>
                    <TableCell>
                      {moment(row.start_date).format('MMM DD, YYYY')}
                    </TableCell>
                    <TableCell>
                      {calculateHours(startTime, endTime) + ' hr'}
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
                      <Tooltip arrow title={`${hospitalName}`}>
                        {hospitalName.length > 18 ? `${hospitalName.slice(0, 18)}...` : hospitalName}
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip arrow title={`${departmentName}`}>
                        {departmentName.length > 18 ? `${departmentName.slice(0, 18)}...` : departmentName}
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })}
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
        </TableContainer>
      ) : (
        <Box sx={classes.placeHolder}>
          No Shifts are available to make payment request from {moment(startDate).format('DD MMM yyyy')} to {moment(endDate).format('DD MMM yyyy')}
        </Box>
      )}
    </>
  );
};

export default ShiftsTable;