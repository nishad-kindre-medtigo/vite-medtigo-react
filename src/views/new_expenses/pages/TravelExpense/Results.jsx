import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid, FormControl, Select, InputLabel, MenuItem, TextField } from '@mui/material';
import expenseService from '../../../../services/expenseService';
import { useOpenSnackbar } from '../../../../hooks/useOpenSnackbar';
import { CommentBox, SubmitButton, FileUpload, AmountInput, UserNameField, DisabledEmailField, DisabledTotalField } from '../../components';

function Results() {
  const { user } = useSelector(state => state.account);
  const userName = user.first_name ? user.first_name + ' ' + user.last_name : '';
  const [Name, setName] = useState(userName);
  const [Email, setEmail] = useState(user.email);
  const [MileageClaimed, setMileageClaimed] = useState(0);
  const [Total_Reimburesement_Request, setTotalReimburesementRequest] = useState(0);
  const [Non_Mileage_Reimburesement, setNonMileageReimburesement] = useState('0');
  const [Amount, setAmount] = useState([]);
  const [Comments, setComments] = useState('');
  const [Receipt, setReceipt] = useState([]);
  const [inputFields, setInputFields] = useState([{ Amount: '', Receipt: '' }]);
  const [Total, setTotal] = useState();
  const [disableButton, setDisableButton] = useState(false);
  const openSnackbar = useOpenSnackbar();
  const [paymentError, setPaymentError] = useState('');

  const nonMileageReimburesement = ['0', '1', '2', '3', '4', '5'];

  if (MileageClaimed) {
    let Reimburesement_Request = MileageClaimed * 0.25;
    localStorage.setItem('Reimburesement_Request', Reimburesement_Request);
  }

  const addFields = Mileage => {
    let newfield = { Amount: '', Receipt: '' };
    let fields = [];
    for (let i = 0; i < Mileage; i++) {
      fields.push(newfield);
    }
    setInputFields(fields);
  };

  const setAmountValues = async (index, event, value) => {
    let request = localStorage.getItem('Reimburesement_Request');
    let amount = value;
    let total;
    total = Number(amount) + Number(request);
    setTotalReimburesementRequest(total);
  };

  // Function to manage multiple Items Value
  const handleFormChange = (index, event, value) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.value;
    setInputFields(data);
    if (event.target.name === 'Amount') {
      Amount.splice(index, 1, event.target.value);
    } else if (event.target.name === 'Receipt') {
      const file = value;
      const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
      if (file.size > maxSize) {
        openSnackbar(
          'File size exceeds 10 MB. Please upload a smaller file.',
          'error'
        );
        setDisableButton(true);
      } else {
        openSnackbar('File Uploaded Successfully!');
        setDisableButton(false);
        Receipt.push(value);
      }
    }
  };

  const handleSubmit = async event => {
    try {
      setDisableButton(true);
      event.preventDefault();

      // Validate Total Expected Payment
      if (Total_Reimburesement_Request <= 0) {
        setPaymentError('Total Reimbursement Request must be greater than 0');
        setDisableButton(false);
        return;
      } else {
        setPaymentError('');
      }

      const formData = new FormData();
      formData.set('Name', Name);
      formData.set('Email', Email);
      formData.set('MileageClaimed', MileageClaimed);
      formData.set('Total_Reimburesement_Request', Total_Reimburesement_Request);
      formData.set('Non_Mileage_Reimburesement', Non_Mileage_Reimburesement);
      formData.set('Amount', Amount);
      formData.set('Comments', Comments);

      if (Receipt) {
        for (let i = 0; i < Receipt.length; i++) {
          formData.append(`file`, Receipt[i]);
        }
      }

      const responseData = await expenseService.addTravelExpenses(formData);
      if (responseData) {
        setTotalReimburesementRequest(0);
        setName(user.first_name ? user.first_name + ' ' + user.last_name : '');
        setEmail(user.email);
        setMileageClaimed(0);
        setTotalReimburesementRequest(0);
        setNonMileageReimburesement('0');
        setComments('');
        localStorage.removeItem('Reimburesement_Request');
        setInputFields([{ Amount: '', Receipt: '' }]);
        setAmount([]);
        setReceipt([]);
        openSnackbar('Travel Expense Added Successfully!');
      }
    } catch (error) {
      setDisableButton(true);
      openSnackbar(error.message, 'error');
    } finally {
      setDisableButton(false);
    }
  };

  useEffect(() => {
    if (Non_Mileage_Reimburesement) {
      addFields(Non_Mileage_Reimburesement);
    }
  }, [Non_Mileage_Reimburesement]);

  useEffect(() => {
    let total = 0;
    let request = localStorage.getItem('Reimburesement_Request');
    Amount.map(value => {
      total = Number(value) + Number(total);
    });
    setTotal(Number(total) + Number(request));
  }, [Total_Reimburesement_Request]);

  useEffect(() => {
    setTotalReimburesementRequest(Total);
  }, [Total]);

  return (
    <form onSubmit={handleSubmit}>
      <Box>
        <Grid container spacing={4}>
          <UserNameField Name={Name} handleChange={event => setName(event.target.value)} />
          <DisabledEmailField />
          <Grid item sm={6} xs={12}>
            <TextField
              fullWidth
              label="Mileage Claimed"
              name="mileage_claimed"
              onChange={event => {
                setMileageClaimed(event.target.value);
                setTotalReimburesementRequest(event.target.value * 0.25);
              }}
              value={MileageClaimed}
              required
              type="number"
              inputProps={{ min: 0 }}
              min={0}
              step={1}
              onKeyPress={event => {
                if (event.charCode < 48) {
                  event.preventDefault();
                }
              }}
            />
          </Grid>
          <DisabledTotalField 
          Total={Total_Reimburesement_Request} 
          error={!!paymentError}
          helperText={paymentError}
          />

          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Total # of non-Mileage Reimburesements</InputLabel>
              <Select
                required
                label="Total # of non-Mileage Reimbursements"
                name="non-Mileage_Reimbursement"
                onChange={event =>
                  setNonMileageReimburesement(event.target.value)
                }
                value={Non_Mileage_Reimburesement}
                sx={{ height: '56px' }}
              >
                {nonMileageReimburesement.map(Reimburesement => {
                  return (
                    <MenuItem key={Reimburesement} value={Reimburesement}>
                      {Reimburesement}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          {Non_Mileage_Reimburesement !== '0' && inputFields.map((input, index) => (
            <Grid container spacing={3} key={index} item md={12} xs={12}>
              <AmountInput index={index} Amount={Amount} setAmountValues={setAmountValues} handleFormChange={handleFormChange}/>
              <FileUpload index={index} handleFormChange={handleFormChange} Receipt={Receipt} />
            </Grid>
          ))}

          <CommentBox Comments={Comments} onChange={event => setComments(event.target.value)} />
        </Grid>
        <Grid container sx={{ justifyContent: 'center' }}>
          <SubmitButton disableButton={disableButton} />
        </Grid>
      </Box>
    </form>
  );
}

export default Results;
