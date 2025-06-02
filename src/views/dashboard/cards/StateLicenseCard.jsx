import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { CardTitle, ClickText, DetailBox, DonutChart, GreyBox } from '../components';

const CountBoxItem = ({ title, count, sx }) => {
  return (
    <Box sx={{ ...sx }} display="flex" justifyContent="space-between">
      <Typography style={{ fontSize: '14px', fontWeight: 500 }}>
        {title}
      </Typography>
      <Typography style={{ fontSize: '14px', fontWeight: 500 }}>
        {count}
      </Typography>
    </Box>
  );
};

const StateLicenseCard = ({ overdueTaskCount, timelyTaskCount, completedTaskCount, acquisitionLicensesCount, monitoringLicensesCount }) => {
  
  return (
    <DetailBox>
      <CardTitle
        title="State License"
        description="Here, you can track your license acquisition progress, monitor your current licenses, and manage renewals and support."
      />
      {/* Chart and Legend */}
      <GreyBox sx={{ mb: 2 }}>
        <DonutChart
          dataOne={completedTaskCount} 
          dataTwo={overdueTaskCount} 
          dataThree={timelyTaskCount}
          labelOne="Completed Task"
          labelTwo="Overdue Task"
          labelThree="Timely Task"
        />
      </GreyBox>
      {/* Additional Information */}
      <GreyBox>
        <CountBoxItem
          title="In Process of Acquisition"
          count={acquisitionLicensesCount}
          sx={{ mb: 1.5 }}
        />
        <CountBoxItem
          title="Currently Under Monitoring"
          count={monitoringLicensesCount}
        />
      </GreyBox>
      <ClickText link="/state-licensing" />
    </DetailBox>
  );
};

StateLicenseCard.propTypes = {
  overdueTaskCount: PropTypes.number.isRequired,
  timelyTaskCount: PropTypes.number.isRequired,
  completedTaskCount: PropTypes.number.isRequired,
  acquisitionLicensesCount: PropTypes.number.isRequired,
  monitoringLicensesCount: PropTypes.number.isRequired
};

export default StateLicenseCard;
