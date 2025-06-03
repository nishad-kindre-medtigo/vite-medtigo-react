import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, TextField, Grid, FormControl, Select, InputLabel, MenuItem, Tooltip } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import expenseService from '../../../../services/expenseService';
import { serviceLine, siteList } from '../../../../appConstants';
import { CommentBox, SubmitButton } from '../../components';
import moment from 'moment';

const ErrorMessage = ({ error }) => {
  return (
    <span
      style={{
        color: '#C9001D',
        fontSize: '12px',
        marginLeft: '4px'
      }}
    >
      {error}
    </span>
  );
};

function Results() {
  const { user } = useSelector(state => state.account);
  const userName = user.first_name ? user.first_name + ' ' + user.last_name : '';
  const [Name, setName] = useState(userName);
  const [Email, setEmail] = useState(user.email);
  const [Total_Expected_Payment, setTotalExpectedPayment] = useState(0);
  const [StartDate, setStartDate] = useState(null);
  const [EndDate, setEndDate] = useState(null);
  const [Assignment_Worked, setAssignmentWorked] = useState(1);
  const [Site, setSite] = useState([]);
  const [ServiceLine, setServiceLine] = useState([]);
  const [HoursWorked, setHoursWorked] = useState([]);
  const [ExpectedPayment, setExpectedPayment] = useState([0]);
  const [Comments, setComments] = useState('');
  const [inputFields, setInputFields] = useState([
    { Site: '', ServiceLine: '', HoursWorked: '', ExpectedPayment: '' }
  ]);
  const [inputs, setInputs] = useState();
  const [Total, setTotal] = useState();
  const openSnackbar = useOpenSnackbar();
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const handleInputChange = (e, fieldName, fieldValue) => {
    const name = fieldName ? fieldName : e.target ? e.target.name : '';
    const value = fieldValue ? fieldValue : e.target ? e.target.value : '';
    name &&
      setInputs(inputs => {
        const inputsObj = { ...inputs, [name]: value };
        if (fieldName == 'Start_Date') {
          setStartDate(fieldValue);
          setStartDateError('');
        }
        if (fieldName == 'End_Date') {
          setEndDate(fieldValue);
          setEndDateError('');
        }
        return inputsObj;
      });
  };

  const reimbursement = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  const addFields = Assignment => {
    let newfield = {
      Site: '',
      ServiceLine: '',
      HoursWorked: '',
      ExpectedPayment: ''
    };
    let fields = [];
    for (let i = 0; i < Assignment; i++) {
      fields.push(newfield);
    }
    setInputFields(fields);
  };

  const setExpectedPaymentValues = async value => {
    let ExpectedPayment = value;
    let total;
    total = Number(ExpectedPayment) + Number(total);
    setTotalExpectedPayment(Number(total));
  };

  // Function to manage multiple Items Value

  const handleFormChange = (index, event, value) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.value;
    setInputFields(data);
    if (event.target.name === 'site') {
      Site.splice(index, 1, value);
    } else if (event.target.name === 'ServiceLine') {
      ServiceLine.splice(index, 1, value);
    } else if (event.target.name === 'HoursWorked') {
      HoursWorked.splice(index, 1, value);
      serviceLine.map(amounts => {
        if (ServiceLine[index] == amounts.name) {
          ExpectedPayment.splice(index, 1, value * amounts.amount);
          setExpectedPaymentValues(Number(value * amounts.amount));
        }
      });
    } else if (event.target.name === 'ExpectedPayment') {
      // Handle manual changes to ExpectedPayment
      const newValue = event.target.value === '' ? '' : Number(event.target.value);
      ExpectedPayment.splice(index, 1, newValue);
      let total = 0;
      ExpectedPayment.forEach(val => {
        total += Number(val) || 0; // Use || 0 to handle empty string
      });
      setTotalExpectedPayment(total);
    }
  };

  const resetData = () => {
    setTotalExpectedPayment(0);
    setName(user.first_name ? user.first_name + ' ' + user.last_name : '');
    setEmail(user.email);
    setTotalExpectedPayment(0);
    setAssignmentWorked('');
    setComments('');
    setStartDate(null);
    setEndDate(null);
    setInputFields([
      { Site: '', ServiceLine: '', HoursWorked: '', ExpectedPayment: '' }
    ]);
  };

  const handleSubmit = async event => {
    try {
      setDisableButton(true);
      event.preventDefault();

      // Validate Total Expected Payment
      if (Total_Expected_Payment <= 0) {
        setPaymentError('Total Expected Payment must be greater than 0');
        setDisableButton(false);
        return;
      } else {
        setPaymentError('');
      }
      
      const formData = new FormData();
      formData.set('Name', Name);
      formData.set('Email', Email);
      formData.set('Total_Expected_Payment', Total_Expected_Payment);
      formData.set('Assignment_Worked', Assignment_Worked);
      formData.set('ExpectedPayment', ExpectedPayment);
      formData.set('Comments', Comments);
      formData.set('StartDate', moment(StartDate).format('MM-DD-YYYY'));
      formData.set('EndDate', moment(EndDate).format('MM-DD-YYYY'));
      formData.set('Site', Site);
      formData.set('ServiceLine', ServiceLine);
      formData.set('HoursWorked', HoursWorked);

      let responseData;
      if (StartDate === null) {
        setStartDateError('Required*');
      }
      if (EndDate === null) {
        setEndDateError('Required*');
      }

      if (StartDate !== null && EndDate !== null) {
        responseData = await expenseService.addSiteExpenses(formData);
      }
      if (responseData) {
        resetData();
        openSnackbar('Site Expense Added Successfully!');
      }
    } catch (error) {
      setDisableButton(true);
      openSnackbar(error.message, 'error');
    } finally {
      resetData();
      setDisableButton(false);
    }
  };

  useEffect(() => {
    if (Assignment_Worked) {
      addFields(Assignment_Worked);
    }
  }, [Assignment_Worked]);

  useEffect(() => {
    let total = 0;
    ExpectedPayment.map(value => {
      total = Number(value) + Number(total);
    });
    setTotal(Number(total));
  }, [Total_Expected_Payment]);

  useEffect(() => {
    setTotalExpectedPayment(Total);
  }, [Total]);
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        <Box>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                handleChange={event => setName(event.target.value)}
                value={Name}
                required
                type="text"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Tooltip title="Email" followCursor>
                <span>
                  <TextField
                    fullWidth
                    disabled
                    label="Email"
                    name="email"
                    value={user.email}
                    required
                    type="email"
                  />
                </span>
              </Tooltip>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Tooltip title="Total Expected Payment" followCursor>
                <span>
                  <TextField
                    disabled
                    fullWidth
                    label="Total Expected Payment"
                    name="ExpectedPayment"
                    value={Total_Expected_Payment}
                    error={!!paymentError}
                    helperText={paymentError}
                  />
                </span>
              </Tooltip>
              {/* {paymentError && <ErrorMessage error={paymentError} />} */}
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth required>
                <InputLabel>Assignment Worked</InputLabel>
                <Select
                  required
                  label="Assignment Worked"
                  name="AssignmentWorked"
                  value={Assignment_Worked}
                  onChange={event => setAssignmentWorked(event.target.value)}
                  sx={{ height: '56px' }}
                >
                  {reimbursement.map(Reimburesement => {
                    return (
                      <MenuItem key={Reimburesement} value={Reimburesement}>
                        {Reimburesement}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <DatePicker
                  fullWidth
                  id="start-date"
                  label="Start Date"
                  name="Start_Date"
                  value={StartDate ? StartDate : null}
                  onChange={value => value && handleInputChange(null, 'Start_Date', value)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </FormControl>
              {startDateError && <ErrorMessage error={startDateError} />}
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <DatePicker
                  fullWidth
                  id="end-date"
                  label="End Date"
                  name="End_Date"
                  value={EndDate ? EndDate : null}
                  onChange={value => value && handleInputChange(null, 'End_Date', value)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </FormControl>
              {startDateError && <ErrorMessage error={endDateError} />}
            </Grid>

            {inputFields.map((input, index) => {
              return (
                <Grid container spacing={3} key={index} size={12}>
                  <Grid size={12}>
                    <h3 style={{ color: '#000', marginBottom: '12px' }}>
                      Assignment - {index + 1}
                    </h3>
                    <hr></hr>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth required>
                      <InputLabel>Site</InputLabel>
                      <Select
                        required
                        label="Site"
                        name="site"
                        value={index.Site}
                        onChange={event =>
                          handleFormChange(index, event, event.target.value)
                        }
                        sx={{ height: '56px' }}
                      >
                        {siteList.map(site => {
                          return (
                            <MenuItem key={site} value={site}>
                              {site}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth required>
                      <InputLabel>Service Line</InputLabel>
                      <Select
                        required
                        label="Service Line"
                        name="ServiceLine"
                        value={index.ServiceLine}
                        onChange={event =>
                          handleFormChange(index, event, event.target.value)
                        }
                        sx={{ height: '56px' }}
                      >
                        {serviceLine.map(line => {
                          return (
                            <MenuItem key={line.name} value={line.name}>
                              {line.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Hours Worked"
                      name="HoursWorked"
                      onChange={event =>
                        handleFormChange(index, event, event.target.value)
                      }
                      required
                      type="number"
                      inputProps={{ min: 0, step: 0.1, pattern: "\\d+(\\.\\d{1,2})?" }}
                      min={0}
                      step={0.1}
                      onKeyPress={event => {
                          // Allow decimal point (charCode 46) and numbers (48-57)
                          if (event.charCode !== 46 && (event.charCode < 48 || event.charCode > 57)) {
                            event.preventDefault();
                          }
                      
                          // Prevent multiple decimal points
                          if (event.charCode === 46 && event.target.value.includes('.')) {
                            event.preventDefault();
                          }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Tooltip title="Your Expected Payment" followCursor>
                      <span>
                        <TextField
                          fullWidth
                          label="Your Expected Payment"
                          name="ExpectedPayment"
                          value={ExpectedPayment[index] === '' ? '' : ExpectedPayment[index] || 0}
                          onChange={event => handleFormChange(index, event, event.target.value)}
                          type="number"
                          inputProps={{ min: 0, step: "0.01" }}
                          // Optional: Add key press handler to allow only numbers and decimal
                          onKeyPress={event => {
                            if (event.charCode !== 46 && (event.charCode < 48 || event.charCode > 57)) {
                              event.preventDefault();
                            }
                            // Prevent multiple decimal points
                            if (event.charCode === 46 && event.target.value.includes('.')) {
                              event.preventDefault();
                            }
                          }}
                        />
                      </span>
                    </Tooltip>
                  </Grid>
                </Grid>
              );
            })}

            <CommentBox
              Comments={Comments}
              onChange={event => setComments(event.target.value)}
            />
          </Grid>
          <Grid container sx={{ justifyContent: 'center' }}>
            <SubmitButton disableButton={disableButton} />
          </Grid>
        </Box>
      </form>
    </LocalizationProvider>
  );
}

export default Results;
