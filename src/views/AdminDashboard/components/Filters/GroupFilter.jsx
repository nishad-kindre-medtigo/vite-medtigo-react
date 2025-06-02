import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';

const GroupFilter = ({ options, selectedOptions, handleOptionChange }) => {
  const allOptions = [{ id: 'all', name: 'All' }].concat(options);
  const { role } = useSelector((state) => state.account.user);

  const isAllSelected = selectedOptions.length === allOptions.length - 1;

  useEffect(() => {
    // Initialize selectedOptions with all department IDs except 'all'
    handleOptionChange(
      allOptions.map(type => type.id).filter(id => id !== 'all')
    );
  }, [options]);

  const handleSelectChange = event => {
    const value = event.target.value;

    if (value.includes('all')) {
      handleOptionChange(
        isAllSelected
          ? []
          : allOptions.map(type => type.id).filter(id => id !== 'all')
      );
    } else {
      handleOptionChange(value);
    }
  };

  if ((role !== "hospital_admin" && role !== "admin")){
    return <></>
  }

  return (
    <FormControl
      fullWidth
      size="small"
      sx={{ maxWidth: { sm: '100%', md: '150px' } }}
    >
      <InputLabel>Groups</InputLabel>
      <Select
        multiple
        value={selectedOptions}
        onChange={handleSelectChange}
        label="Groups"
        renderValue={selected =>
          isAllSelected ? 'All' : `Selected: ${selected.length}`
        }
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 200, // Set a fixed height for the dropdown
              overflow: 'auto', // Enable scrolling if the content exceeds the height
            },
          },
        }}
      >
        {allOptions.map(type => (
          <MenuItem
            key={type.id}
            value={type.id}
            style={{ height: '40px', display: 'flex', alignItems: 'center' }}
          >
            <Checkbox
              checked={
                type.id === 'all'
                  ? isAllSelected
                  : selectedOptions.includes(type.id)
              }
              style={{ marginRight: 8 }}
            />
            <ListItemText primary={type.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GroupFilter;
