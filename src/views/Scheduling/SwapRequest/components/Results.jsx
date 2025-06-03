import React, { useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { TableContainer, Paper, Table, TableBody, TableFooter, TableCell, TableHead, TableRow, Box, TablePagination } from '@mui/material';
import schedullingServices from 'src/services/schedullingServices';
import { useSelector } from 'react-redux';
import { tableStyles } from '../../PaymentRequest/pages/RequestPayment/ShiftsTable';
import { Placeholder, CancelButton, AcceptButton, RejectButton } from './StyledComponents';

const timeFormat = (input) => moment(input, 'h:mm A').format('HH:mm');
const dateFormat = (input) => moment(input).format('MMM DD, YYYY');

const Results = React.memo((props) => {
  const classes = tableStyles;
  const { data, tab, acceptRequest, rejectRequest, setData, openSnackbar } = props;
  const { user } = useSelector((state) => state.account);
  const text = tab === 'Sent' ? 'Receiver' : "Sender's";

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleDeleteSwapRequest = async (id) => {
    try {
      await schedullingServices.deleteSwapRequest(id);

      const fetchRequests = tab === 'Received'
        ? schedullingServices.getSwapRequest
        : schedullingServices.getSentRequest;

      const updatedData = await fetchRequests(user.id);
      setData(updatedData);
      openSnackbar('Deleted Swap Request Successfully!', 'info');
    } catch (error) {
      openSnackbar('Error Deleting Swap Request!', 'error');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={classes.scrollbar}>
      {data.length > 0 ? (
        <>
          <Table sx={{ ...classes.table, fontSize: '16px', '& .MuiTableCell-root:not(:last-child)': { borderRight: 'none' } }}>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: 'left', paddingLeft: '24px' }}>Department</TableCell>
                <TableCell>Requested Date</TableCell>
                <TableCell>Your Shift</TableCell>
                <TableCell>{text} Shift</TableCell>
                <TableCell>{text} Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => {
                  const senderShiftTimeDetails = `${timeFormat(item.senderShiftsStartTime)} to ${timeFormat(item.senderShiftsEndTime)} ${dateFormat(item.senderStartDate)}`;
                  const receiverShiftTimeDetails = `${timeFormat(item.receiverShiftsStartTime)} to ${timeFormat(item.receiverShiftsEndTime)} ${dateFormat(item.receiverStartDate)}`;

                  return (
                    <TableRow hover sx={{'&:hover': {background: '#F9F9F9'}}} key={item.id} data-rowid={item.id}>
                      <TableCell style={{ textAlign: 'left', paddingLeft: '24px' }}>{item.departmentName}</TableCell>
                      <TableCell>{dateFormat(item.createdAt)}</TableCell>
                      <TableCell>
                        {tab === 'Sent' ? senderShiftTimeDetails : receiverShiftTimeDetails}
                      </TableCell>
                      <TableCell>
                        {tab === 'Sent' ? receiverShiftTimeDetails : senderShiftTimeDetails}
                      </TableCell>
                      <TableCell>
                        {tab === 'Sent' ? item.receiverName : item.senderName}
                      </TableCell>
                      <TableCell
                        style={{
                          color:
                            item.status === 'requested' ? 'orange' :
                            item.status === 'accepted' ? '#4CAF50' :
                            item.status === 'providerAccepted' ? '#2196F3' :
                            item.status === 'rejected' ? '#F44336' :
                            '#000',
                          fontWeight: 400,
                        }}
                      >
                        {{
                          requested: 'Requested',
                          accepted: 'Accepted',
                          providerAccepted: 'Initiated',
                          rejected: 'Rejected'
                        }[item.status] || ''}
                      </TableCell>
                      <TableCell>
                        {tab === 'Sent' ? (
                          <CancelButton value={item.id} onClick={() => handleDeleteSwapRequest(item.id)}>
                            Cancel
                          </CancelButton>
                        ) : (
                          <Box display='flex' justifyContent='center' gap={1}>
                            <AcceptButton value={item.id} disabledStatus={item.status === 'providerAccepted'} onClick={() => acceptRequest(item.id)}>
                              {['rejected', 'requested'].includes(item.status) ? 'Accept' : 'Accept'}
                            </AcceptButton>
                            <RejectButton value={item.id} disabledStatus={item.status === 'rejected'} onClick={() => rejectRequest(item.id)}>
                              Reject
                            </RejectButton>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  sx={classes.pagination}
                  rowsPerPageOptions={[5, 10, 25]}
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </>
      ) : (
        <Placeholder>
          {tab === 'Sent' ? 'No Sent Requests Available' : 'No Received Requests Available'}
        </Placeholder>
      )}
    </TableContainer>
  );
});

Results.propTypes = {
  data: PropTypes.array,
  tab: PropTypes.string.isRequired,
  acceptRequest: PropTypes.func.isRequired,
  rejectRequest: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  openSnackbar: PropTypes.func.isRequired,
};

Results.defaultProps = {
  data: [],
};

export default Results;
