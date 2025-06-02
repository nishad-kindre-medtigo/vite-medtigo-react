import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Transition } from '../../../../ui/Transition';
import addMonths from 'date-fns/addMonths';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import moment from 'moment';

const formatDate = (start) => {
  const newEndMonth = moment(start).add(5, 'months').toDate();
  if (!start) return 'Select Month';
  return `${moment(start).format('MMM YYYY')} - ${moment(newEndMonth).format('MMM YYYY')}`;
};

function MonthRangePicker({
  startMonth,
  setStartMonth,
  endMonth,
  setEndMonth,
  handleRefresh
}) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(startMonth);

  const resetSelection = () => {
    setStartMonth(null);
    setEndMonth(null);
  };

  const handleSave = () => {
    setStartMonth(month);
    handleClose();
    handleRefresh();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Button
        variant="outlined"
        onClick={handleOpen}
        style={{ maxWidth: '300px', height: '40px' }}
        startIcon={<CalendarMonthIcon />}
      >
        {formatDate(startMonth)}
      </Button>
      <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
        <DialogTitle>Select Month Range</DialogTitle>
        <DialogContent>
          <Box display="flex" gap={2} mt={1}>
            <DatePicker
              views={['year', 'month']}
              label="Start Month"
              value={month}
              onChange={(newValue) => setMonth(newValue)}
              renderInput={params => <TextField {...params} fullWidth />}
              minDate={new Date('2000-01-01')}
              maxDate={new Date('2030-12-31')}
            />
            <DatePicker
              views={['year', 'month']}
              label="End Month"
              disabled
              value={month ? addMonths(month, 5) : null}
              renderInput={params => <TextField {...params} fullWidth />}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {/* <Button onClick={resetSelection}>Reset</Button> */}
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" style={{ width: '100px' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

export default MonthRangePicker;
