import React from 'react';
import StateLicenseCard from './StateLicenseCard';
import { Grid } from '@mui/material';
import { useCertificatesContext } from '../../../../context/CertificatesContext';
import { CertificateSkeletonList } from '../../components/SkeletonLoaders';
import { PlaceHolder, PageTitle } from '../../../MonitoringRenewal/ui';

const StateLicense = () => {
  const { highlightedCertID, isLoading, grantedLicenses, setRecipientEmails, setSendACopy } = useCertificatesContext();
  const urlParams = new URLSearchParams(window.location.search);
  const completedCert = urlParams.get('completed');

  return (
    <>
      <PageTitle title="State License Tracker" />
      {isLoading ? (
        <CertificateSkeletonList isCME={true} />
      ) : (
        <>
          {grantedLicenses.length === 0 && (
            <PlaceHolder text="No License with Granted Active Status Available" />
          )}
          <Grid container spacing={3}>
            {grantedLicenses &&
              grantedLicenses.map((certificate) => {
                return (
                  <Grid size={{ xs: 12, md: 4 }} key={certificate['id']}>
                    <StateLicenseCard
                      data={certificate}
                      completed={completedCert || highlightedCertID}
                      setRecipientEmails={setRecipientEmails}
                      setSendACopy={setSendACopy}
                    />
                  </Grid>
                );
              })}
          </Grid>
        </>
      )}
    </>
  );
};

export default StateLicense;
