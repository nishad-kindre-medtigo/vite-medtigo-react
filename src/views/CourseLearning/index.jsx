import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import { LearningContext } from 'src/context/LearningContext';
import useBreakpoints from 'src/hooks/useBreakpoints';
import authService from 'src/services/authService';
import myLearningService from 'src/services/myLearningService';
import Page from 'src/components/Page';
import { LoadingScreen, AccessDeniedScreen, CourseStepper, CourseStepperPopup } from './components';
import { Introduction, CourseUnits, QuizPage } from './pages';
import { courseLessonTypes } from './utils';
import './courseContent.css';

const AVAILABLE_COURSES = [4526, 9985, 9238, 151904, 79132, 11159, 192797, 130360];

const FREE_ACCESS_COURSES = [130360]

const CourseLearningPage = () => {
  // CONSTANT VALUES
  const { courseID } = useParams(); // Get the course ID from the URL
  const { isTablet } = useBreakpoints(); // Check if the user is on screen size of tablet or smaller
  const user = useSelector((state) => state.account.user);
  const { language, activeCourse, activeCourseProgress: courseProgress, updateCourseProgress } = useContext(LearningContext);
  const isValidCourseID = AVAILABLE_COURSES.includes(parseInt(courseID)); // Check if the course ID is valid
  const freeAccess = FREE_ACCESS_COURSES.includes(parseInt(courseID)); // Check if the course ID is valid

  // STATE VALUES
  const [activeStep, setActiveStep] = useState(0); // Store current active Step/Lesson
  const [scrollEl, setScrollEl] = useState(); // Scroll to top when changing course units
  const [lastStoredStep, setLastStoredStep] = useState(0); // Store last Step/ Lesson for Course Stepper
  const [isFirstTime, setIsFirstTime] = useState(true); // Store value when course is not started yet
  const [openStepperPopup, setOpenStepperPopup] = useState(false); // Open Course Lesson Stepper Popup for mobile view
  const [isCompleted, setIsCompleted] = useState(false); // Store course completion status from API
  const [hasCourseAccess, setHasCourseAccess] = useState(false); // Check if the user has access to the course
  const [loadingCourse, setLoadingCourse] = useState(true); // Check if the user has access to the course

  // Store course Lesson Names for display in Course Stepper
  let steps = activeCourse ? activeCourse.lessons?.map((lesson) => {
    return {
      title: lesson.post_title.replace(/[a-zA-Z]+ - Unit [0-9]+ /g, ''),
      course_type: activeCourse.course_type
    }
  }) : [];

  const isQuizPage = activeStep === (courseProgress?.totalLessons - 1);

  // GO TO NEXT UNIT
  const goToNextUnit = () => {
    // Add new 1hr token when going to next unit
    authService.refreshToken("1h");
    updateCourseProgress(activeCourse.lessons[activeStep]['ID'], courseID);

    activeStep + 1 > lastStoredStep && setLastStoredStep(activeStep + 1);
    setActiveStep(prev => prev + 1 );
    if(scrollEl){
      scrollEl.scrollTop = 0;
    }
  };

  // GO TO PREVIOUS UNIT
  const goToPreviousUnit = () => {
    setActiveStep(prev => prev - 1);
    if (scrollEl) {
      scrollEl.scrollTop = 0;
    }
  };

  // CHECK USER'S COURSE ACCESS BASED ON ORDER - FREE ACCESS FOR TEAMHEALTH USER
  const checkCourseAccess = async () => {
    if(freeAccess){
      setLoadingCourse(false);
      setHasCourseAccess(true);
      return;
    }

    const isTeamHealthUser = user.email.includes('teamhealth.com');
    if (isTeamHealthUser) {
      setLoadingCourse(false);
      setHasCourseAccess(true);
      return;
    }
    
    setLoadingCourse(true);
    try {
      const myLearningData = await myLearningService.getCourseMyLearningData(user.id, parseInt(courseID));
      setHasCourseAccess(!myLearningData.isOrderExpired && myLearningData.order);
    } catch (error) {
      console.error("Error fetching My Learning Data: ", error);
      setHasCourseAccess(false);
    } finally {
      setLoadingCourse(false);
    }
  };

  // CHECK COURSE ACCESS ON PAGE LOAD
  useEffect(() => {
    checkCourseAccess();
  }, []);

  // STORE COURSE COMPLETION STATUS, ACTIVE LESSON, IS FIRST TIME OR NOT
  useEffect(() => {
    const totalLessons = courseProgress?.totalLessons;
    const attemptedLessons = courseProgress?.attemptedLessons;

    const isCourseCompleted = courseProgress?.isCourseCompleted || false;

    // STORE ACTIVE LESSON DEFAULT
    //? EX. IF LESSON 5 IS COMPLETED LESSON 6 IS STORED AS ACTIVE LESSON
    let activeLesson = attemptedLessons ? attemptedLessons : 0;

    // STORE QUIZ AS ACTIVE LESSON CONDITIONALLY
    //? EX. CLICKING START QUIZ DISPLAYS QUIZ PAGE / CLICKING ON VIEW COURSE AFTER PROVIDER CARD GENERATION
    if(isCourseCompleted || totalLessons - 1 === attemptedLessons){
      activeLesson = totalLessons - 1;
    }

    setActiveStep(activeLesson); // To store current active lesson
    setIsCompleted(isCourseCompleted); // Check if user has completed the course ( quiz & all lessons )
    setIsFirstTime(!courseProgress?.firstAccess); // Check if user has started course or not by having accessDate as reference
    setLastStoredStep(attemptedLessons); //For stepper
  }, [activeCourse]);

  // HIDE CHATBOT FOR COURSE CONTENT PAGE
  useEffect(() => {
    document.body.classList.add('hide-chatbot');
    return () => {
      document.body.classList.remove('hide-chatbot');
    };
  }, [activeCourse]);

  // Store the lesson name for last unit course course (i.e Quiz)
  if (steps?.length > 0) {
    steps[steps.length] = {
      title: 'Quiz',
      course_type: activeCourse.course_type,
    };
  }

  // For Internal Pages Course Lesson Title
  let courseLessonTitle = steps[activeStep] ? steps[activeStep]['title'] : '';
  const courseLessonType = activeCourse && courseLessonTitle ? courseLessonTypes(courseLessonTitle, activeCourse.course_type, language, activeCourse.id) : '';

  if (activeCourse?.course_type === 'cme') {
    courseLessonTitle = courseLessonTitle ? (courseLessonTitle.split(/[-–]/).length > 1 ? courseLessonTitle.replace(courseLessonTitle.split(/[-–]/)[0].trim(), '').replace(/[-–]/, '') : courseLessonTitle) : courseLessonTitle;
  }

  // Display the Course Stepper on the right side of the screen for Desktop and as a Popup for Mobile
  const CourseStepperContainer = () => {
    return !isTablet ? (
      <CourseStepper activeStep={lastStoredStep} setActiveStep={setActiveStep} steps={steps} isCompleted={isCompleted} />
    ) : (
      <CourseStepperPopup open={openStepperPopup} setOpen={setOpenStepperPopup} isFirstTime={isFirstTime}>
        <CourseStepper activeStep={lastStoredStep} setActiveStep={setActiveStep} steps={steps} isCompleted={isCompleted} closePopup={() => setOpenStepperPopup(false)}/>
      </CourseStepperPopup>
    );
  };

  // Render the Course Content based on the active step and course type and if the user is accessing the course for the first time
  const renderCourseUnits = () => (
    <Grid size={{ xs: 12, md: 9 }}
      style={{
        display: isFirstTime ? 'none' : 'flex',
        background: '#fff'
      }}
    >
      <div
        style={{
          width: '100%',
          height: "calc(100vh - 58px)",
          overflow: 'auto'
        }}
      >
        <>
          {!isQuizPage ? (
            <CourseUnits
              setScrollEl={setScrollEl}
              isFirstTime={isFirstTime}
              activeStep={activeStep}
              steps={steps}
              activeCourse={activeCourse}
              courseLessonType={courseLessonType}
              courseTitle={courseLessonTitle}
              goToPreviousUnit={goToPreviousUnit}
              goToNextUnit={goToNextUnit}
            />
          ) : (
            <QuizPage activeCourse={activeCourse} setActiveStep={setActiveStep} />
          )}
        </>
      </div>
    </Grid>
  );

  // Render the Course Container based on the active course and if the user has access to the course
  const renderCourseContainer = () => (
    <Grid container>
      {isFirstTime && (
        <Grid size={{ xs: 12, md: 9 }}>
          {activeCourse ? (
            <Introduction setIsFirstTime={setIsFirstTime} courseID={activeCourse.id} />
          ) : (
            <LoadingScreen />
          )}
        </Grid>
      )}
      {renderCourseUnits()}
      <CourseStepperContainer />
    </Grid>
  );

  // If courseID in url is not in Available courses show Access Denied Screen
  if(!isValidCourseID){
    return <AccessDeniedScreen text="The course you are trying to access is invalid or unavailable." />
  }

  // If the course is not loaded yet, show the Loading Screen
  if (!activeCourse || loadingCourse) {
    return <LoadingScreen />;
  }

  // If the user does not have access to the course, show the Access Denied Screen
  return (
    <Page title="Course Content">
      {hasCourseAccess ? (
        renderCourseContainer()
      ) : (
        <AccessDeniedScreen text="You do not have access to this course. Please purchase the course from your dashboard to gain full access." />
      )}
    </Page>
  );
}

export default CourseLearningPage;
