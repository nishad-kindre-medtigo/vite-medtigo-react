import React from 'react';
import { Grid } from '@mui/material';
import UpdatesCard from '../components/UpdatesCard';
import { PageBackText, TaskSkeleton } from '../ui';
import { PlaceHolder } from '../../../../views/MonitoringRenewal/ui';
import { useLicenceContext } from '../../../../context/LicenseContext';

const UpdatesPage = props => {
  const { licenseLoading, notesData } = useLicenceContext();
  const { goBack } = props;

  const noUpdatesAvailable = notesData.length === 0;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <PageBackText goBack={goBack} text="Updates" />
      </Grid>
      {licenseLoading ? (
        [...Array(3)].map((_, index) => (
          <Grid item xs={12} sm={6} lg={4} key={index}>
            <TaskSkeleton />
          </Grid>
        ))
      ) : (
        <>
          {noUpdatesAvailable ? (
            <Grid item xs={12}>
              <PlaceHolder text="No Updates Available" />
            </Grid>
          ) : (
            <>
              {notesData.length > 0
                ? notesData.map((update, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={index}>
                      <UpdatesCard type="Updates" data={update} {...props} />
                    </Grid>
                  ))
                : null}
              <Grid item xs={12}></Grid>
            </>
          )}
        </>
      )}
    </Grid>
  );
};

export default UpdatesPage;
