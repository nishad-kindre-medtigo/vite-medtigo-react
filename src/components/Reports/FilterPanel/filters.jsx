import React, { useEffect, useState } from "react";
import {
  Drawer,
  Autocomplete,
  Button,
  Box,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
  RadioGroup,
  FormControl,
  Radio,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  ListSubheader,
  CircularProgress,
} from "@mui/material";
import { ReportFilterContext } from "src/context/ReportFilterContext";
import { IOSSwitch } from "src/views/AdminView/TeamCompliance/components";
import { isEqual } from "lodash";
import RestartAltIcon from '@mui/icons-material/Cached';
import { clearSessionStorage } from "src/views/AdminView/utils";
const Filters = ({
  loading,
  role,
  selectedStates,
  onStateChange,
  onProfessionChange,
  onUserChange,
  userOptions,
  professionOptions,
  isAllSelected,
  stateOptions,
  departmentList,
  selectedDepartments,
  selectedUsers,
  onDepartmentChange,
  selectedProfessions,
  userInputValue,
  setUserInputValue,
  disable,
  GenerateReport,
  onCertificateTypeChange,
  certificateTypeOptions,
  selectedCertificateTypes,
  currentTab,
  ...props
}) => {
      const {setErrorMsg, errorMsg, filtersStatus, setByUser, byUser,filterDetails
    } = React.useContext(ReportFilterContext)
    const [regenerateReport, setRegenrateReport]=React.useState(false)
  // React.useEffect(() => {
  //   if (filterDetails) {
  //     const debounceTimeout = setTimeout(() => {
  //       const filterDetailsSesion = JSON.parse(sessionStorage.getItem('filterDetails'));
  //       let filterChanged = false;
  
  //       if (filterDetails.length === 0 || !filterDetailsSesion) return;
  
  //       for (let i = 0; i < filterDetails.length; i++) {
  //         if (!isEqual(filterDetailsSesion[i], filterDetails[i])) {
  //           filterChanged = true;
  //           break;
  //         }
  //       }
  //       setRegenrateReport(filterChanged)
  //     }, 500);
  
  //     return () => {
  //       clearTimeout(debounceTimeout); 
  //     };
  //   }
  // }, [filterDetails]);

  React.useEffect(()=>{
    return () => {
      sessionStorage.removeItem('filterDetails'); 
    };
  },[])
  
  React.useEffect(()=>{
    if (certificateTypeOptions && certificateTypeOptions.length && !selectedCertificateTypes.length) {
      onCertificateTypeChange(null, certificateTypeOptions); // Select all certificate types by default
    }
    if (stateOptions && stateOptions.length && !selectedStates.length) {
      onStateChange(null, stateOptions); // Select all states by default
    }
    if (departmentList && departmentList.length && !selectedDepartments.length) {
      onDepartmentChange(null, departmentList); // Select all departments by default
    }
    if (professionOptions && professionOptions.length && !selectedProfessions.length) {
      onProfessionChange(null, professionOptions); // Select all professions by default
    }
    if (userOptions && userOptions.length && !selectedUsers.length) {
      onUserChange(null, userOptions); // Select all users by default
    }
  },[])


  if (
    !selectedStates ||
    !selectedProfessions ||
    !selectedDepartments ||
    !selectedUsers ||
    !selectedCertificateTypes
  ) {
    return <></>;
  }

  return (
    <Grid container mt={1} mb={2} spacing={2} alignItems="center">
      {(role === "hospital_admin" || role === "admin") && (
        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <DepartmentFilter
            setErrorMsg={setErrorMsg}
            departmentList={departmentList}
            selectedDepartments={selectedDepartments}
            onDepartmentChange={onDepartmentChange}
          />
        </Grid>
      )}
      {
        currentTab == 'ce_cme' ?
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <CMEProfessionFilter
            setErrorMsg={setErrorMsg}
            professionOptions={professionOptions}
            onProfessionChange={onProfessionChange}
            selectedProfessions={selectedProfessions}
          />
        </Grid>
        :
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <ProfessionFilter
            setErrorMsg={setErrorMsg}
            professionOptions={professionOptions}
            onProfessionChange={onProfessionChange}
            selectedProfessions={selectedProfessions}
          />
        </Grid>
      }

      {
        currentTab != 'clinical-certificate' &&
        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <StateFilter
            setErrorMsg={setErrorMsg}
            stateOptions={stateOptions}
            selectedStates={selectedStates}
            onStateChange={onStateChange}
            isAllSelected={isAllSelected}
          />
        </Grid>
      }

      {
        currentTab == 'clinical-certificate' &&
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <CertificateTypeFilter
            setErrorMsg={setErrorMsg}
            certificateTypeOptions={certificateTypeOptions}
            selectedCertificateTypes={selectedCertificateTypes}
            onCertificateTypeChange={onCertificateTypeChange}
          />
        </Grid>
      }

      {byUser && (
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <UserFilter
            setErrorMsg={setErrorMsg}
            selectedUsers={selectedUsers}
            userOptions={userOptions}
            userInputValue={userInputValue}
            onUserChange={onUserChange}
            setUserInputValue={setUserInputValue}
          />
        </Grid>
      )}

      <Grid size={{ xs: 12, sm: 4, md: 2 }}>
        <GenerateReportButton setRegenrateReport={setRegenrateReport} regenerateReport={regenerateReport} loading={loading} errorMsg={errorMsg} disable={disable} GenerateReport={GenerateReport} currentTab={currentTab} filtersStatus={filtersStatus} filterDetails={filterDetails} byUser={byUser}/>
      </Grid>

      <Grid size={{ xs: 12, sm: 4, md: 2 }}>
        <Box
          sx={{
            height: 50,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Typography>By user</Typography>
          <IOSSwitch
            checked={byUser}
            onChange={() => {
              setByUser(!byUser);
              onUserChange(null, userOptions);
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};


// The rest of the filter components remain unchanged



// The rest of the filter components remain unchanged
function CMEProfessionFilter({ professionOptions, onProfessionChange, selectedProfessions, currentTab }) {
  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      disabled
      id="profession-select"
      options={[
        { id: 'all', name: 'Select All' },
        ...professionOptions,
      ]}
      // options={professionOptions}
      getOptionLabel={(option) => option.name}
      value={[  {
        name: 'Doctor',
        id: '3993767000000111003'
      }]}
      onChange={onProfessionChange}
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
        const isChecked = 
        option.id === 'all'
          ? selectedProfessions.length === professionOptions.length
          :selectedProfessions.some((prof) => prof.id === option.id);
        return (
          <li {...props} style={{ minHeight: '50px', display: 'flex', alignItems: 'center' }}>
            <Checkbox checked={isChecked} style={{ marginRight: 8 }} />
            <ListItemText primary={option.name} />
          </li>
        );
      }}
      renderTags={() => {
          return <p>Doctor</p>;
      }}
      style={{ height: 50 }} // Adjust overall height
    />
  );
}

const ProfessionFilter = React.memo(({ professionOptions, onProfessionChange, selectedProfessions, setErrorMsg }) => {
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    if (selectedProfessions.length === 0 && !isFocused) {
      onProfessionChange(null, professionOptions);
    }
  }, [selectedProfessions,isFocused]);

  // Reorder the options to place selected professions at the top
  const sortedProfessionOptions = [
    { id: 'all', name: 'Select All' }, // Then the 'Select All' option
    ...selectedProfessions, // First place the selected professions
    ...professionOptions.filter(prof => !selectedProfessions.some(selected => selected.id === prof.id)) // Add remaining unselected professions
  ];

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      id="profession-filter"
      options={sortedProfessionOptions}
      getOptionLabel={(option) => option.name}
      value={selectedProfessions.length === 0 ? [{ id: '-1', name: 'Select' }] : selectedProfessions}
      onChange={(event, value) => {
        const filteredValue = value.filter((option) => option.id !== '-1');
        onProfessionChange(event, filteredValue);
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Professions"
          variant="outlined"
          onFocus={() => setIsFocused(true)} // Set isFocused to true on focus
          onBlur={() => setIsFocused(false)}
          InputProps={{
            ...params.InputProps,
            style: { height: 50 },
          }}
        />
      )}
      renderOption={(props, option) => {
        const isChecked = option.id === 'all'
          ? selectedProfessions.length === professionOptions.length
          : selectedProfessions.some((prof) => prof.id === option.id);
        return (
          <li {...props} style={{ minHeight: '50px', display: 'flex', alignItems: 'center' }}>
            <Checkbox checked={isChecked} style={{ marginRight: 8 }} />
            <ListItemText primary={option.name} />
          </li>
        );
      }}
      renderTags={() => {
         if (selectedProfessions.length === professionOptions.length) {
          return <p>All</p>;
        }  else if(selectedProfessions.length>0) {
          return <p>Prof: {selectedProfessions.length}</p>;
        }
      }}
      style={{ height: 50 }}
    />
  );
});

