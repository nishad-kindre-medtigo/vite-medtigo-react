import * as React from 'react';
import learningService from 'src/services/learningService';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useroptionsServices from 'src/services/userOptionsService';
import myLearningService from 'src/services/myLearningService';
import { courseLanguages } from '../appConstants';

const AVAILABLE_COURSES = [4526, 9985, 9238, 151904, 79132, 11159, 192797];

export const LearningContext = React.createContext({});

export const LearningContextProvider = ({ children }) => {
  const user = useSelector((state) => state.account.user);
  const [activeCourse, setActiveCourse] = React.useState(null);
  const [activeCourseProgress, setActiveCourseProgress] = React.useState(null);
  const [activeQuiz, setActiveQuiz] = React.useState(null);
  const location = useLocation();
  const [language, setLanguage] = React.useState();
  const [startQuiz, setStartQuiz] = React.useState(false);
  const [simulationStatus, setSimulationStatus]=React.useState(null);
  const allowRedirectionRef = React.useRef(false); // useRef to immediately access the value without re-rendering
  const [userPlans, setUserPlans] = React.useState({
    acls: null,
    pals: null,
    bls: null
  });

  // To disable page refresh popup for redirection routes when quiz is active
  const setAllowRedirection = (value) => {
    allowRedirectionRef.current = value;
  };

  // Fetch Language options for user - Store selected Language in State
  const getUserOption = async () => {
    if (user) {
      const res = await useroptionsServices.getUserOptions();
      let selected_language = res?res.selected_language:courseLanguages[0].id;
      selected_language = selected_language?selected_language : courseLanguages[0].id;
      const selected_language_name = courseLanguages.find(it=>it.id==selected_language).name;
      setLanguage(selected_language_name);
    }
  };

  // Fetch Course data for current course
  const fetchCourses = async (id) => {
    try {
      const coursesData = await learningService.getAllCourses(id);
      setActiveCourse(coursesData);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Course Progress for current course
  const fetchCourseProgress = async (userID, courseID) => {
    try {
      const courseProgress = await learningService.getSingleCourseProgress(userID, courseID);
      setActiveCourseProgress(courseProgress);
    } catch (error) {
      console.log(error);
    }
  };

  // Update Course Progress when completing a unit/ lesson
  const updateCourseProgress = async (lessonID, courseID) => {
    try {
      const response = await learningService.updateCourseProgress(lessonID, courseID);
    } catch (error) {
      console.error('Error updating course progress:', error);
    }
  };

  // Fetch Quiz data for current course
  const fetchQuizzesData = async (id) => {
    setActiveQuiz(null);
    const quizzesData = await learningService.getQuizzesData(id);
    setActiveQuiz(quizzesData);
  };

  const fetchCourseOrderPlans = async () => {
    if (user) {
      const res = await myLearningService.getMyLearningData(user.id);
      let obj = {
        acls: res.data['4526']?.order?.plan || null,
        pals: res.data['9238']?.order?.plan || null,
        bls: res.data['9985']?.order?.plan || null
      };
  
      setUserPlans(obj);
    }
  };

  // Fetch User Options on load
  React.useEffect(() => {
    getUserOption();
    fetchCourseOrderPlans();
  }, []);

  // Fetch Course data on loading learning page
  React.useEffect(() => {
    if (window.location.pathname.startsWith('/learning/course/')) {
      const urlSegments = window.location.pathname.split('/');
      const courseID = Number(urlSegments[urlSegments.length - 1]);

      // Check if the courseID is a valid number and exists in the allowed courses array
      if (user && courseID && AVAILABLE_COURSES.includes(courseID)) {
        fetchCourses(courseID);
        fetchCourseProgress(user.id, courseID);
      }
    }
  }, [location, user]);

  // Fetch Quiz data on loading learning page
  React.useEffect(() => {
    if (activeCourse) {
      fetchQuizzesData(activeCourse.id);
    }
  }, [activeCourse]);

  const defaultContext = {
    activeCourse,
    activeQuiz,
    activeCourseProgress,
    fetchCourseProgress,
    updateCourseProgress,
    language,
    userPlans,
    startQuiz,
    setStartQuiz,
    allowRedirectionRef,
    setAllowRedirection,
    simulationStatus,
    setSimulationStatus
  };

  return (
    <LearningContext.Provider value={defaultContext}>
      {children}
    </LearningContext.Provider>
  );
};
export const useLearningContext = () => {
  return React.useContext(LearningContext);
};