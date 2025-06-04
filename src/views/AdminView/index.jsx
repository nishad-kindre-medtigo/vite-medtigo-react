import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TeamCompliancePage from './TeamCompliance';
import FilterPanel from 'src/components/Reports/FilterPanel';
import { PrimaryTabPanel } from 'src/ui/Tabs';
import { clearSessionStorage } from './utils';
import LicenseReports from './LicenseReports';
import ClinicalCertificate from './ClinicalCertificate';
import DEA from './DEA';
import StateCSR from './StateCSR';

const AdminView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState('/ce_cme');
  const cRef = useRef(null);
  const lRef = useRef(null);
  const pRef = useRef(null);
  const dRef = useRef(null);
  const sRef = useRef(null);

  const GenerateReport = () => {
    if (cRef.current) cRef.current.callFunction();
    else if (lRef.current) lRef.current.callFunction();
    else if (pRef.current) pRef.current.callFunction();
    else if (dRef.current) dRef.current.callFunction();
    else if (sRef.current) sRef.current.callFunction();
  };

  const handleTabsChange = (event, newValue) => {
    clearSessionStorage();
    setCurrentTab(newValue);
    navigate(`/admin/reports/${newValue}`);
  };

  const navConfig = [
    { value: 'ce_cme', label: 'CE/CME', component: <TeamCompliancePage ref={cRef} /> },
    { value: 'license', label: 'State License', component: <LicenseReports ref={lRef} /> },
    { value: 'dea', label: 'DEA', component: <DEA ref={dRef} /> },
    { value: 'state-csr-csc', label: 'STATE CSR/CSC', component: <StateCSR ref={sRef} /> },
    { value: 'clinical-certificate', label: 'Clinical Certificate', component: <ClinicalCertificate ref={pRef} /> },
  ];
  const currentComponent = navConfig.find((tab) => tab.value === currentTab)?.component;

  useEffect(() => {
    const currentPath = location.pathname.split('/').pop();
    if (currentPath !== currentTab) setCurrentTab(currentPath);
  }, [location.pathname]);

  return (
    <>
      <PrimaryTabPanel
        tabs={navConfig}
        currentTab={currentTab}
        handleTabsChange={handleTabsChange}
      />
      <FilterPanel currentTab={currentTab} GenerateReport={GenerateReport} />
      <div>{currentComponent}</div>
    </>
  );
};

export default AdminView;
