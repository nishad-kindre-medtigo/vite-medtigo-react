import React, { useEffect, useState } from 'react';
import { Grid, Box } from '@mui/material';
import ExplorePlansDialog from './dialogs/ExplorePlansDialog';
import RetakeCourseDialog from './dialogs/RetakeCourseDialog';
import FullSizeCertificateDialog from './dialogs/FullSizeCertificateDialog';
import { useSelector } from 'react-redux';
import { FullAccessPlanCard, DividerText } from './components/PageCards';
import NewCourseCard from './components/NewCourseCard';
import { CourseCardSkeleton } from './components/SkeletonLoader';
import { useMyLearningContext } from '../../../context/MyLearningContext';
import myLearningService from '../../../services/myLearningService';

const CONNECT_COURSES = [4526, 9985, 9238, 79132, 151904, 192797, 11159];

const MyLearningPage = () => {
  const [myLearningData, setMyLearningData] = useState({});
  const [isOrderTypeFullAccess, setIsOrderTypeFullAccess] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const { id: userID } = useSelector((state) => state.account.user);
  const { courseData, handleOpenDialog, handleButtonClick, handleBuyPlan, isTeamHealthUser } = useMyLearningContext();

  // Re-Fetch My Learning Data when Course is Renewed by TeamHealth User
  const handleRefresh = () => {
    setRefresh(prev => prev + 1);
  }

  // Fetch My Learning Data for all courses
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
    fetchMyLearningData();
  }, [refresh])

  return (
    <Box>
      {Object.keys(myLearningData).length > 0 ? (
        <>
          <Grid container spacing={3}>
            {CONNECT_COURSES.map(course => (
              <Grid item xs={12} sm={6} md={4} key={course}>
                <NewCourseCard
                  courseID={course}
                  courseData={myLearningData[course]}
                  handleOpenDialog={handleOpenDialog}
                  handleButtonClick={handleButtonClick}
                  setIsOrderTypeFullAccess={setIsOrderTypeFullAccess}
                />
              </Grid>
            ))}
          </Grid>

          {/* DISPLAY FULL ACCESS PLAN CARD ONLY FOR NON TH USERS */}
          {!isTeamHealthUser && (
            <>
              <DividerText />
              <FullAccessPlanCard handleBuyPlan={handleBuyPlan}/>
            </>
          )}
        </>
      ) : (
        <CourseCardSkeleton CONNECT_COURSES={CONNECT_COURSES} />
      )}

      {/* Dialog Boxes */}
      <ExplorePlansDialog fullAccess={isOrderTypeFullAccess}/>
      <RetakeCourseDialog course_id={courseData.id} handleRefresh={handleRefresh}/>
      <FullSizeCertificateDialog />
    </Box>
  );
};

export default MyLearningPage;
