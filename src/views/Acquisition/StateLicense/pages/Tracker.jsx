import React, { useState } from 'react';
import { Box, Grid, Button, Typography, Menu } from '@mui/material';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import LicenseStepperCardContainer from '../components/StepperCards';
import useBreakpoints from '../../../../hooks/useBreakpoints';
import { PageLink } from '../ui';
import { CONNECT_URL } from '../../../../settings';

const TrackerPage = props => {
  const { fetchUserTasks, setShowAllTasks, setShowSupport, setShowUpdates, handleOpenFeedback, handleOpenMailPreference } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const { isMobile } = useBreakpoints();

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleShowAllTasks = () => {
    fetchUserTasks();
    setShowAllTasks(true);
  };

  const handleOpenClerkChat = () => {
    window.open(`${CONNECT_URL}/clerk-chat-consent`, '_blank');
  };

  return (
    <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
      <Grid item sm={12} md={6}>
        <Typography sx={{ fontSize: { xs: '18px', sm: '20px' }, fontWeight: 600 }}>
          Acquisition Stages Tracker and Related Tasks
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'space-between', sm: 'flex-end' },
          flexWrap: 'wrap',
          gap: { xs: 0, sm: 2 },
        }}
      >
        <Box
          onClick={handleOpenMenu}
          sx={{ fontSize: { xs: '14px', sm: '18px' }, fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          HELP & RESOURCES
          <ArrowDropDownRoundedIcon fontSize='large' />
        </Box>
        <Button size={isMobile ? 'small' : 'medium'} variant="contained" onClick={handleShowAllTasks}>
          SHOW ALL TASKS
        </Button>
      </Grid>
      <LicenseStepperCardContainer {...props} />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <PageLink
          title="Updates"
          image="/icons/licensing/updates.svg"
          onClick={() => {
            setShowUpdates(true);
            handleCloseMenu();
          }}
        />
        <PageLink
          image="/icons/licensing/support.svg"
          title="Support"
          onClick={() => {
            setShowSupport(true);
            handleCloseMenu();
          }}
        />
        <PageLink
          image="/icons/licensing/clerk_chat.svg"
          title="Clerk Chat"
          onClick={() => {
            handleOpenClerkChat();
            handleCloseMenu();
          }}
        />
        <PageLink
          image="/icons/licensing/feedback.svg"
          title="Feedback"
          onClick={() => {
            handleOpenFeedback();
            handleCloseMenu();
          }}
        />
        <PageLink
          image="/icons/licensing/MailPreference.svg"
          title="Mail Preference"
          onClick={() => {
            handleOpenMailPreference();
            handleCloseMenu();
          }}
        />
      </Menu>
    </Grid>
  );
};

export default TrackerPage;
