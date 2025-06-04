import React, { useEffect, useState, useContext } from 'react';
import { Box, Tabs, Tab, FormControlLabel } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useBreakpoints from 'src/hooks/useBreakpoints';
import { StaffingContext } from 'src/context/StaffingContext';
import { IOSSwitch } from 'src/views/AdminView/TeamCompliance/components';
import { clearSessionStorage } from 'src/views/AdminView/utils';
import { CustomToolbar, RightSection } from 'src/ui/Tabs';

const StyledTab = ({ children, ...props }) => {
  return (
    <Tab
      sx={{
        color: '#5f5f5f',
        textDecoration: 'none',
        fontSize: { xs: '14px', sm: '18px' },
        fontWeight: 600,
        lineHeight: '24px',
        minWidth: 'auto',
        width: 'auto',
        paddingInline: '0px !important',
        marginRight: '16px !important',
        position: 'relative',
        '&:not(:first-of-type)': {
          paddingLeft: '16px !important',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '25%',
            bottom: '25%',
            width: '1px',
            backgroundColor: '#5f5f5f',
          },
        },
        '&.Mui-selected': {
          color: '#000',
        },
      }}
      {...props}
    >
      {children}
    </Tab>
  );
};

function ServicesBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isTablet } = useBreakpoints();
  const [currentBottomTab, setCurrentBottomTab] = useState('dashboard');
  const { scheduling, country } = useSelector((state) => state.account.user);
  const { user } = useSelector((state) => state.account);
  const { showAdminView, toggleAdminView } = useContext(StaffingContext);

  const baseNavConfig = [
    { value: 'dashboard', label: 'Dashboard', link: '/dashboard', navLink: '/dashboard' },
    { value: 'acquisition', label: 'Acquisition', link: '/state-licensing', navLink: '/state-licensing' },
    { value: 'monitoring & renewal', label: 'Monitoring & Renewal', link: '/monitoring-renewal/ce-cme', navLink: '/monitoring-renewal' },
    { value: 'tools & resources', label: 'Tools & Resources', link: '/tools/vault', navLink: '/tools' },
  ];
  
  const schedulingNavConfig = scheduling
    ? [{ value: 'schedule', label: 'Schedule', link: '/schedule/my-schedule', navLink: '/schedule' }]
    : [];

  const careerNavConfig = country === 'United States'
    ? [{ value: 'career', label: 'Career', link: '/career/job-board', navLink: '/career' }]
    : [];

  let navConfig = [...baseNavConfig, ...schedulingNavConfig, ...careerNavConfig];
  
  if (location.pathname.includes('/admin')) {
    navConfig = [
      { value: 'dashboard', label: 'Dashboard', link: '/admin/dashboard', navLink: '/admin/dashboard' },
      { value: 'acquisition', label: 'Acquisition', link: '/admin/acquisition/state-license', navLink: '/admin/acquisition' },
      { value: 'reports', label: 'Monitoring & Renewal', link: '/admin/reports/ce_cme', navLink: '/admin/reports' },
    ];
  }

  useEffect(() => {
    const currentTab = navConfig.find((tab) => location.pathname.includes(tab.navLink));
    if(location.pathname.includes('/addsignature')){
      setCurrentBottomTab('tools & resources');
    }
    if(location.pathname.includes('/e-sign/history')){
      setCurrentBottomTab('tools & resources');
    }
    if(location.pathname.includes('/signed')){
      setCurrentBottomTab('tools & resources');
    }
    if(location.pathname.includes('/my-learning')){
      setCurrentBottomTab('acquisition');
    }
    if (currentTab && currentTab.value !== currentBottomTab) {
      setCurrentBottomTab(currentTab.value);
    }
    if(currentTab && !currentTab.value.includes('monitoring & renewal')){
      sessionStorage.removeItem('my_comp_selected_states')
      sessionStorage.removeItem('my_comp_payload')
      localStorage.removeItem('my_comp_my_state')
    }
  }, [navConfig]);

  const handleBottomTabChange = (event, newValue) => {
    const newTab = navConfig.find((tab) => tab.value === newValue);
    if (newTab) {
      if (location.pathname.includes('/admin')) {
        clearSessionStorage();
      }
      navigate(newTab.link);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 1440,
        margin: '0 auto',
        width: '100%',
        px: { xs: 2, md: 4, lg: 5 },
      }}
    >
      <CustomToolbar sx={{ borderBottom: '1px solid #ccc', pb: 0.5 }}>
        <Tabs
          value={currentBottomTab}
          onChange={handleBottomTabChange}
          variant="scrollable"
          scrollButtons={false}
          sx={{
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          {navConfig.map((tab) => (
            <StyledTab key={tab.value} value={tab.value} label={tab.label} disableRipple />
          ))}
        </Tabs>
        {!isTablet && (user.role === 'admin' || user.role === 'hospital_admin' || user.role === 'department_admin') && (
          <RightSection>
            <FormControlLabel
              control={
                <IOSSwitch checked={showAdminView} onChange={toggleAdminView} />
              }
              label="Admin View"
            />
          </RightSection>
        )}
      </CustomToolbar>
    </Box>
  );
}

export default ServicesBar;
