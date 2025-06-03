import React from 'react';
import CertificateCard from '../DEA/DEACard';
import { Grid } from '@mui/material';
import { useCertificatesContext } from 'src/context/CertificatesContext';
import { PlaceHolder, PageTitle } from '../../../MonitoringRenewal/ui';
import { CertificateSkeletonList } from '../../components/SkeletonLoaders';

const StateCSR = () => {
  const { isLoading, stateCSRCertificates, highlightedCertID } = useCertificatesContext();

  return (
    <>
      <PageTitle title="State CSR/CSC Tracker" />
      {isLoading ? (
        <CertificateSkeletonList isCME={true} />
      ) : (
        <>
          {stateCSRCertificates.length === 0 && (
            <PlaceHolder text="No State CSR/CSC Certificates Available" />
          )}
          <Grid container spacing={3}>
            {stateCSRCertificates &&
              stateCSRCertificates.map((certificate) => {
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={certificate['id']}>
                    <CertificateCard
                      page='STATE CSR/CSC'
                      data={certificate}
                      highlightedCertID={highlightedCertID}
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

export default StateCSR;
