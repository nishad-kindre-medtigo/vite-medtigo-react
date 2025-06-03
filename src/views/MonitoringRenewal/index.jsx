import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/AddBoxRounded';
import ReportIcon from '@mui/icons-material/TableChart';
import { StyledLink } from '../Acquisition/StateLicense/ui';
import { useNavigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CertificateDrawer from './CertificateDrawer';
import { useCertificatesContext } from '../../context/CertificatesContext';
import Page from '../../components/Page';
import SendMailDialog from './dialogs/SendMailDialog';
import { PrimaryTabPanel, RightSection } from '../../ui/Tabs';
import useBreakpoints from 'src/hooks/useBreakpoints';
import { NAV_CONFIG } from './constants';

const MonitoringAndRenewalSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState('ce-cme');
  const { isMobile } = useBreakpoints();
  const { type } = useParams();

  const isGenerateReport = location.pathname.includes('/report');
  const certificateType = currentTab === "ce-cme" ? "CME Certificate" : currentTab === "clinical-certificate" ? "Certificate" : "License";

  const { setDrawerStatus, hideTabPanel, setHideTabPanel } = useCertificatesContext();

  const handleTabsChange = (event, newValue) => {
    if (newValue !== currentTab) {
      setCurrentTab(newValue);
      navigate(`/monitoring-renewal/${newValue}`);
    }
  };

  // DISPLAY REPORT PAGE
  const goToReport = () => {
    navigate(`/monitoring-renewal/${currentTab}/report`);
  };

  const navTab = NAV_CONFIG.find(tab => tab.value === currentTab);
  const currentComponent = isGenerateReport ? navTab.reportComponent : navTab.trackerComponent;

  useEffect(() => {
    const currentPath = type;
    if (currentPath !== currentTab) setCurrentTab(currentPath);
  }, [type]);

  useEffect(() => {
    if (isGenerateReport) {
      setHideTabPanel(true);
    } else {
      setHideTabPanel(false);
    }
  }, [location]);

  const NavBar = () => {
    const TabRightSection = () => {
      return isMobile ? (
        <RightSection>
          <Typography sx={{ fontSize: '18px', fontWeight: 600, mr: 'auto' }}>Tracker</Typography>
          <Button onClick={goToReport} startIcon={<ReportIcon />}>
            REPORT
          </Button>
          <Button variant='contained' onClick={() => setDrawerStatus(true)} startIcon={<AddIcon />}>
            CERTIFICATE
          </Button>
        </RightSection>
      ) : (
        <RightSection>
          <StyledLink style={{ fontSize: '18px' }} onClick={goToReport}>GENERATE REPORT</StyledLink>
          <Button
            variant="contained"
            onClick={() => setDrawerStatus(true)}
            startIcon={<AddRoundedIcon />}
          >
            ADD CERTIFICATE
          </Button>
        </RightSection>
      );
    };

    return (
      <PrimaryTabPanel
        tabs={NAV_CONFIG}
        currentTab={currentTab}
        handleTabsChange={handleTabsChange}
        rightSection={<TabRightSection />}
      />
    );
  };

  return (
    <Page title="Monitoring & Renewal">
      {!hideTabPanel && <NavBar />}
      <div style={{ minHeight: '60vh', marginBottom: '24px' }}>
        {currentComponent}
      </div>
      <SendMailDialog />
      <CertificateDrawer type={certificateType} page={navTab.label} />
    </Page>
  );
};

export default MonitoringAndRenewalSection;
