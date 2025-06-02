import React from 'react';
import { FormControlLabel, Radio } from '@mui/material';

export const DecisionOptions = (showNA = false, showNoChange = false) => {
  const options = showNA
    ? ['Yes', 'No', 'N/A - barriers not perceived']
    : showNoChange
    ? ['Yes', 'No', 'No Change']
    : ['Yes', 'No'];

  return options.map(value => (
    <FormControlLabel
      key={value}
      value={value}
      control={<Radio />}
      label={value}
    />
  ));
};

export const RatingOptions = () => {
  const options = ['Excellent', 'Good', 'Average', 'Fair', 'Poor'];

  return options.map(option => (
    <FormControlLabel
      key={option}
      value={option}
      control={<Radio />}
      label={option}
    />
  ));
};
