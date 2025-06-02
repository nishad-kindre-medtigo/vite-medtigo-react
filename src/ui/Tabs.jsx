import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

export const CustomToolbar = ({ children, sx }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        mb: 1,
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

export const StyledTabs = ({ children, ...props }) => {
  return (
    <Tabs
      sx={{
        '& .MuiTabs-indicator': {
          backgroundColor: '#2872C1',
          height: '3px',
          bottom: 0
        }
      }}
      {...props}
    >
      {children}
    </Tabs>
  );
};

export const StyledTab = ({ children, ...props }) => {
  return (
    <Tab
      sx={{
        color: '#3a3a3a',
        textDecoration: 'none',
        fontSize: { xs: '14px', sm: '18px' },
        lineHeight: '24px',
        minWidth: 'auto',
        width: 'auto',
        paddingInline: '0px !important',
        marginRight: '28px !important',
        '&.Mui-selected': {
          color: '#2872C1',
          fontWeight: 600
        }
      }}
      {...props}
    >
      {children}
    </Tab>
  );
};

export const RightSection = ({ children, ...props }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        justifyContent: { xs: 'flex-end', sm: 'space-between'},
        width: { xs: '100%', sm: '100%', md: 'auto' }
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export const PrimaryTabPanel = ({
  tabs = [],
  currentTab = null,
  handleTabsChange = () => {},
  rightSection = <></>
}) => {
  return (
    <CustomToolbar>
      <StyledTabs
        value={currentTab}
        onChange={handleTabsChange}
        textColor="secondary"
        variant="scrollable"
        scrollButtons={false}
      >
        {tabs.map(tab => (
          <StyledTab
            key={tab.value}
            value={tab.value}
            label={tab.label}
            disableRipple
          />
        ))}
      </StyledTabs>
      {rightSection}
    </CustomToolbar>
  );
};
