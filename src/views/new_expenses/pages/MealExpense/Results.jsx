import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import { useOpenSnackbar } from '../../../../hooks/useOpenSnackbar';
import expenseService from '../../../../services/expenseService';
import { CommentBox, SubmitButton, FileUpload, AmountInput, UserNameField, DisabledEmailField, DisabledTotalField } from '../../components';

function Results() {
  const { user } = useSelector(state => state.account);
  const userName = user.first_name ? user.first_name + ' ' + user.last_name : '';
  const [Name, setName] = useState(userName);
  const [Email, setEmail] = useState(user.email);
  const [Total_Reimburesement_Request, setTotalReimburesementRequest] = useState(0);
  const [Reimburesement, setReimburesement] = useState('');
  const [Amount, setAmount] = useState([]);
  const [Comments, setComments] = useState('');
  const [Receipt, setReceipt] = useState([]);
  const [disableButton, setDisableButton] = useState(false);
  const [inputFields, setInputFields] = useState([{ Amount: '', Receipt: '' }]);
  const [Total, setTotal] = useState();
  const openSnackbar = useOpenSnackbar();
  // Add state for payment error
  const [paymentError, setPaymentError] = useState('');

  const Reimburesements = ['1', '2', '3', '4', '5'];

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

  const resetData = () => {
    setTotalReimburesementRequest(0);
    setReimburesement('');
    setComments('');
    setAmount([0]);
    setReceipt([]);
    setInputFields([{ Amount: '', Receipt: '' }]);
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
      formData.set('Total_Reimburesement_Request', Total_Reimburesement_Request);
      formData.set('Reimburesement', Reimburesement);
      formData.set('Amount', Amount);
      formData.set('Comments', Comments);

      if (Receipt) {
        for (let i = 0; i < Receipt.length; i++) {
          formData.append(`file`, Receipt[i]);
        }
      }

      const responseData = await expenseService.addMealsExpenses(formData);
      if (responseData) {
        resetData();
        openSnackbar('Meals Expense Added Successfully!');
      }
    } catch (error) {
      setDisableButton(true);
      openSnackbar(error.message, 'error');
    } finally {
      setDisableButton(false);
    }
  };

  useEffect(() => {
    if (Reimburesement) {
      addFields(Reimburesement);
    }
  }, [Reimburesement]);

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
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required>
              <InputLabel>Total # of Reimbursements</InputLabel>
              <Select
                required
                label="Total # of Reimbursements"
                name="Total # of Reimbursements"
                value={Reimburesement}
                onChange={event => setReimburesement(event.target.value)}
                sx={{ height: '56px' }}
              >
                {Reimburesements.map(Reimburesement => (
                  <MenuItem key={Reimburesement} value={Reimburesement}>
                    {Reimburesement}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <DisabledTotalField 
              Total={Total_Reimburesement_Request} 
              error={!!paymentError}
              helperText={paymentError}
          />

          {inputFields.map((input, index) => (
            <Grid container spacing={3} key={index} size={12}>
              <AmountInput
                index={index}
                setAmountValues={setAmountValues}
                handleFormChange={handleFormChange}
                Amount={Amount}
              />

              <FileUpload
                index={index}
                handleFormChange={handleFormChange}
                Receipt={Receipt}
              />
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
