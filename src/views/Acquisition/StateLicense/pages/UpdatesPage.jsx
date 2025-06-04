import React from 'react';
import { Grid } from '@mui/material';
import UpdatesCard from '../components/UpdatesCard';
import { PageBackText, TaskSkeleton } from '../ui';
import { PlaceHolder } from 'src/views/MonitoringRenewal/ui';
import { useLicenceContext } from 'src/context/LicenseContext';

const UpdatesPage = props => {
  const { licenseLoading, notesData } = useLicenceContext();
  const { goBack } = props;

  const noUpdatesAvailable = notesData.length === 0;

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <PageBackText goBack={goBack} text="Updates" />
      </Grid>
      {licenseLoading ? (
        [...Array(3)].map((_, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
            <TaskSkeleton />
          </Grid>
        ))
      ) : (
        <>
          {noUpdatesAvailable ? (
            <Grid size={12}>
              <PlaceHolder text="No Updates Available" />
            </Grid>
          ) : (
            <>
              {notesData.length > 0
                ? notesData.map((update, index) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                      <UpdatesCard type="Updates" data={update} {...props} />
                    </Grid>
                  ))
                : null}
              <Grid size={12}></Grid>
            </>
          )}
        </>
      )}
    </Grid>
  );
};

export default UpdatesPage;
