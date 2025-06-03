import React, { createContext, useState, useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useBuyPlan } from 'src/hooks/useBuyPlan';
import Backdrop from '@mui/material/Backdrop';
import { Loader } from '../ui/Progress';

export const MyLearningDataContext = createContext();

export const MyLearningDataProvider = ({ children }) => {
  const [dialogs, setDialogs] = useState({ explore: false, upgrade: false, retake: false, certificate: false}); // open respective dialog boxes
  const [courseData, setCourseData] = useState({}); // Store static data for course (e.g. images, title, id) -> Used in Dialog Boxes
  const [currentPlan, setCurrentPlan] = useState('none'); // Store current plan for selected course

  const { buyPlan, isLoading, setIsLoading } = useBuyPlan();
  const user = useSelector((state) => state.account.user);
  const isTeamHealthUser = user?.email.includes('@teamhealth.com');

  // Open Dialog Box based on type & selected course
  const handleOpenDialog = useCallback((type, course) => {
    setCourseData(course);
    setDialogs(prev => ({ ...prev, [type]: true }));
  }, []);

  // Close Dialog Box based on type
  const handleCloseDialog = type => {
    setDialogs(prev => ({ ...prev, [type]: false }));
  };

  // Redirect to medtigo store adding selected course plan to cart
  const handleBuyPlan = useCallback(() => {
    setIsLoading(true);
    buyPlan();
  }, [buyPlan, setIsLoading]);

  // Perform action based on button text for selected course
  const handleButtonClick = useCallback((buttonText, currentPlan, course) => {
    // Save currentPlan for selected course in state
    setCurrentPlan(currentPlan);
    if (['EXPLORE PLANS', 'RENEW'].includes(buttonText) && isTeamHealthUser) {
      handleOpenDialog('retake', course);
    } else if (['RENEW', 'FREE COURSE', 'FREE', 'BUY COURSE', 'BUY',].includes(buttonText) && (course.id === 11159 || course.id === 192797)) {
      const plan = course.id == 11159 ? 6025 : 77817;
      // Redirect to medtigo store adding selected course plan to cart if course is OPIOID or NIHSS
      setIsLoading(true);
      buyPlan(plan);
      return;
    } else if (['EXPLORE PLANS', 'RENEW', 'BUY COURSE', 'BUY',].includes(buttonText)) {
      handleOpenDialog('explore', course);
    } else if (buttonText === 'UPGRADE') {
      handleOpenDialog('upgrade', course);
    } else {
      localStorage.setItem("learning-path", window.location.pathname);
      window.location.href = `/learning/course/${course.id}`;
    }
  }, [handleOpenDialog, isTeamHealthUser]);

  return (
    <MyLearningDataContext.Provider
      value={{ dialogs, courseData, isTeamHealthUser, isLoading, handleOpenDialog, handleCloseDialog, handleButtonClick, handleBuyPlan, currentPlan }}
    >
      {children}
      {/* Display backdrop when redirecting to store for Opioid & NIHSS course */}
      <Backdrop open={isLoading} style={{ zIndex: 1300, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Loader />
        <div style={{ marginTop: '10px', fontSize: '20px' }}>Redirecting to medtigo Store...</div>
      </Backdrop>
    </MyLearningDataContext.Provider>
  );
};

export const useMyLearningContext = () => {
  return useContext(MyLearningDataContext);
} 