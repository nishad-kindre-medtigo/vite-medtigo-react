import React from 'react';
import { Autocomplete, TextField, Grid } from '@mui/material';
import LicenseTaskCard from '../components/LicenseTaskCard';
import { PlaceHolder } from '../../../../views/MonitoringRenewal/ui';
import { CountBox, TaskSkeleton, PageBackText } from '../ui';

const AllLicenseTasksPage = props => {
  const { goBack, overdueTasks, pendingTasks, overdueCount, timelyCount, searchText, setSearchText, taskSearchOptions, taskLoading, taskCategory, setTaskCategory } = props;

  const noTasksAvailable = overdueTasks.length === 0 && pendingTasks.length === 0;

  const toggleCategory = type => {
    if (taskCategory === 'all') {
      setTaskCategory(type);
    } else if (taskCategory === type) {
      setTaskCategory('all');
    } else {
      setTaskCategory(type);
    }
  };

  const SearchByLicenseFilter = () => {
    return (
      <Autocomplete
        value={searchText || null}
        fullWidth
        clearOnEscape
        onChange={(event, newValue) => {
          setSearchText(newValue || '');
          if (taskCategory !== 'all') {
            setTaskCategory('all');
          }
        }}
        onInputChange={(event, newInputValue) => {
          if (newInputValue === '') {
            setTaskCategory('all'); // Trigger when clear icon is clicked
          }
        }}
        options={taskSearchOptions || []}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search By License"
            variant="outlined"
            size="small"
          />
        )}
        getOptionLabel={(option) => option || ''}
        isOptionEqualToValue={(option, value) => option === value}
        noOptionsText="No options available"
      />
    );
  };

  // RESET ALL FILTERS WHEN GOING BACK TO TRACKER PAGE
  const goBackToTracker = () => {
    setTaskCategory('all');
    setSearchText('');
    goBack();
  }

  return (
    <Grid container spacing={3} alignItems="center">
      <Grid size={{ xs: 12, sm: 12, lg: 4 }}>
        <PageBackText goBack={goBackToTracker} text="State License All Tasks" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <SearchByLicenseFilter />
      </Grid>
      <Grid size={{ xs: 12, sm: 3, lg: 2.5 }}>
        <CountBox
          type="Overdue"
          count={overdueCount}
          isActive={taskCategory === 'overdue'}
          onClick={() => toggleCategory('overdue')}
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 3, lg: 2.5 }}>
        <CountBox
          type="Timely"
          count={timelyCount}
          isActive={taskCategory === 'timely'}
          onClick={() => toggleCategory('timely')}
        />
      </Grid>
      {taskLoading ? (
        [...Array(3)].map((_, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
            <TaskSkeleton />
          </Grid>
        ))
      ) : (
        <>
          {noTasksAvailable ? (
            <Grid size={12}>
              <PlaceHolder text="No Tasks Available" />
            </Grid>
          ) : (
            <>
              {(taskCategory === 'all' || taskCategory === 'overdue') && overdueTasks.length > 0
                ? overdueTasks.map((task, index) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                      <LicenseTaskCard type="Overdue" data={task} {...props} />
                    </Grid>
                  ))
                :  (taskCategory === 'overdue' && pendingTasks.length === 0) ? (
                  <Grid size={12}>
                    <PlaceHolder text="No Tasks Available" />
                  </Grid>
                ) : null}
              {(taskCategory === 'all' || taskCategory === 'timely') && pendingTasks.length > 0
                ? pendingTasks.map((task, index) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                      <LicenseTaskCard type="Timely" data={task} {...props} />
                    </Grid>
                  ))
                : (taskCategory === 'timely' && pendingTasks.length === 0) ? (
                  <Grid size={12}>
                    <PlaceHolder text="No Tasks Available" />
                  </Grid>
                ) : null}
            </>
          )}
        </>
      )}
    </Grid>
  );
};

export default AllLicenseTasksPage;
