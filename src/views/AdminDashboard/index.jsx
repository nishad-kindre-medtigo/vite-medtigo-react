import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { CECME, StateLicense, DEA, StateCSR, ClinicalCertificate, StaticCard } from './cards';
import CECMEBarChartCard from './cards/CECMEBarChart';
import RegulatoryBarChartCard from './cards/RegulatoryBarChart';

const donutCards = [
  { component: CECME, key: 'cecme' },
  { component: StateLicense, key: 'stateLicense' },
  { component: DEA, key: 'dea' },
  { component: StateCSR, key: 'stateCSR' },
  { component: ClinicalCertificate, key: 'clinicalCertificate' },
  { component: StaticCard, key: 'staticCard' },
];

const AdminDashboardPage = () => {
  return (
    <Box>
      <Typography my={2} style={{ fontSize: '28px', fontWeight: 400 }}>
        All Reports Overview with Status Update
      </Typography>
      <Grid container spacing={3} mb={10}>
        {donutCards.map(({ component: Component, key }) => (
          <Grid item xs={12} sm={6} lg={4} key={key}>
            <Component />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Typography style={{ fontSize: '28px', fontWeight: 400 }}>
            Overview of Upcoming Renewal Status for All Reports Over the Next Six Months
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <CECMEBarChartCard />
        </Grid>
        <Grid item xs={12}>
          <RegulatoryBarChartCard />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardPage;
