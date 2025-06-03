import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Typography,
  Alert,
  Box,
  TextField,
} from '@mui/material';
import mailPreferenceService from '../../../../services/mailPreferenceService';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { TimePicker } from '@mui/x-date-pickers';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';



export default function EmailPreferenceDialog({ open, setOpen }) {
  const [value, setValue] = useState('realtime');
  const [time, setTime] = useState("08:00 PM");
  const { user } = useSelector(state => state.account);
const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    fetchPreferences();
  }, []);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const submit = async() => {
    try {
        let payload={
            email_schedule:value,
            time:time,
        };
        const res = await mailPreferenceService.updateMailPreference(payload);
        enqueueSnackbar('Mail preference updated successfully', { variant: 'success' });
    } catch (error) {
        enqueueSnackbar('Failed to update mail preference', { variant: 'success' });
        console.log(error);
    }
    setOpen(false) // or trigger your save logic here
  };

  const fetchPreferences = async () => {
    try {
      const res = await mailPreferenceService.getMailPreference(user.id);
      if(res.data){
          setValue(res.data.email_schedule);
          setTime(res.data.time);
        }
    } catch (error) {
      console.log(error);
    }
  };
  
  const onClose = () => {
    setOpen(false);
  };


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="subtitle1" fontWeight="bold">
          How would you like to receive your email updates?
        </Typography>
      </DialogTitle>
      <DialogContent sx={{height:'150px'}}>
        <RadioGroup row value={value} onChange={handleChange}>
          <FormControlLabel value="realtime" control={<Radio defaultChecked color='primary'/>} label="Real Time" />
          <FormControlLabel value="daily" control={<Radio color='primary'/>} label="Daily" />
          <FormControlLabel value="weekly" control={<Radio color='primary'/>} label="Once in a week" />
        </RadioGroup>
        {value === 'daily' && (
          <Box sx={{ mt: 2 }}>
            {/* <StaticTimePickerLandscape setTime={setTime}/> */}
            <Alert severity="info" sx={{ mb: 2 }}>
              A summary will be sent at the end of each day.
            </Alert>
          </Box>
        )}
        {value === 'weekly' && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Choosing the weekly option may be overwhelming as it includes all emails from the week
          </Alert>
        )}

        {value === 'realtime' && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {"You'll receive an email as soon as there's an update"}
          </Alert>
        )}

        {/* {value === 'daily' && (
          <Alert severity="info" sx={{ mt: 2 }}>
            A summary will be sent at the end of each day.
          </Alert>
        )} */}
        
      </DialogContent>
      <DialogActions sx={{m:1}}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={!value} variant="contained" onClick={submit}>
          Save Preference
        </Button>
      </DialogActions>
    </Dialog>
  );
}


function StaticTimePickerLandscape({ setTime }) {
  const [hour, setHour] = useState('09');
  const [meridiem, setMeridiem] = useState('AM');

  const handleHourChange = (event) => setHour(event.target.value);
  const handleMeridiemChange = (event) => setMeridiem(event.target.value);

  React.useEffect(() => {

    setTime(`${hour}:00 ${meridiem}`);
  }, [hour, meridiem])

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
      <Typography variant="subtitle1" fontWeight="bold">
        Select Time:
      </Typography>

      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel>Hour</InputLabel>
        <Select value={hour} label="Hour" onChange={handleHourChange}>
          {[...Array(12)].map((_, i) => {
            const h = (i + 1).toString().padStart(2, '0');
            return <MenuItem key={h} value={h}>{h}</MenuItem>;
          })}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel>AM/PM</InputLabel>
        <Select value={meridiem} label="AM/PM" onChange={handleMeridiemChange}>
          <MenuItem value="AM">AM</MenuItem>
          <MenuItem value="PM">PM</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}