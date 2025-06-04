import React, { useState, useContext, useEffect } from 'react';
import CMECard from './CMECards';
import { Box, Grid, Typography } from '@mui/material';
// import myLearningService from 'src/services/myLearningService';
import { useCertificatesContext } from 'src/context/CertificatesContext';
// import ExplorePlansDialog from 'src/views/Acquisition/MyLearning/dialogs/ExplorePlansDialog';
// import RetakeCourseDialog from 'src/views/Acquisition/MyLearning/dialogs/RetakeCourseDialog';
// import StepperCardContainer from './StepperCards';
import { PlaceHolder, PageTitle } from 'src/views/MonitoringRenewal/ui';
import { CertificateSkeletonList } from 'src/views/MonitoringRenewal/components/SkeletonLoaders';
// import {useSelector} from 'react-redux';

const CECME = () => {
  const { creditPoints, highlightedCertID, isLoading, CMECertificatesData } = useCertificatesContext();
  // const {id: userID} = useSelector((state) => state.account.user);
  // const [selectedCourseID, setSelectedCourseID] = useState(null);
  // const [isOrderTypeFullAccess, setIsOrderTypeFullAccess] = useState(false);
  // const [refreshCMEStepper, setRefreshCMEStepper] = useState(0);
  // const [cmeStepperData, setCMEStepperData] = useState({});
  const urlParams = new URLSearchParams(window.location.search);
  const completedCert = urlParams.get('completed');

  // Fetch CME Stepper Data for all courses
  // const fetchCMEStepperData = async () => {
  //   try {
  //     const cmeStepperData = await myLearningService.getCMEStepperData(userID);
  //     setCMEStepperData(cmeStepperData);
  //   } catch (error) {
  //     console.error('Error fetching CME Stepper Data: ', error);
  //     setCMEStepperData({});
  //   }
  // };

  // Run useEffect on page load & change in refresh state value( for teamhealth user renew flow)
  // useEffect(() => {
  //   fetchCMEStepperData();
  // }, [refreshCMEStepper]);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <PageTitle title="CME Tracker" />
        <Typography
          mb={2}
          sx={{
            fontSize: {xs: '16px', sm: '20px'},
            fontWeight: 400
          }}
        >
          Total Credits:{' '}
          <span style={{ color: '#008000' }}>{creditPoints.toFixed(2)}</span>
        </Typography>
      </Box>
      {isLoading ? (
        <CertificateSkeletonList isCME={true} />
      ) : (
        <>
          {CMECertificatesData.length === 0 && <PlaceHolder />}
          <Grid container spacing={3}>
            {CMECertificatesData &&
              CMECertificatesData.map((certificate) => {
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={certificate['id']}>
                    <CMECard
                      data={certificate}
                      completed={completedCert || highlightedCertID}
                    />
                  </Grid>
                );
              })}
            {/* <Grid size={12}></Grid>
            <StepperCardContainer
              cmeStepperData={cmeStepperData}
              setRefreshCMEStepper={setRefreshCMEStepper}
              setSelectedCourseID={setSelectedCourseID}
              setIsOrderTypeFullAccess={setIsOrderTypeFullAccess}
            /> */}
          </Grid>
        </>
      )}
      {/* <ExplorePlansDialog fullAccess={isOrderTypeFullAccess} />
      <RetakeCourseDialog
        course_id={selectedCourseID}
        handleRefresh={() => setRefreshCMEStepper(prev => prev + 1)}
      /> */}
    </>
  );
};

export default CECME;
