import React, { useEffect } from 'react';
import { Grid } from '@mui/material';
import LicenseTaskCard from '../components/LicenseTaskCard';
import { TaskSkeleton, PageBackText } from '../ui';
import { PlaceHolder } from '../../../../views/MonitoringRenewal/ui';

const SingleLicenseTasksPage = props => {
  const { goBack, overdueTasks, pendingTasks, licenseName, taskLoading } = props;

  const noTasksAvailable = overdueTasks.length === 0 && pendingTasks.length === 0;

  // Scroll to top by default
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <PageBackText goBack={goBack} text={`Tasks Related For ${licenseName}`} />
      </Grid>
      {taskLoading ? (
        [...Array(3)].map((_, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
            <TaskSkeleton showLicenseName={false} />
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
              {overdueTasks.length > 0
                ? overdueTasks.map((task, index) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                      <LicenseTaskCard showLicenseName={false} type="Overdue" data={task} {...props} />
                    </Grid>
                  ))
                : null}
              {pendingTasks.length > 0
                ? pendingTasks.map((task, index) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                      <LicenseTaskCard showLicenseName={false} type="Timely" data={task} {...props} />
                    </Grid>
                  ))
                : null}
            </>
          )}
        </>
      )}
    </Grid>
  );
};

export default SingleLicenseTasksPage;
