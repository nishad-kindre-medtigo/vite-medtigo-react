import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import myLearningService from 'src/services/myLearningService';
import { useCertificatesContext } from 'src/context/CertificatesContext';
import ExplorePlansDialog from '../../../Acquisition/MyLearning/dialogs/ExplorePlansDialog';
import RetakeCourseDialog from '../../../Acquisition/MyLearning/dialogs/RetakeCourseDialog';
import CertificateCard from './CertificateCard';
import { PlaceHolder, PageTitle } from '../../../MonitoringRenewal/ui';
import { CertificateSkeletonList } from '../../components/SkeletonLoaders';
import {useSelector} from 'react-redux';

const ClinicalCertificate = () => {
  const {id: userID} = useSelector((state) => state.account.user);
  const { highlightedCertID, isLoading, generatedCertificates, addedCertificates, oldCertificates } = useCertificatesContext();
  const [selectedCourseID, setSelectedCourseID] = useState(null);
  const [isOrderTypeFullAccess, setIsOrderTypeFullAccess] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [myLearningData, setMyLearningData] = useState({});
  const urlParams = new URLSearchParams(window.location.search);
  const completedCert = urlParams.get('completed');
  const combinedCertificates = [...generatedCertificates, ...addedCertificates, ...oldCertificates];
  const nonRenewCertificates = [ ...oldCertificates, ...addedCertificates];

  const fetchMyLearningData = async () => {
    try {
      const myLearningData = await myLearningService.getMyLearningData(userID);
      setMyLearningData(myLearningData.data);
    } catch (error) {
      console.error("Error fetching My Learning Data: ", error);
      setMyLearningData({});
    }
  }

  // Run useEffect on page load & change in refresh state value( for teamhealth user renew flow)
  useEffect(() => {
    if(generatedCertificates.length > 0){
      fetchMyLearningData();
    }
  }, [refresh, generatedCertificates]);

  return (
    <>
      <PageTitle title="Clinical Certificate Tracker" />
      {isLoading ? (
        <CertificateSkeletonList />
      ) : (
        <>
          {combinedCertificates.length === 0 && (
            <PlaceHolder text="No Clinical Certificates Available" />
          )}
          <Grid container spacing={3}>
            {generatedCertificates &&
              generatedCertificates.map((certificate, key) => {
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={certificate['id']}>
                    <CertificateCard
                      data={certificate}
                      completed={completedCert || highlightedCertID}
                      courseCertData={myLearningData[certificate.courseID] || null}
                      hasRenewButton={true}
                      setSelectedCourseID={setSelectedCourseID}
                      setIsOrderTypeFullAccess={setIsOrderTypeFullAccess}
                    />
                  </Grid>
                );
              })}
            {nonRenewCertificates &&
              nonRenewCertificates.map((certificate, key) => {
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={certificate['id']}>
                    <CertificateCard
                      data={certificate}
                      completed={completedCert || highlightedCertID}
                      courseCertData={myLearningData[certificate.courseID] || null}
                      hasRenewButton={false}
                      setSelectedCourseID={setSelectedCourseID}
                      setIsOrderTypeFullAccess={setIsOrderTypeFullAccess}
                    />
                  </Grid>
                );
              })}
          </Grid>
        </>
      )}
      <ExplorePlansDialog fullAccess={isOrderTypeFullAccess} />
      <RetakeCourseDialog
        course_id={selectedCourseID}
        handleRefresh={() => setRefresh(prev => prev + 1)}
      />
    </>
  );
};

export default ClinicalCertificate;
