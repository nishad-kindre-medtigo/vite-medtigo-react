/* eslint react/prop-types: 0 */
import React from 'react';
import { LearningContext } from 'src/context/LearningContext';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { courseDetails } from '../../../../appConstants';
import QuizScreen from './QuizScreen';
import SplashScreen from '../../../../components/SplashScreen';
import { formatQuizContent } from '../../utils';
import './quiz.css';

const QuizPage = () => {
  const { activeCourse, activeQuiz } = React.useContext(LearningContext);
  const quiz = formatQuizContent(activeQuiz);
  quiz.quizTitle = courseDetails.find(
    course => course.id == activeCourse.id
  )?.full_name;

  const { user } = useSelector(state => state.account);
  const [uniqueID, setUniqueID] = React.useState(
    `${user.id}_${moment().utc().format('YYYY-MM-DD_HH:mm:ss')}`
  ); // UNIQUE ID CREATED EVERYTIME USER STARTS QUIZ

  return (
    <div className="page">
      {activeQuiz ? (
        <QuizScreen
          quiz={quiz}
          uniqueID={uniqueID}
          activeCourse={activeCourse}
          shuffle={true}
        />
      ) : (
        <SplashScreen />
      )}
    </div>
  );
}

export default QuizPage;