ProfessionFilter.displayName = "ProfessionFilter"; // Set the displayName explicitly

const StateFilter = React.memo(({ stateOptions, selectedStates, onStateChange, setErrorMsg }) => {
  const [isFocused, setIsFocused] = useState(false);
  React.useEffect(() => {
    if (selectedStates.length === 0 && !isFocused) {
      onStateChange(null, stateOptions);
    }
  }, [selectedStates,isFocused]);


  // Reorder the options to place selected states at the top
  const sortedStateOptions = [
    { id: 'all', name: 'Select All' }, // Then the 'Select All' option
    ...selectedStates, // First place the selected states
    ...stateOptions.filter(state => !selectedStates.some(selected => selected.id === state.id)) // Add remaining unselected states
  ];

  return (
    <Autocomplete
      id='state-filter'
      multiple
      disableCloseOnSelect
      options={sortedStateOptions}
      getOptionLabel={(option) => option.name}
      value={selectedStates.length === 0 ? [{ id: '-1', name: 'Select' }] : selectedStates}
      onChange={(event, value, reason) => {
        if (value.some((option) => option.id === 'all')) {
          // Toggle between Select All and Clear All
          if (selectedStates.length === stateOptions.length) {
            onStateChange(event, []); // Clear all
          } else {
            onStateChange(event, stateOptions); // Select all
          }
        } else {
          // Remove "Select" if present and update the selection
          const filteredValue = value.filter((option) => option.id !== '-1');
          onStateChange(event, filteredValue);
        }
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          required
          label="Geography"
          onFocus={() => setIsFocused(true)} // Set isFocused to true on focus
          onBlur={() => setIsFocused(false)}
          InputProps={{
            ...params.InputProps,
            style: { height: 50 },
          }}
        />
      )}
      renderOption={(props, option) => {
        const isChecked =
          option.id === 'all'
            ? selectedStates.length === stateOptions.length
            : selectedStates.some((state) => state.id === option.id);
        return (
          <li {...props} style={{ height: '50px', display: 'flex', alignItems: 'center' }}>
            <Checkbox checked={isChecked} style={{ marginRight: 8 }} />
            <ListItemText primary={option.name} />
          </li>
        );
      }}
      renderTags={() => {
        if (selectedStates.length === stateOptions.length) {
          return <p>All</p>;
        }  else if(selectedStates.length>0) {
          return <p>States: {selectedStates.length}</p>;
        }
      }}
      style={{ height: 50 }}
    />
  );
});

