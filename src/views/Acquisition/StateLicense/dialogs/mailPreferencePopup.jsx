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
  Box
} from '@mui/material';
import mailPreferenceService from '../../../../services/mailPreferenceService';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSelector } from 'react-redux';

export default function EmailPreferenceDialog({ open, setOpen }) {
  const [value, setValue] = useState('realTime');
  const [time, setTime] = useState("08:00 PM");
  const { user } = useSelector(state => state.account);

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
    } catch (error) {
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
      <DialogContent>
        <RadioGroup row value={value} onChange={handleChange}>
          <FormControlLabel value="realtime" control={<Radio defaultChecked color='primary'/>} label="Real Time" />
          <FormControlLabel value="daily" control={<Radio color='primary'/>} label="Daily (End of the day)" />
          {/* <FormControlLabel value="weekly" control={<Radio color='primary'/>} label="Once in a week" /> */}
        </RadioGroup>
        {value === 'weekly' && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Choosing the weekly option may be overwhelming as it includes all emails from the week
          </Alert>
        )}

        {value === 'realtime' && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {"You'll receive an email as soon as there's an update."}
          </Alert>
        )}

        {value === 'daily' && (
          <Alert severity="info" sx={{ mt: 2 }}>
            A summary will be sent at the end of each day.
          </Alert>
        )}
        {/* {value === 'daily' && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              A summary will be sent at the end of each day.
            </Alert>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                              label="Select delivery time"
                              value={time}
                              onChange={(newValue) => setTime(newValue)}
                              slotProps={{
                                  textField: {
                                      fullWidth: true,
                                      variant: 'outlined',
                                      size: 'small',
                                  },
                              }}
                          />
                      </LocalizationProvider>
          </Box>
        )} */}
      </DialogContent>
      <DialogActions>
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

