import React from 'react';
import { Typography, Box, List, ListItem, ListItemIcon } from '@mui/material';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import { CardTitle,  DetailBox, GreyBox } from '../components';

const schedulePages = ['My Schedule', 'Group Schedule', 'Availability', 'Swap Request', 'Payment Request', 'Payment History'];

const ScheduleListItem = ({ title }) => (
  <ListItem sx={{ padding: 0, mb: 1.5, display: 'flex', justifyContent: 'space-between' }}>
    <Box display="flex" alignItems="center">
      <ListItemIcon sx={{ minWidth: '24px' }}>
        <CheckBoxRoundedIcon sx={{ color: '#00A700', fontSize: 16 }} />
      </ListItemIcon>
      <Typography style={{ fontSize: 14, fontWeight: 500 }}>{title}</Typography>
    </Box>
  </ListItem>
);

const ScheduleCard = () => (
  <DetailBox>
    <CardTitle
      title="Schedules"
      description="Manage your schedules effortlessly. Send shift swap requests to your colleagues, and set your availability. Easily request payments for your shifts and track your complete payment history — all in one place."
      link="/schedule/my-schedule"
    />
    <GreyBox sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
        <List sx={{ padding: 0, flexGrow: 1 }}>
          {schedulePages.map(item => <ScheduleListItem title={item} key={item} />)}
        </List>
        <img src="/images/dashboard/schedule.svg" alt="Schedule" />
      </Box>
    </GreyBox>
  </DetailBox>
);

export default ScheduleCard;