StateFilter.displayName = "StateFilter"; // Set the displayName explicitly

const DepartmentFilter = React.memo(({ departmentList, selectedDepartments, onDepartmentChange, setErrorMsg }) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (selectedDepartments.length == 0 && !isFocused) {
      onDepartmentChange(null, departmentList);
    }
  }, [selectedDepartments,isFocused]);


  const sortedDepartments = [
    ...selectedDepartments,
    ...departmentList.filter(department => !selectedDepartments.some(selected => selected.id === department.id))
  ];

  return (
    <Autocomplete
      id='department-filter'
      multiple
      disableCloseOnSelect
      options={[
        { id: "all", name: "Select All" },
        ...sortedDepartments,
      ]}
      getOptionLabel={(option) => option.name}
      value={selectedDepartments.length === 0 ? [{ id: '-1', name: 'Select' }] : selectedDepartments}
      onChange={(event, value) => {
        const filteredValue = value.filter((option) => option.id !== '-1');
        onDepartmentChange(event, filteredValue);
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          required
          label="Groups"
          onFocus={() => setIsFocused(true)} // Set isFocused to true on focus
          onBlur={() => setIsFocused(false)}
          InputProps={{
            ...params.InputProps,
            style: { height: 50 },
          }}
        />
      )}
      renderOption={(props, option) => {
        const isChecked = option.id === 'all'
          ? selectedDepartments.length === departmentList.length
          : selectedDepartments.some((dep) => dep.id === option.id);
        return (
          <li {...props} style={{ minHeight: "50px", display: "flex", alignItems: "center" }}>
            <Checkbox checked={isChecked} style={{ marginRight: 8 }} />
            <ListItemText primary={option.name} />
          </li>
        );
      }}
      renderTags={() => {
        if (selectedDepartments.length === departmentList.length) {
          return <p>All</p>;
        } else if(selectedDepartments.length > 0) {
          return <p>Groups: {selectedDepartments.length}</p>;
        }
      }}
      style={{ minHeight: 50 }}
    />
  );
});

