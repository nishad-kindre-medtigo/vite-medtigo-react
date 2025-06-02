import React from 'react';
import  { CECMETracker, StateLicenseTracker, DEATracker, StateCSRTracker, ClinicalCertificateTracker } from './Tracker';
import { CECMEReport, StateLicenseReport, DEAReport, StateCSRReport, ClinicalCertificateReport } from './Reports';

export const NAV_CONFIG = [
  {
    value: 'ce-cme',
    label: 'CE/CME',
    trackerComponent: <CECMETracker />,
    reportComponent: <CECMEReport />
  },
  {
    value: 'state-license',
    label: 'STATE LICENSE',
    trackerComponent: <StateLicenseTracker />,
    reportComponent: <StateLicenseReport />
  },
  {
    value: 'dea',
    label: 'DEA',
    trackerComponent: <DEATracker />,
    reportComponent: <DEAReport />
  },
  {
    value: 'state-csr-csc',
    label: 'STATE CSR/CSC',
    trackerComponent: <StateCSRTracker />,
    reportComponent: <StateCSRReport />
  },
  {
    value: 'clinical-certificate',
    label: 'CLINICAL CERTIFICATE',
    trackerComponent: <ClinicalCertificateTracker />,
    reportComponent: <ClinicalCertificateReport />
  }
];
