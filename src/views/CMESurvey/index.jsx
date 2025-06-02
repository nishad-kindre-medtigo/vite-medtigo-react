import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import learningService from '../../services/learningService';
import orderServices from '../../services/orderServices';
import myLearningService from '../../services/myLearningService';
import RegularCourseForm from './RegularCourseForm';
import OpioidSurveyForm from './OpioidCourseForm';
import { AccessDeniedScreen } from '../CourseLearning/components';
import SurveyFormLoader from './components/SurveyFormLoader';
import CourseNotCompleted from './components/CourseNotCompleted';
import './styles.css'

const CME_COURSES = [4526, 9985, 9238, 11159, 192797];

const CMESurveyForm = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paramsCourseID = params.get('courseID');
  const paramsHash = params.get('hash');
  const { user } = useSelector((state) => state.account);
  const courseID = Number(paramsCourseID) || 0; // Get the course ID from the URL or set to 0 if not found

  const [hash, setHash] = useState('');
  const [currentOrderID, setCurrentOrderID] = useState(null);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isValidCourseID = CME_COURSES.includes(Number(paramsCourseID)); // Check if the course ID is valid
  const isOpioidOrNIHSS = [11159, 192797].includes(Number(paramsCourseID));

  // SET HASH VALUE & COURSE ID FROM PROPS/ URL PARAMS
  // HASH VALUE IS SET AFTER VALIDATIN FROM API
  const validateHash = async () => {
    try {
      const course = paramsCourseID || '';
      const hash = paramsHash || '';
      const response = await orderServices.validateService({
        hash,
        course
      });
      if (response) setHash(hash);
    } catch (error) {
      console.error('Error validating hash: ', error);
      setHash('');
    }
  };

  // FETCH COURSE LATEST ORDER FOR CME-CERTIFICATE ORDER LINK
  const fetchCourseLatestOrder = async () => {
    try {
      const response = await myLearningService.getCourseLatestOrder(
        user.id,
        courseID
      );
      setCurrentOrderID(response.orderID);
    } catch (error) {
      console.error('Error fetching latest order: ', error);
    }
  };

  // CHECK IF USER HAS COMPLETED THE COURSE FROM COURSE PROGRESS API
  const fetchCourseProgress = async (userID, courseID) => {
    try {
      const courseProgress = await learningService.getSingleCourseProgress(
        userID,
        courseID
      );
      setIsCourseCompleted(courseProgress?.isCourseCompleted);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCMEDetails = () => {
    if (isValidCourseID) {
      validateHash();
      fetchCourseLatestOrder();
      fetchCourseProgress(user.id, courseID);
    } else {
      return
    }
  }

  useEffect(() => {
    fetchCMEDetails();
  }, []);

  const surveyFormProps = {
    courseID,
    hash,
    currentOrderID
  };

  // SHOW ACCESS DENIED SCREEN IF COURSE ID IS INVALID
  if (!isValidCourseID) {
    return (
      <AccessDeniedScreen text="The course you are trying to access is invalid or unavailable." />
    );
  }

  // SHOW LOADING SCREEN
  if (isLoading) {
    return <SurveyFormLoader />;
  }

  // SHOW COURSE NOT COMPLETED SCREEN
  if (!isCourseCompleted) {
    return <CourseNotCompleted courseID={courseID} />;
  }

  return isOpioidOrNIHSS ? (
    <OpioidSurveyForm {...surveyFormProps} />
  ) : (
    <RegularCourseForm {...surveyFormProps} />
  );
};

export default CMESurveyForm;