DepartmentFilter.displayName = "DepartmentFilter"; // Set the displayName explicitly

const UserFilter = React.memo(({ userOptions, selectedUsers, onUserChange, setErrorMsg }) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (selectedUsers.length === 0 && !isFocused) {
      onUserChange(null, userOptions);
    }
  }, [selectedUsers, isFocused]);

  // Reorder the options to place selected users at the top
  const sortedUserOptions = [
    { id: 'all', first_name: 'Select All', last_name: '' }, // 'Select All' option remains on top
    ...[...selectedUsers].sort((a, b) => (a.first_name || "").localeCompare(b.first_name || "")), // Sort selected users
    ...[...userOptions]
      .filter(user => !selectedUsers.some(selected => selected.id === user.id))
      .sort((a, b) => (a.first_name || "").localeCompare(b.first_name || "")) // Sort remaining users
  ];
  

  return (
    <Autocomplete
      id='user-filter'
      disableCloseOnSelect
      multiple
      options={userOptions.length > 0 ? sortedUserOptions : []}
      getOptionLabel={(option) => 
        option.first_name ? `${option.first_name} ${option.last_name || ''}`.trim() : 'N/A'
      }
      value={selectedUsers.length === 0 ? [{ id: '-1', first_name: 'Select', last_name: '' }] : selectedUsers}
      onChange={(event, value) => {
        const filteredValue = value.filter((option) => option.id !== '-1');
        onUserChange(event, filteredValue);
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          required
          {...params}
          variant="outlined"
          label="Users"
          onFocus={() => setIsFocused(true)} // Set isFocused to true on focus
          onBlur={() => setIsFocused(false)}
          InputProps={{
            ...params.InputProps,
            style: { minHeight: 50 },
          }}
        />
      )}
      renderOption={(props, option) => {
        const isChecked =
          option.id === 'all'
            ? selectedUsers.length === userOptions.length
            : selectedUsers.some((user) => user.id === option.id);
        return (
          <li {...props} key={option.id} style={{ minHeight: '50px', display: 'flex', alignItems: 'center' }}>
            <Checkbox checked={isChecked} style={{ marginRight: 8 }} />
            <ListItemText primary={`${option.first_name} ${option.last_name || ''}`.trim()} />
          </li>
        );
      }}      
      renderTags={() => {
        if (selectedUsers.length === userOptions.length) {
          return <p>All</p>;
        } else if (selectedUsers.length > 0) {
          return <p>Users: {selectedUsers.length}</p>;
        }
      }}
      style={{ minHeight: 50 }}
    />
  );
});

UserFilter.displayName = "UserFilter"; // Set the displayName explicitly

