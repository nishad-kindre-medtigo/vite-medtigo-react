import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const QuizResultFilter = ({ filteredValue, setFilteredValue }) => {
  const options = [
    { label: 'All', value: 'all' },
    { label: 'Correct', value: 'correct' },
    { label: 'Incorrect', value: 'incorrect' },
  ];

  return (
    <Autocomplete
      disableClearable
      options={options}
      getOptionLabel={(option) => option.label}
      value={options.find((opt) => opt.value === filteredValue) || options[0]}
      onChange={(_, newValue) => setFilteredValue(newValue.value)}
      renderInput={(params) => (
        <TextField {...params} label="Filter Response" variant="outlined" size="small" />
      )}
      sx={{ width: '200px' }}
    />
  );
};

export default QuizResultFilter;
