import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid } from '@mui/material';
import { CardTitle,  DetailBox, GreyBox, TitleDescription } from '../components';

const JobInfoBox = ({ type, count, color, image }) => (
  <Box
    p={1}
    style={{
      width: '100%',
      background: color,
      border: '0.5px solid #D0D0D0',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}
  >
    <img src={image} alt={`${type} Icon`} height={30} width={30} />
    <Box style={{ fontSize: '14px', fontWeight: 400 }}>
      {type} : <span style={{ fontWeight: 700 }}>{count}</span>
    </Box>
  </Box>
);

const CareerCard = ({ savedJobsCount, appliedJobsCount }) => (
  <DetailBox>
    <CardTitle
      title="Career"
      description="In the Career section, you will find valuable resources to advance your professional journey."
      link="/career/job-board"
    />
    <GreyBox sx={{ flexGrow: 1 }}>
      <TitleDescription
        sx={{ mb: 2 }}
        title="Job Board"
        description="Explore various job opportunities tailored to healthcare providers, helping you find your next career move."
      />
      <TitleDescription
        sx={{ mb: 4 }}
        title="Locums"
        description="This tab connects you with locum tenens opportunities, helping  you to find temporary positions that match your schedule and expertise."
      />
      <Grid container spacing={2}>
        <Grid size={6}>
          <JobInfoBox
            type="Saved Job"
            count={savedJobsCount}
            image="/images/dashboard/savedJobs.svg"
            color="#E8F3FF"
          />
        </Grid>
        <Grid size={6}>
          <JobInfoBox
            type="Applied Job"
            count={appliedJobsCount}
            image="/images/dashboard/appliedJobs.svg"
            color="#FFF8E8"
          />
        </Grid>
      </Grid>
    </GreyBox>
  </DetailBox>
);

CareerCard.propTypes = {
  savedJobsCount: PropTypes.number.isRequired,
  appliedJobsCount: PropTypes.number.isRequired
};

export default CareerCard;