const CertificateTypeFilter = React.memo(({
  certificateTypeOptions,
  selectedCertificateTypes,
  onCertificateTypeChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (selectedCertificateTypes.length === 0 && !isFocused) {
      onCertificateTypeChange(null, certificateTypeOptions); // Set initial empty selection
    }
  }, [selectedCertificateTypes,isFocused]);

  // Reorder the options to place selected certificate types at the top
  const sortedCertificateTypeOptions = [
    { id: 'all', name: 'Select All' }, // Then the 'Select All' option
    ...selectedCertificateTypes, // First place the selected certificate types
    ...certificateTypeOptions.filter(type => !selectedCertificateTypes.some(selected => selected.id === type.id)) // Add remaining unselected types
  ];

  return (
    <Autocomplete
      id='certificate-type-filter'
      multiple
      disableCloseOnSelect
      options={sortedCertificateTypeOptions}
      getOptionLabel={(option) => option.name}
      value={
        selectedCertificateTypes.length === 0
          ? [{ id: "-1", name: "Select" }] // Show "Select" when no items are selected
          : selectedCertificateTypes
      }
      onChange={(event, value) => {
        const filteredValue = value.filter((option) => option.id !== "-1"); // Remove "Select" placeholder from selections
        if (filteredValue.some((option) => option.id === "all")) {
          if (selectedCertificateTypes.length === certificateTypeOptions.length) {
            onCertificateTypeChange(event, []); // Clear all
          } else {
            onCertificateTypeChange(event, certificateTypeOptions); // Select all
          }
        } else {
          onCertificateTypeChange(event, filteredValue); // Handle individual selection
        }
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          required
          label="Certificate Types"
          onFocus={() => setIsFocused(true)} // Set isFocused to true on focus
          onBlur={() => setIsFocused(false)}
          InputProps={{
            ...params.InputProps,
            style: { height: 50 },
          }}
        />
      )}
      renderOption={(props, option) => {
        const isChecked =
          option.id === "all"
            ? selectedCertificateTypes.length === certificateTypeOptions.length
            : selectedCertificateTypes.some((type) => type.id === option.id);
        return (
          <li {...props} style={{ height: "50px", display: "flex", alignItems: "center" }}>
            <Checkbox checked={isChecked} style={{ marginRight: 8 }} />
            <ListItemText primary={option.name} />
          </li>
        );
      }}
      renderTags={() => {
        if (selectedCertificateTypes.length === certificateTypeOptions.length) {
          return <p>All</p>;
        } else if(selectedCertificateTypes.length>0){
          return <p>Types: {selectedCertificateTypes.length}</p>;
        }
      }}
      style={{ height: 50 }}
    />
  );
});

const GenerateReportButton = ({ setRegenrateReport, regenerateReport, loading, disable, GenerateReport, errorMsg, currentTab, filtersStatus, filterDetails, byUser }) => {
  const [noAllowed, setNotAllowed]=React.useState(true);
const {user,
  state,
  department,
  certType}=filtersStatus;

  React.useEffect(() => {
    if (errorMsg) {
      if(byUser && !user){
        setNotAllowed(true)
      }
      else if (currentTab == 'clinical-certificate') {
        if(department && certType){
          setNotAllowed(false)
        }else{
          setNotAllowed(true)
        }
      } else if(currentTab != 'clinical-certificate'){
        if(department && state){
          setNotAllowed(false)
        }else{
          setNotAllowed(true)
        }
      }
    }else{
      setNotAllowed(false)
    }
  },[errorMsg,currentTab,user, state, department, certType, byUser])

  const onButtonClick = () => {
    clearSessionStorage();
    GenerateReport();
    setRegenrateReport(false);
    sessionStorage.setItem('filterDetails',JSON.stringify(filterDetails));
  }

  return (
    <Button
    disabled={loading || disable || noAllowed}  // Disable button if loading or disable prop is true
    // disabled={loading || disable || errorMsg!=null}  // Disable button if loading or disable prop is true
      disableElevation
      size="large"
      variant="contained"
      color="primary"
      fullWidth
      onClick={onButtonClick}
      style={{ height: '50px', }} // Use flexbox
    >
          GENERATE REPORT
        {regenerateReport  && (!loading && !disable && !noAllowed) && (
          <RestartAltIcon size={20} color="inherit" />
        )}
    </Button>
  );
};

export default Filters;
