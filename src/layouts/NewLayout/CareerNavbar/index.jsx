import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PrimaryTabPanel } from 'src/ui/Tabs';

function CareerNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('job board');

  const tabs = [
    { value: 'job board', label: 'Job Board', link: '/career/job-board' },
    { value: 'locums', label: 'Locums', link: '/career/locums' },
    { value: 'contact', label: 'Contact', link: '/career/contact' }
  ];

  useEffect(() => {
    const currentTab = tabs.find(tab => tab.link === location.pathname);
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

export default CareerNavbar;
