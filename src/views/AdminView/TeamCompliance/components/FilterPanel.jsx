import React, { useEffect, useState } from 'react';
import { Drawer, Autocomplete, Button, Box, Checkbox, Chip, Divider, FormControlLabel, Grid, ListItemText, TextField, Tooltip, Typography, RadioGroup, FormControl, Radio, IconButton, Select, MenuItem, InputLabel, ListSubheader } from '@mui/material';
const textFieldStyle = {
  '& .MuiInputBase-root': {
    height: '50px !important',
  },
}

const ProfessionsOptions = [
  { id: '3993767000000111003', name: 'Physicians' },
  { id: '3993767000000111015', name: 'Physician assistants' },
  { id: '3993767000000111019', name: 'APRNS' },
  { id: '3993767000000111007', name: 'RNS' },
  { id: '3993767000000111055', name: 'CRNA' }
];


const FilterPanel = ({
  selectedStates, onStateChange, isAllSelected, stateOptions,
  departmentList, selectedDepartments, onDepartmentChange, selectedProfessions, setSelectedProfessions,
  userOptions, userInputValue, setUserInputValue, disable, GenerateReport
}) => {
  return (
    <Grid container mb={4} spacing={2} alignItems="normal">

      <Grid size={{ xs: 12, sm: 4, md: 2 }}>
        <DepartmentFilter departmentList={departmentList} selectedDepartments={selectedDepartments} onDepartmentChange={onDepartmentChange} />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <ProfessionFilter selectedProfessions={selectedProfessions} setSelectedProfessions={setSelectedProfessions} />
      </Grid>

      <Grid size={{ xs: 12, sm: 4, md: 2 }}>
        <StateFilter stateOptions={stateOptions} selectedStates={selectedStates} onStateChange={onStateChange} isAllSelected={isAllSelected} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <UserFilter userOptions={userOptions} userInputValue={userInputValue} setUserInputValue={setUserInputValue} />
      </Grid>

      <Grid size={{ xs: 12, sm: 4, md: 2 }}>
        <GenerateReportButton disable={disable} GenerateReport={GenerateReport} />
      </Grid>
    </Grid>
  );
};

function ProfessionFilter() {
  const [selectedProfessions, setSelectedProfessions] = useState(ProfessionsOptions);

  const handleChange = (event, newValue) => {
    if (newValue.some((option) => option.id === 'all')) {
      // Toggle between selecting all or clearing them
      if (selectedProfessions.length === ProfessionsOptions.length) {
        setSelectedProfessions([]); // If all are selected, clear them
      } else {
        setSelectedProfessions(ProfessionsOptions); // Select all if not all are selected
      }
    } else {
      setSelectedProfessions(newValue);
    }
  };

  return (
    <Autocomplete
      multiple
      disableClearable
      disableCloseOnSelect
      id="profession-select"
      options={[
        { id: 'all', name: ProfessionsOptions.length === selectedProfessions.length ? 'Clear All' : 'Select All' },
        ...ProfessionsOptions,
      ]}
      getOptionLabel={(option) => option.name}
      value={selectedProfessions}
      onChange={handleChange}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          required
          label="Professions"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            style: { height: 50 }, // Adjust input height
          }}
        />
      )}
      renderOption={(props, option) => {
        const isChecked = selectedProfessions.some((prof) => prof.id === option.id);
        return (
          <li {...props} style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
            {option.name === 'Clear All' ? (
              <Checkbox checked={true} style={{ marginRight: 8 }} />
            ) : (
              <Checkbox checked={isChecked} style={{ marginRight: 8 }} />
            )}
            <ListItemText primary={option.name} />
          </li>
        );
      }}
      renderTags={() => {
        if (selectedProfessions.length === ProfessionsOptions.length) {
          return <p>All</p>;
        } else {
          return <p>Prof: {selectedProfessions.length}</p>;
        }
      }}
      style={{ height: 40 }} // Adjust overall height
    />
  );
}

const StateFilter = ({ stateOptions, selectedStates, onStateChange, isAllSelected }) => {
  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      options={stateOptions.sort((a, b) => {
        const isASelected = selectedStates.some((state) => state.id === a.id);
        const isBSelected = selectedStates.some((state) => state.id === b.id);
        return isBSelected - isASelected;
      })}
      getOptionLabel={(option) => option.name}
      value={selectedStates}
      onChange={onStateChange}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          required
          label="Geography"
          InputProps={{
            ...params.InputProps,
            style: { height: 50 }, // Set height of input
          }}
        />
      )}
      renderOption={(props, option) => {
        const isChecked = option.id === 'all' ? isAllSelected : selectedStates.some(state => state.id === option.id);
        return (
          <li {...props} style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
            <Checkbox checked={isChecked} style={{ marginRight: 8 }} />
            <ListItemText primary={option.name} />
          </li>
        );
      }}
      renderTags={() => {
        return <p>States: {selectedStates.length}</p>;
      }}
      style={{ height: 40 }} // Set overall height of Autocomplete
    />
  );
};


const DepartmentFilter = ({ departmentList, selectedDepartments, onDepartmentChange }) => {
  return (
    <Autocomplete
      disableCloseOnSelect
      disableClearable
      multiple
      options={[
        { id: 'all', name: selectedDepartments.length === departmentList.length ? 'Clear All' : 'Select All' },
        ...departmentList,
      ]}
      getOptionLabel={(option) => option.name}
      value={selectedDepartments}
      onChange={onDepartmentChange}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          required
          {...params}
          variant="outlined"
          label="Groups"
          InputProps={{
            ...params.InputProps,
            style: { height: 50 }, // Set height of input
          }}
        />
      )}
      renderOption={(props, option) => {
        const isChecked = selectedDepartments.some((dep) => dep.id === option.id);
        return (
          <li {...props} style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
            {option.name === 'Clear All' ? (
              <Checkbox checked={true} style={{ marginRight: 8 }} />
            ) : (
              <Checkbox checked={isChecked} style={{ marginRight: 8 }} />
            )}
            <ListItemText primary={option.name} />
          </li>
        );
      }}
      renderTags={() => {
        if (selectedDepartments.length === departmentList.length) {
          return <p>All</p>;
        } else {
          return <p>Departments: {selectedDepartments.length}</p>;
        }
      }}
      style={{ height: 40 }} // Set overall height of Autocomplete
    />
  );
};

const UserFilter = ({ userOptions, userInputValue, setUserInputValue }) => {
  return (
    <Autocomplete
      id="user-filter"
      options={userOptions}
      value={userInputValue || null}
      getOptionLabel={(option) => option.first_name || ''}
      onChange={(event, newValue) => setUserInputValue(newValue)}
      renderInput={(params) => (
        <TextField {...params} fullWidth label="User" required variant="outlined" />
      )}
    />
  );
};

const GenerateReportButton = ({ disable, GenerateReport }) => {
  return (
    <Button
      disabled={disable}
      disableElevation
      size="large"
      variant="contained"
      color="primary"
      fullWidth
      onClick={() => GenerateReport("button")}
      style={{ height: '50px' }} // Set height to 50px
    >
      GENERATE REPORT
    </Button>
  );
};

export default FilterPanel;
