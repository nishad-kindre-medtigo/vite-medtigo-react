import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Box, Button, TextField, TextareaAutosize, Tooltip } from '@mui/material';

export const pageStyles = {
  root: {
    background: '#F8F8F8',
    minHeight: '100%',
    borderRadius: '4px',
    paddingTop: "8px",
    paddingBottom: "16px",
    marginBlock: "16px",
  }
};

export const CommentBox = ({ Comments, onChange }) => {
  return (
    <Grid item xs={12}>
      <label style={{ color: '#000' }}>Comments:</label>
      <TextareaAutosize
        style={{
          width: '100%',
          background: 'none',
          resize: 'vertical',
          overflow: 'auto',
          minHeight: '56px',
          maxHeight: '168px',
          fontSize: '16px',
          padding: '12px',
          borderRadius: '2px'
        }}
        name="Comments"
        placeholder="Enter your comment"
        minRows={1}
        maxRows={3}
        value={Comments}
        onChange={onChange}
      />
    </Grid>
  );
};

export const SubmitButton = ({ disableButton }) => {
  return (
    <Button
      type="submit"
      variant="contained"
      disabled={disableButton}
      sx={{
        backgroundColor: '#2872C1',
        color: '#fff',
        fontSize: { xs: '14px', sm: '16px' },
        mt: 2,
        py: 1,
        px: 3
      }}
    >
      Submit Expense
    </Button>
  );
};

export const FileUpload = ({ index, handleFormChange, Receipt }) => {
  const handleFileClick = () => {
    document.getElementById(`receipt-${index}`).click();
  };

  return (
    <Grid item sm={6} xs={12}>
      <input
        type="file"
        accept=".xlsx,.xls,image/*,.doc,.docx,.ppt,.pptx,.pdf"
        name="Receipt"
        style={{ display: 'none' }}
        id={`receipt-${index}`}
        onChange={event => {
          handleFormChange(index, event, event.target.files[0]);
        }}
      />
      <Box
        sx={{
          p: 2,
          mt: 0,
          border: '1px dashed #2872C1',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          fontSize: '14px',
          height: '56px',
          cursor: 'pointer',
          color: '#000',
          transition: 'all 0.5s',
          borderRadius: 1
        }}
        onClick={handleFileClick}
      >
        {Receipt[index] ? (
          <>
            <img
              alt="Choose from files"
              src="/icons/file.svg"
              style={{ marginRight: 8 }}
            />
            {Receipt[index].name}
          </>
        ) : (
          <>
            <img
              alt="Choose from files"
              src="/icons/file.svg"
              style={{ marginRight: 8 }}
            />
            Upload Receipt
          </>
        )}
      </Box>
    </Grid>
  );
};

export const AmountInput = ({ index, setAmountValues, handleFormChange, Amount }) => {
  const handleKeyPress = event => {
     // Allow decimal point (charCode 46) and numbers (48-57)
    if (event.charCode !== 46 && (event.charCode < 48 || event.charCode > 57)) {
      event.preventDefault();
    }

    // Prevent multiple decimal points
    if (event.charCode === 46 && event.target.value.includes('.')) {
      event.preventDefault();
    }
  };

  return (
    <Grid item sm={6} xs={12}>
      <TextField
        fullWidth
        label="Amount"
        name="Amount"
        onChange={event => {
          setAmountValues(index, event, event.target.value);
          handleFormChange(index, event, event.target.value);
        }}
        value={Amount[index]}
        required
        inputProps={{ min: 1, step: 0.1, pattern: "\\d+(\\.\\d{1,2})?" }}
        onKeyPress={handleKeyPress}
      />
    </Grid>
  );
};

export const UserNameField = ({ Name, handleChange}) => {
  return (
    <Grid item sm={6} xs={12}>
    <TextField
      fullWidth
      label="Name"
      name="name"
      onChange={handleChange}
      value={Name}
      required
      type="text"
    />
  </Grid>
  )
}

export const DisabledEmailField = () => {
  const { user } = useSelector(state => state.account);

  return (
    <Grid item sm={6} xs={12}>
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
  );
};

export const DisabledTotalField = ({ Total, error, helperText }) => {
  return (
    <Grid item sm={6} xs={12}>
      <Tooltip title="Total Reimbursement Request" followCursor>
        <span>
          <TextField
            fullWidth
            disabled
            label="Total Reimbursement Request"
            name="total_reimburesement_request"
            value={Total}
            error={error}
            helperText={helperText}
            required
            type="number"
          />
        </span>
      </Tooltip>
    </Grid>
  );
};
