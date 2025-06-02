import React from 'react';
import DEACard from './DEACard';
import { Grid } from '@mui/material';
import { useCertificatesContext } from '../../../../context/CertificatesContext';
import { PlaceHolder, PageTitle } from '../../../MonitoringRenewal/ui';
import { CertificateSkeletonList } from '../../components/SkeletonLoaders';

const DEA = () => {
  const { isLoading, deaCertificates, highlightedCertID } = useCertificatesContext();

  return (
    <>
      <PageTitle title="DEA Tracker" />
      {isLoading ? (
        <CertificateSkeletonList />
      ) : (
        <>
          {deaCertificates.length === 0 && (
            <PlaceHolder text="No DEA Certificates Available" />
          )}
          <Grid container spacing={3}>
            {deaCertificates &&
              deaCertificates.map((certificate) => {
                return (
                  <Grid item xs={12} sm={6} md={4} key={certificate['id']}>
                    <DEACard
                      page='DEA'
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

export default DEA;
