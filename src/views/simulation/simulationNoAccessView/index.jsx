import React, { useState, useEffect } from 'react';
import { Box, Grid, Button, Typography, Card, CardContent } from '@mui/material';
import { ArrowBack, OpenInNew as ExploreIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import useBreakpoints from '../../../hooks/useBreakpoints';
import { useMyLearningContext } from '../../../context/MyLearningContext';
import myLearningService from '../../../services/myLearningService';
import ExplorePlansDialog from '../../Acquisition/MyLearning/dialogs/ExplorePlansDialog';
import { courses } from '../../Acquisition/MyLearning/data';

function SimulationNoAccessView() {
  const { handleButtonClick } = useMyLearningContext();
  const { id: userID } = useSelector((state) => state.account.user);
  const [isOrderTypeFullAccess, setIsOrderTypeFullAccess] = useState(false); // Check if order type is Full Access
  const [coursePlan, setCoursePlan] = useState('basic'); // Store course plan
  const { isMobile } = useBreakpoints();

  const currentCourse = courses.find((item) => item.id == 4526); // Store static data for course (e.g. images, title, id)

  // FETCH LEARNING DATA OF CURRENT ACTIVE COURSE - E.G. ORDER, PROVIDER CARD & CME CLAIM STATUS
  const fetchCourseMyLearningData = async () => {
    try {
      const myLearningData = await myLearningService.getCourseMyLearningData(
        userID,
        4526
      );
      if (myLearningData) {
        const isFullAccess = myLearningData?.order?.order_type == 'Full_Access';
        const coursePlan = myLearningData?.order?.plan || 'no_access';

        setIsOrderTypeFullAccess(isFullAccess);
        setCoursePlan(coursePlan);
      }
    } catch (error) {
      console.error('Error fetching My Learning Data: ', error);
    }
  };

  useEffect(() => {
    fetchCourseMyLearningData();
  }, []);

  const handleUpgradeClick = () => {
    handleButtonClick('RENEW', coursePlan, currentCourse);
  };

  const handleGoBack = () => {
    window.location.href = '/learning/course/4526';
  };

  return (
    <Box
      py={6}
      px={isMobile ? 2 : 6}
      sx={{
        height: '100vh',
        backgroundColor: '#F4F9FF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Typography variant="h4" fontWeight={600} mb={2} textAlign="center">
        Medtigo Simulation
      </Typography>

      <Typography
        variant="body1"
        maxWidth={700}
        mx="auto"
        mb={4}
        textAlign="center"
        color="text.secondary"
      >
        A dynamic simulation platform that prepares healthcare professionals and
        students for real-world code situations through an immersive and
        interactive 3D experience.
      </Typography>

      <Box
        component="img"
        src="/images/simulation_noAccess.png"
        alt="Simulation"
        sx={{
          width: isMobile ? '80%' : '35%',
          mb: 2
        }}
      />

      <Card
        sx={{
          maxWidth: 600,
          width: '100%',
          border: '1px solid #DADADA',
          boxShadow: '0px 8px 24px 0px #959DA533',
          backgroundColor: 'white',
          textAlign: 'center'
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={1}>
            Gain Access to the Simulation Experience
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Upgrade to the&nbsp;
            <strong style={{ color: '#2872C1' }}>Best Value Plan</strong>
            &nbsp;or&nbsp;
            <strong style={{ color: '#2872C1' }}>Full Access Plan</strong>
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                startIcon={<ArrowBack />}
                variant="outlined"
                onClick={handleGoBack}
              >
                Go Back
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                disableElevation
                startIcon={<ExploreIcon />}
                onClick={handleUpgradeClick}
              >
                Upgrade Now
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <ExplorePlansDialog fullAccess={isOrderTypeFullAccess} />
    </Box>
  );
}

export default SimulationNoAccessView;
