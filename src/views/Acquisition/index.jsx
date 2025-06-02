import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Page from '../../components/Page';
import { PrimaryTabPanel } from '../../ui/Tabs';
import StateLicensePage from './StateLicense';
import { LicensingProcessPage } from './StateLicense/pages';
import MyLearningPage from './MyLearning';

const AcquisitionSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState('');
  const [hideTabPanel, setHideTabPanel] = useState(false);
  const { user } = useSelector(state => state.account);

  const handleTabsChange = (event, newValue) => {
    if (newValue !== currentTab) {
      setCurrentTab(newValue);
      navigate(`/${newValue}`);
    }
  };

  const LicenseComponent = user.neverhadStateLicense ? <LicensingProcessPage /> : <StateLicensePage setHideTabPanel={setHideTabPanel} />

  const navConfig = [
    { value: 'state-licensing', label: 'State License', component: LicenseComponent },
    { value: 'my-learning', label: 'My Learning', component: <MyLearningPage /> },
  ];
  const currentComponent = navConfig.find(tab => tab.value === currentTab)?.component;

  useEffect(() => {
    const currentPath = location.pathname.split('/').pop();
    if (currentPath !== currentTab) setCurrentTab(currentPath);
  }, [location.pathname]);

  return (
    <Page title="Acquisition">
      {!hideTabPanel && (
        <PrimaryTabPanel
          tabs={navConfig}
          currentTab={currentTab}
          handleTabsChange={handleTabsChange}
        />
      )}
      <div style={{ minHeight: '60vh', width: '100%', marginBottom: '24px' }}>{currentComponent}</div>
    </Page>
  );
};

export default AcquisitionSection;
