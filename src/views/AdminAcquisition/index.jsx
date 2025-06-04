import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FilterPane from 'src/components/Reports/FilterPanel';
import StateLicense from './StateLicense';
import { PrimaryTabPanel } from 'src/ui/Tabs';

const AdminView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState('/state-license');
  const lRef = useRef(null);

  const GenerateReport = () => {
    if (lRef.current) {
      lRef.current.callFunction();
    }
  };

  const handleTabsChange = (event, newValue) => {
    setCurrentTab(newValue);
    navigate(`/admin/acquisition/${newValue}`); // Update the URL path
  };

  const navConfig = [
    { value: 'state-license', label: 'State License', component: <StateLicense ref={lRef}/> }
  ];
  const currentComponent = navConfig.find((tab) => tab.value === currentTab)?.component;

  useEffect(() => {
    const currentPath = location.pathname.split('/').pop();
    if (currentPath !== currentTab) {
      setCurrentTab(currentPath);
    }
  }, [location.pathname]);

  return (
    <>
      <PrimaryTabPanel
        tabs={navConfig}
        currentTab={currentTab}
        handleTabsChange={handleTabsChange}
      />
      <FilterPane GenerateReport={GenerateReport} />
      <div>{currentComponent}</div>
    </>
  );
};

export default AdminView;
