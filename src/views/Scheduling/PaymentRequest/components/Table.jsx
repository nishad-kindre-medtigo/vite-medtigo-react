import React from 'react';
import { Table, TableContainer, Paper, TableBody, TableCell, TableHead, TableFooter, TableRow, TablePagination, Tooltip, IconButton} from '@mui/material';
import InfoIcon from '@mui/icons-material/InfoRounded';
import Label from 'src/components/Label';
import moment from 'moment';

const CustomTable = (props) => {
  const {classes, shiftDetails, calculateHours, 
        roundHours, calculateTotalPayment, totalRegularWorkingHours, 
        totalOvertimeHours, totalShiftRate, count, limit, page, setPage, handleLimitChange} = props;

  return (
    <TableContainer
    component={Paper}
    elevation={0}
    className={classes.scrollbar}
    style={{
      overflowX: 'auto',
      backgroundColor: 'transparent',
      border: shiftDetails && '1px solid #DFDFDF',
      borderRadius: '4px',
      marginTop: '6px'
    }}
  >
    <Table className={classes.table}>
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
        {shiftDetails?.map((row, index) => (
          <TableRow key={row.id}>
            <TableCell>{row.id}</TableCell>
            <TableCell>
              <Tooltip arrow title={row.shiftData.shiftName.schedule.name}>
                {row.shiftData.shiftName.schedule.name.length > 21
                  ? `${row.shiftData.shiftName.schedule.name.slice(0, 21)}...`
                  : row.shiftData.shiftName.schedule.name}
              </Tooltip>
            </TableCell>
            <TableCell>
              <Tooltip arrow title={row.shiftData.shiftName.shiftName}>
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
              {calculateHours(row.shiftData.start_time, row.shiftData.end_time) + ' hr'}
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
              <Tooltip arrow title={row.shiftData.shiftName.schedule.departments.hospitals.name}>
                {row.shiftData.shiftName.schedule.departments.hospitals.name.length > 18
                  ? `${row.shiftData.shiftName.schedule.departments.hospitals.name.slice(0, 18)}...`
                  : row.shiftData.shiftName.schedule.departments.hospitals.name}
              </Tooltip>
            </TableCell>
            <TableCell>
              <Tooltip arrow title={row.shiftData.shiftName.schedule.departments.name}>
                {row.shiftData.shiftName.schedule.departments.name.length > 18
                  ? `${row.shiftData.shiftName.schedule.departments.name.slice(0, 18)}...`
                  : row.shiftData.shiftName.schedule.departments.name}
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
        <TableRow className={classes.tableFooter}>
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
            className={classes.pagination}
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
  )
}

export default CustomTable