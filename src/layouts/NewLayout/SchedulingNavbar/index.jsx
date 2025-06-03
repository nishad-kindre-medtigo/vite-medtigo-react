import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PrimaryTabPanel } from '../../../ui/Tabs';

function SchedulingNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showSchedulingPayment } = useSelector(state => state.account.user);
  const [currentTab, setCurrentTab] = useState('my schedule');

  const tabs = showSchedulingPayment ? [
    { value: 'my schedule', label: 'My Schedule', link: '/schedule/my-schedule' },
    { value: 'group schedule', label: 'Group Schedule', link: '/schedule/group-schedule' },
    { value: 'draft schedule', label: 'Draft Schedule', link: '/schedule/draft-schedule' },
    { value: 'availability', label: 'Availability', link: '/schedule/availability' },
    { value: 'swap request', label: 'Swap Request', link: '/schedule/swap-request' },
    { value: 'payment request', label: 'Payment Request', link: '/schedule/payment-request' },
    { value: 'payment history', label: 'Payment History', link: '/schedule/payment-history' }
  ] : [
    { value: 'my schedule', label: 'My Schedule', link: '/schedule/my-schedule' },
    { value: 'group schedule', label: 'Group Schedule', link: '/schedule/group-schedule' },
    { value: 'draft schedule', label: 'Draft Schedule', link: '/schedule/draft-schedule' },
    { value: 'availability', label: 'Availability', link: '/schedule/availability' },
    { value: 'swap request', label: 'Swap Request', link: '/schedule/swap-request' }
  ];

  useEffect(() => {
    const currentTab = tabs.find(tab => tab.link === location.pathname);
    if (location.pathname.includes('payment-request-details')) {
      setCurrentTab('payment history');
    }
    if (currentTab) {
      setCurrentTab(currentTab.value);
    }
  }, [location.pathname]);

  const handleTabsChange = (event, newValue) => {
    setCurrentTab(newValue);
    const newTab = tabs.find(tab => tab.value === newValue);
    if (newTab) {
      navigate(newTab.link);
    }
  };

  return (
    <PrimaryTabPanel
      tabs={tabs}
      currentTab={currentTab}
      handleTabsChange={handleTabsChange}
    />
  );
}

export default SchedulingNavBar;
