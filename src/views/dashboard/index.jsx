import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { StateLicenseCard, CertificateCard, CMEComplianceCard, CourseDetailsCard, ExpensesCard, CareerCard, ScheduleCard } from './cards';
import { CertificatesContext } from '../../context/CertificatesContext';
import { StaffingContext } from '../../context/StaffingContext';
import { DashboardSkeleton } from './components';
import { useSelector } from 'react-redux';
import alertPage from '../../services/alertPage';
import myLearningService from '../../services/myLearningService';

const DashboardPage = () => {
  const { generatedCertificates, addedCertificates, oldCertificates, certificatesData, grantedLicenses, claimedCreditPoints, userAddedCreditPoints } = useContext(CertificatesContext);
  const { userAppliedJobs: appliedJobs, userSavedJobs: savedJobs } = useContext(StaffingContext);
  const { scheduling, country } = useSelector(state => state.account.user);

  const { id: userID } = useSelector((state) => state.account.user);
  const [pageLoading, setPageLoading] = useState(false);

  const [overdueTaskCount, setOverdueTaskCount] = useState(0);
  const [timelyTaskCount, setTimelyTaskCount] = useState(0);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);

  const [cmeClaimPendingCount, setcmeClaimPendingCount] = useState(0);

  const [myLearningData, setMyLearningData] = useState({});

  const [acquisitionLicenses, setAcquisitionLicenses] = useState([]);
  const [monitoringLicenses, setMonitoringLicenses] = useState([]);
  const [refresh, setRefresh] = useState(0);

  // FOR STATE LICENSE
  const fetchCounts = async () => {
    const { data } = await alertPage.getCount(userID);
    setOverdueTaskCount(data[0].OverDueTask);
    setTimelyTaskCount(data[0].PendingCount);
  };

  const fetchCompletedTasks = async () => {
    const { data } = await alertPage.getUserLicenseTask(userID, 'Completed');
    setCompletedTaskCount(data ? data.length : 0);
  };

  const fetchAcquisitionLicenses = async () => {
    const { data } = await alertPage.getLicenseSummary(userID);
    setAcquisitionLicenses(data);
  };

  const fetchMyLearningData = async () => {
    try {
      const myLearningData = await myLearningService.getMyLearningData(userID);
      setMyLearningData(myLearningData.data);
      setcmeClaimPendingCount(myLearningData.cmeClaimPendingCount);
    } catch (error) {
      console.error("Error fetching My Learning Data: ", error);
      setMyLearningData({});
    }
  }

  const calculateMonitoringLicenses = () => {
    const states = ['Education', 'Health', 'Malpractice', 'Transcripts & Scores'];
    const userAddedLicenses = certificatesData.filter(
      (item) => item.entered_from_frontend === 1 && !states.includes(item.state)
    );
    const allLicenses = [...grantedLicenses, ...userAddedLicenses];
    setMonitoringLicenses(allLicenses);
  };

  // FETCH DATA FOR STATE LICENSE & CME COMPLIANCE CARDS
  const fetchData = async () => {
    setPageLoading(true);
    try {
      calculateMonitoringLicenses();
      await Promise.all([fetchCounts(), fetchCompletedTasks(), fetchMyLearningData(), fetchAcquisitionLicenses()]);
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  // Run useEffect on page load & change in refresh state value( for teamhealth user renew flow)
  useEffect(() => {
    fetchData();
  }, [refresh]);

  return (
    <Box minHeight={"80vh"}>
      <Typography mt={2} mb={1} style={{fontSize: '28px', fontWeight: 400}}>
        Welcome to Activity Overview
      </Typography>
        <Grid container spacing={3} mb={15}>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <StateLicenseCard
              overdueTaskCount={overdueTaskCount}
              timelyTaskCount={timelyTaskCount}
              completedTaskCount={completedTaskCount}
              acquisitionLicensesCount={acquisitionLicenses.length}
              monitoringLicensesCount={monitoringLicenses.length}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <CourseDetailsCard myLearningData={myLearningData} setRefresh={setRefresh} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <CertificateCard
              generatedCertificatesCount={generatedCertificates.length}
              addedCertificatesCount={addedCertificates.length}
              oldCertificatesCount={oldCertificates.length}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <CMEComplianceCard
              claimedCreditPoints={claimedCreditPoints}
              cmeClaimPendingCount={cmeClaimPendingCount}
              userAddedCreditPoints={userAddedCreditPoints}
            />
          </Grid>
          {scheduling && (
            <>
              <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                <ScheduleCard />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                <ExpensesCard />
              </Grid>
            </>
          )}
          {country === 'United States' && (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <CareerCard
                savedJobsCount={savedJobs.length}
                appliedJobsCount={appliedJobs.length}
              />
            </Grid>
          )}
        </Grid>
    </Box>
  );
};

export default DashboardPage;
