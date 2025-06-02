import React from 'react';
import CMEFeature from '../../../StateCompliance';
import { PageContainer } from '../../../../components/CMECompliance';
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
