import React, { useEffect } from 'react';
import {
  Grid,
  IconButton,
  TextField,
  Typography,
  Autocomplete,
  Button,
  FormControl,
  FormLabel,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/CloseRounded';
import { specificDesignations } from '../appConstants';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const FilterCertificatesDrawer = props => {
  const {
    onClose,
    filterCertificates,
    inputs,
    setInputs,
    resetFilters
  } = props;

  useEffect(() => {
    function selectYearOnDateSelection(e) {
      if (
        !e.target.matches(
          '.MuiTypography-root.MuiPickersToolbarText-toolbarTxt.MuiTypography-subtitle1'
        ) &&
        !e.target.matches(
          'p.MuiTypography-root.MuiTypography-body1.MuiTypography-alignCenter'
        )
      )
        return;
      document
        .querySelector(
          '.MuiTypography-root.MuiPickersToolbarText-toolbarTxt.MuiTypography-subtitle1'
        )
        .click();
    }

    document.addEventListener('click', selectYearOnDateSelection);
    return () =>
      document.removeEventListener('click', selectYearOnDateSelection);
  }, []);

  const handleInputChange = (e, fieldName, fieldValue) => {
    const name = fieldName ? fieldName : e.target?.name;
    const value = fieldValue ? fieldValue : e.target?.value;
    if (name) {
      setInputs(inputs => ({ ...inputs, [name]: value }));
    }
  };

  return (
    <Grid
      container
      sx={{
        maxWidth: 500,
        width: '100%',
        position: 'relative',
        px: 4,
        py: 2
      }}
    >
      <Typography
        sx={{
          fontSize: 24,
          color: '#2872C1',
          fontWeight: 600
        }}
        gutterBottom
      >
        Filter Certificates
      </Typography>
      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: '#2872C1'
        }}
        onClick={onClose}
      >
        <CloseIcon fontSize="large" />
      </IconButton>
      <Grid container direction="column" spacing={2}>
        <form
          onSubmit={e => {
            e.preventDefault();
            filterCertificates(inputs);
          }}
        >
          {/* Keyword Input */}
          <FormControl fullWidth margin="normal">
            <FormLabel>Search Keywords</FormLabel>
            <TextField
              id="keyword"
              label="Enter Keyword"
              name="keyword"
              value={inputs['keyword'] || ''}
              onChange={e => handleInputChange(e, 'keyword')}
            />
          </FormControl>

          {/* Specific Designation Input */}
          <FormControl fullWidth margin="normal">
            <FormLabel>Specific Designations</FormLabel>
            <Autocomplete
              getOptionLabel={option => option.name}
              id="Specific_Designation"
              options={specificDesignations.filter((_, i) => i !== 0)} // Skipping the first one
              value={
                inputs['Specific_Designation']
                  ? specificDesignations.find(
                      des => des.id === inputs['Specific_Designation']
                    )
                  : null
              }
              onChange={(e, value) =>
                handleInputChange(
                  e,
                  'Specific_Designation',
                  value ? value.id : null
                )
              }
              renderInput={params => (
                <TextField {...params} label="Select Specific Designation" />
              )}
            />
          </FormControl>

          {/* Date Range Inputs */}
          <FormControl fullWidth margin="normal">
            <FormLabel>Date Range</FormLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box display="flex" gap={2} mt={1}>
                <DatePicker
                  disableFuture
                  label="From"
                  value={inputs['from_date'] || null}
                  onChange={value =>
                    handleInputChange(null, 'from_date', value)
                  }
                  renderInput={params => <TextField {...params} />}
                />
                <DatePicker
                  disableFuture
                  label="To"
                  value={inputs['to_date'] || null}
                  onChange={value => handleInputChange(null, 'to_date', value)}
                  renderInput={params => <TextField {...params} />}
                />
              </Box>
            </LocalizationProvider>
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 2 }}
          >
            Apply Filter
          </Button>

          {/* Reset Button */}
          {Object.keys(inputs).length > 0 && (
            <Typography
              onClick={resetFilters}
              sx={{
                mt: 2,
                color: '#2872C1',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Reset to defaults
            </Typography>
          )}
        </form>
      </Grid>
    </Grid>
  );
};

export default FilterCertificatesDrawer;
