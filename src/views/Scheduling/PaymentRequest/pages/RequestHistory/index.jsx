import React, { useCallback, useEffect, useState } from 'react';
import { Grid, Card, Box, Table, TableContainer, Paper, TextField, MenuItem, TableBody, TableCell, TableHead, TableRow, Tooltip, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Link } from 'react-router-dom';
import Label from 'src/components/Label';
import moment from 'moment';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useSelector } from 'react-redux';
import TableSkeleton from '../../components/TableSkeleton';
import useBreakpoints from 'src/hooks/useBreakpoints';

const useStyles = {
  root: {
    marginBottom: '20px',
    minHeight: '60vh',
  },
  table: {
    minWidth: '1260px',
    '& .MuiTableCell-root': {
      color: 'black',
      borderTop: '1px solid #DFDFDF',
      borderBottom: '1px solid #DFDFDF',
      padding: '4px !important',
      fontSize: '14px',
      textAlign: 'center',
      fontWeight: 400,
    },
    '& .MuiTableRow-root:last-child .MuiTableCell-root': {
      borderBottom: 'none !important',
    },
    '& .MuiTableCell-root:not(:last-child)': {
      borderRight: '1px solid #DFDFDF',
    },
    '& .MuiTableCell-head': {
      fontSize: '16px',
      border: 'none',
      padding: '12px !important',
      fontWeight: 600,
    },
    '& .MuiSelect-select': {
      color: 'black',
    },
  },
  scrollbar: {
    scrollbarWidth: 'thin',
    scrollbarColor: 'black',
  },
  textField: {
    '& .MuiInputBase-root': {
      height: '50px !important',
      '@media (max-width: 600px)': {
        width: '100%',
      },
    },
    '& .MuiSvgIcon-root': {
      color: '#334D6E',
    },
  },
  placeHolder: {
    fontSize: '16px',
    marginTop: '16px', // theme.spacing(2) converted to 16px
    backgroundColor: '#F8F8F8',
    height: '35vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
  },
  infoCard: {
    backgroundColor: '#F8F8F8',
    color: 'black',
    height: '100%',
    fontSize: '12px',
    padding: '12px',
  },
  textCard: {
    background: 'none',
    color: 'black',
    fontSize: '14px',
    paddingLeft: '4px',
  },
};

const RequestHistoryTable = () => {
  const classes = useStyles;
  const isMountedRef = useIsMountedRef();
  const [isLoading, setLoading] = useState(true);
  
  const { isMobile } = useBreakpoints();
  
  const [shiftsData, setShiftsData] = useState([]);
  const { id: userID } = useSelector(state => state.account.user);
  const [status, setStatus] = useState('All');

  const statusMessages = {
    'All': 'No Payment Requests Created Till Date',
    'Approved With Edit': 'No Payment Requests Created with Status: Paid With Edit',
    'Approved': 'No Payment Requests Created with Status: Paid',
    'Declined': 'No Payment Requests Created with Status: Declined',
    'Initiated': 'No Payment Requests Created with Status: Initiated'
  };
  
  const defaultMessage = 'No Payment Requests Created';

  const handleStatusChange = event => {
    setStatus(event.target.value);
  };

  useEffect(() => {
    getUserPaymentRequests(userID, status);
  }, [status]);

  // Get All Payment Requests created by user
  const getUserPaymentRequests = useCallback(
    (userID, status) => {
      setLoading(true);
      let newStatus = status === 'All' ? null : status;
      axios
        .post('/schedule/allRequestPayments', {
          userID,
          status: newStatus
        })
        .then(response => {
          if (isMountedRef.current) {
            const { data, status } = response.data;
            setShiftsData(status ? data : []);
            setLoading(false);
          }
        })
        .catch(error => {
          console.error('Error fetching shifts data:', error);
          if (isMountedRef.current) {
            setShiftsData([]);
            setLoading(false);
          }
        });
    },
    [isMountedRef, status]
  );

  return (
    <Box sx={classes.root}>
      <Grid container spacing={2} alignItems="center" style={{marginBlock: '8px'}}>
        <Grid size={{ xs: isMobile ? 12 : 2, sm: 3, md: 2 }}>
          <TextField
            id="status-filter"
            select
            fullWidth
            label="Status"
            value={status}
            onChange={handleStatusChange}
            variant="outlined"
            sx={classes.textField}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Initiated">Initiated</MenuItem>
            <MenuItem value="Approved">Paid</MenuItem>
            <MenuItem value="Approved With Edit">Paid With Edit</MenuItem>
            <MenuItem value="Declined">Declined</MenuItem>
          </TextField>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Card sx={classes.infoCard} elevation={0}>
                <span style={{fontWeight: 600}}>Info: </span>You can view all payment requests created & details of the request by clicking on view.
          </Card>
        </Grid>
        {shiftsData.length > 0 &&
          <Grid size={12}>
            <Card sx={classes.textCard} elevation={0}>
              Number of payment requests created till date: {shiftsData.length}
            </Card>
          </Grid>
        }
      </Grid>
      {isLoading ? (
        <TableSkeleton columns={6}/>
      ) : (
        <>
          {shiftsData.length > 0 ? (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={classes.scrollbar}
              style={{
                overflowX: 'auto',
                backgroundColor: 'transparent',
                border: shiftsData.length > 0 && '1px solid #DFDFDF',
                borderRadius: '4px',
                marginTop: '16px'
              }}
            >
              <Table sx={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Request ID</TableCell>
                    <TableCell>Payment Request Timeline</TableCell>
                    <TableCell>Requested Date</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Detail</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shiftsData.map(row => (
                    <TableRow hover sx={{'&:hover': {background: '#F9F9F9'}}} key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>
                        {moment(row.paymentStartDate).format('MMM DD, YYYY') +
                          ' to ' +
                          moment(row.paymentEndDate).format('MMM DD, YYYY')}
                      </TableCell>
                      <TableCell>{moment(row.requestedDate).format('MMM DD, YYYY')}</TableCell>
                      <TableCell>{`$${row.approvedTotalShiftRate}`}</TableCell>
                      <TableCell>
                        {row.status === 'Initiated' && (
                          <Label color="primary">{row.status}</Label>
                        )}
                        {row.status === 'Approved' && (
                          <Label color="success">Paid</Label>
                        )}
                        {row.status === 'Approved With Edit' && (
                          <>
                            <Label color="warning">Paid With Edit</Label>
                            <Tooltip arrow title={`Reason: ${row.reason || ''}`}>
                              <IconButton size="small">
                                <InfoOutlinedIcon fontSize="small" style={{ color: 'darkgrey' }}/>
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        {row.status === 'Declined' && (
                          <>
                            <Label color="error">{row.status}</Label>
                            <Tooltip arrow title={`Reason: ${row.reason || ''}`}>
                              <IconButton size="small">
                                <InfoOutlinedIcon fontSize="small" style={{ color: 'darkgrey' }}/>
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link to={`/schedule/payment-request-details/${row.id}`}>
                          <IconButton>
                            <VisibilityIcon style={{ color: '#4C4B4B' }} />
                          </IconButton>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={classes.placeHolder}>
              {statusMessages[status] || defaultMessage}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default RequestHistoryTable;
