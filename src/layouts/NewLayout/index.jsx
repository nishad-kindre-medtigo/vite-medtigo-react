import React from 'react';
import TopBar from './TopBar';
import MidBar from './MidBar';
import ServicesBar from './ServicesBar';
import Carousel from './Carousel';
import Footer from './Footer';
import SchedulingNavBar from './SchedulingNavbar';
import ExpensesNavbar from './ExpensesNavbar';
import CareerNavbar from './CareerNavbar';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

const NewLayout = ({ children }) => {
  const location = useLocation();
  const isSettingsRoute = location.pathname.includes('/setting');
  const isCoursePage = location.pathname.includes('/learning');
  const isSyllabusPage = location.pathname.includes('/syllabusReader');
  const isSchedulingPage = location.pathname.includes('/schedule');
  const isExpensesPage = location.pathname.includes('/expenses');
  const isCareerPage = location.pathname.includes('/career');
  const isMedtigoOrangePage = location.pathname.includes('/medtigo-orange');
  const isSimulationNoAccessPage = location.pathname.includes('/noSimulationCaseAccess');

  const hideCarouselAndServicesBar = isSettingsRoute || isCoursePage || isSyllabusPage || isMedtigoOrangePage || isSimulationNoAccessPage;
  const boxStyles = { maxWidth: 1440, margin: '0 auto', width: '100%' }
  const coursePagePadding = { xs: 0, md: 4, lg: 5 };

  return (
    <div style={{ overflow: 'hidden', minHeight: '100vh' }}>
      <TopBar />
      {!isCoursePage && <MidBar />}
      {!hideCarouselAndServicesBar && (
        <>
          <Carousel />
          <ServicesBar />
        </>
      )}
      {isCareerPage || isMedtigoOrangePage ? (
        <>
          {isCareerPage && (
            <Box sx={{ ...boxStyles, px: { xs: 2, md: 4, lg: 5 } }}>
              <CareerNavbar />
            </Box>
          )}
          {children}
        </>
      ) : (
        <Box sx={{ ...boxStyles, px: isCoursePage ? coursePagePadding : { xs: 2, md: 4, lg: 5 } }}>
          {isSchedulingPage && <SchedulingNavBar />}
          {isExpensesPage && <ExpensesNavbar />}
          {children}
        </Box>
      )}
      {!isCoursePage && <Footer />}
    </div>
  );
};

export default NewLayout;
