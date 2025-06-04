import React, { useState, useCallback } from 'react';
import { Autocomplete, InputAdornment, IconButton } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { SearchField } from 'src/views/new_staffing/components';
import { debounce } from 'lodash';

export const JobSearchbar = ({ searchJobTitle, setSearchJobTitle, updateFilter }) => {

  // Debounce
  const debouncedUpdateFilter = useCallback(
    debounce(value => {
      updateFilter('jobTitle', value);
    }, 300),
    []
  );

  // Handle Job Title Search
  const handleSearchChange = e => {
    const { value } = e.target;
    setSearchJobTitle(value);
    debouncedUpdateFilter(value);
  };

  return (
    <SearchField
      fullWidth
      placeholder="Search With Job Title"
      value={searchJobTitle}
      onChange={handleSearchChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {searchJobTitle && (
              <IconButton onClick={() => setSearchJobTitle('')}>
                <CloseRoundedIcon style={{ color: '#888' }} />
              </IconButton>
            )}
            <SearchRoundedIcon style={{ color: '#888' }} />
          </InputAdornment>
        )
      }}
    />
  );
};

export const JobSpecialtyFilter = ({ specialityOptions, updateFilter }) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);

  // Set the Specialty filter value in global filter as well
  const handleSpecialtyChange = (event, newValue) => {
    setSelectedSpecialty(newValue);
    updateFilter('specialty', newValue);
  };

  return (
    <Autocomplete
      options={specialityOptions}
      getOptionLabel={option => option}
      value={selectedSpecialty}
      onChange={handleSpecialtyChange}
      renderInput={params => (
        <SearchField
          {...params}
          variant="outlined"
          placeholder="Select Specialty"
        />
      )}
    />
  );
};
