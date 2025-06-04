import React from 'react';
import CMEFeature from 'src/views/StateCompliance';
import { PageContainer } from 'src/components/CMECompliance';
import { ReportBackLink } from '../../ui';

const CECMEReport = () => {
  return (
    <PageContainer sx={{ pt: 0 }}>
      <ReportBackLink title="CE/CME Report" tab="ce-cme" />
      <CMEFeature />
    </PageContainer>
  );
};

export default CECMEReport;
