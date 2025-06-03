import React, { useCallback, useEffect, useState } from 'react';
import { Box, Tooltip, Card, Button, Grid, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from '../../../../../utils/axios';
import useIsMountedRef from '../../../../../hooks/useIsMountedRef';
import { useSelector } from 'react-redux';
import moment from 'moment';
import ShiftsTable from './ShiftsTable';
import RequestPaymentPopup from './RequestPaymentPopup';
import TableSkeleton from '../../components/TableSkeleton';
import useBreakpoints from '../../../../../hooks/useBreakpoints';

export const mainStyles = {
  root: {
    marginBottom: '20px',
    minHeight: '60vh',
  },
  dateField: {
    '& .MuiInputBase-root': {
      '@media (max-width: 600px)': { // Breakpoint for 'xs'
        width: '100%',
      },
    },
    '& .MuiSvgIcon-root': {
      color: '#2872C1',
    },
  },
  button: {
    '@media (max-width: 600px)': { // Breakpoint for 'xs'
      width: '100%',
    },
  },
  textButton: {
    '@media (max-width: 600px)': { // Breakpoint for 'xs'
      width: '100%',
    },
  },
  infoCard: {
    backgroundColor: '#F8F8F8',
    color: 'black',
    height: '100%',
    fontSize: '12px',
    padding: '12px',
    fontFamily: 'Poppins',
  },
  textCard: {
    background: 'none',
    color: 'black',
    fontSize: '14px',
    fontFamily: 'Poppins',
    paddingLeft: '4px',
  },
};

const PaymentRequests = () => {
  const classes = mainStyles;
  const isMountedRef = useIsMountedRef();
  const { id } = useSelector(state => state.account.user);
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const { isMobile } = useBreakpoints();

  const [startDate, setStartDate] = useState(moment().subtract(1, 'months').toDate());
  const [endDate, setEndDate] = useState(moment().toDate());
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  const [count, setCount] = useState(1);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [shiftsData, setShiftsData] = useState([]);
  const totalShifts = shiftsData?.totalCount;

  useEffect(() => {
    getShiftsData(page, limit, startDate, endDate);
  }, [page, limit]);

  // Get Users Shifts Data using start date & end date
  const getShiftsData = useCallback(
    (page, limit, startDate, endDate) => {
      setLoading(true);
      const offset = page + 1;
      const url = `/schedule/requestPayment?page=${offset}&limit=${limit}`;

      axios
        .post(url, { startDate, endDate, userID: id })
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
    [isMountedRef]
  );

  const handleStartDateChange = date => {
    if (date) {
      setTempStartDate(date);
    }
  };

  const handleEndDateChange = date => {
    if (date) {
      setTempEndDate(date);
    }
  };

  // Apply Start Date & End Date for Filtering Shifts
  const handleApplyFilter = () => {
    setPage(0)
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    getShiftsData(page, limit, tempStartDate, tempEndDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={classes.root}>
        <RequestPaymentPopup
          open={open}
          setOpen={setOpen}
          startDate={startDate}
          endDate={endDate}
          shiftsData={shiftsData}
          id={id}
        />
        <Grid container spacing={2} alignItems="center" style={{marginBlock: '12px'}}>
          <Grid size={isMobile ? 6 : undefined}>
            <DatePicker
              id="start-date-picker"
              margin="normal"
              label="Start Date"
              format="dd-MMM-yyyy"
              value={tempStartDate}
              minDate={moment().subtract(3, 'months').toDate()}
              maxDate={tempEndDate}
              onChange={handleStartDateChange}
              renderInput={params => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid size={isMobile ? 6 : undefined}>
            <DatePicker
              margin="normal"
              id="end-date-picker"
              label="End Date"
              format="dd-MMM-yyyy"
              value={tempEndDate}
              minDate={tempStartDate}
              maxDate={moment().toDate()}
              onChange={handleEndDateChange}
              renderInput={params => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid size={isMobile ? 12 : undefined}>
            <Button variant="contained" color="primary" size="large" fullWidth={isMobile} onClick={handleApplyFilter}>
              Apply
            </Button>
          </Grid>
          {!isMobile && <Grid></Grid>}
          <Grid size={isMobile ? 12 : undefined}>
            <Tooltip arrow title={`${shiftsData.length < 1 ? 'You do not have shifts to create request payment' : 'You can request payment for the shifts in the current timeframe'}`}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth={isMobile}
                style={{backgroundColor: shiftsData.length < 1 && 'grey'}}
                onClick={shiftsData.length < 1 ? () => {return} : setOpen}
              >
                Request Payment
              </Button>
            </Tooltip>
          </Grid>
          {isMobile && <Grid></Grid>}
        </Grid>
        <Grid container spacing={2}>
          <Grid size={12}>
              <Card sx={classes.infoCard} elevation={0}>
                <span style={{fontWeight: 600}}>Info: </span>You can request payment for shifts worked for specific start date and end date, which can be changed. You can also check past payments created & details in the Payment History tab.
              </Card>
          </Grid>
          {totalShifts && 
            <Grid size={12}>
                <Card sx={classes.textCard} elevation={0}>
                  Number of shifts in current time frame: <span style={{fontWeight: 600}}>{totalShifts}</span>
                </Card>
            </Grid>
          }
        </Grid>
        {isLoading ? (
          <TableSkeleton columns={10}/>
        ) : (
          <ShiftsTable
            count={count}
            setCount={setCount}
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            shiftsData={shiftsData}
            setShiftsData={setShiftsData}
            startDate={startDate}
            endDate={endDate}
          />
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default PaymentRequests;