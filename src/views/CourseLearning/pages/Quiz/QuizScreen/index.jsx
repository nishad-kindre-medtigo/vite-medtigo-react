import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Grid } from '@mui/material';
import authService from '../../../../../services/authService';
import learningService from '../../../../../services/learningService';
import myLearningService from '../../../../../services/myLearningService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LearningContext } from '../../../../../context/LearningContext';
import QuizContent from './components/QuizContent';
import QuizSimulationCard from './components/QuizSimulationCard';
import QuizActionsCard from './components/QuizActionsCard';
import QuizCompletion from './components/QuizCompletion';
import { ExitButton } from './handlers';
import './styles.css';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import useBreakpoints from 'src/hooks/useBreakpoints';

/**
 * @component QuizScreen
 * @description Main component for the course Final Exam page
 * 
 * @summary
 * This component handles the quiz lifecycle, including starting the quiz, displaying questions, and showing results.
 * Serves as the container for the Final Exam page within Course Learning Content.
 * Dynamically renders either Quiz Start, Quiz Questions, or Quiz End pages based
 * on the user's current course status via myLearning API.
 *
 * @hierarchy
 * - Parent to: QuizContent, QuizActionsCard, QuizSimulationCard, QuizCompletion
 * - Child of: CourseLearning
 *
 * @flow
 * 1. Initial State: Shows QuizActionCard with "Complete" butotn
 * 2. During Quiz: Presents QuizContent displaying question-answers with progress
 * 3. After Completion: Updates QuizActionCard with results and next steps
 *
 * @behavior
 * - Pre-Provider-Card-Generation:
 *   • Displays QuizActionCard with "Complete" button
 *   • Clicking initiates quiz attempt via QuizContent
 *   • System validates quiz responses upon submission
 *
 * - Post-Provider-Card-Generation:
 *   • The QuizCompletion component provides options to download Provider Card and claim CME credits
 *
 * - Return visits:
 *   • If Provider Card or CME certificate exists, shows QuizCompletion with Download/ Claim options
 *
 * @props {Object} quiz - formatted LMS quiz data
 * @props {string} uniqueID - Unique ID for quiz logs feature to track each quiz attempt
 */

const QuizScreen = props => {
  const { quiz, uniqueID, shuffle = true } = props;

  // DEFAULT VALUES
  const navigate = useNavigate();
  const openSnackbar = useOpenSnackbar();
  const {
    activeCourse,
    startQuiz,
    userPlans,
    simulationStatus,
    setSimulationStatus,
    activeCourseProgress
  } = useContext(LearningContext);
  const { user } = useSelector(state => state.account);
  const { isMobile } = useBreakpoints();

  // STATE VALUES
  const [endQuiz, setEndQuiz] = useState(false);
  const [start, setStart] = useState(false);
  const [questions, setQuestions] = useState(quiz.questions);
  const [myLearningData, setMyLearningData] = useState({});
  const [newPercentage, setNewPercentage] = useState(0);

  // CONDITIONAL VALUES
  const isACLS = activeCourse.id === 4526;
  const isTeamHealthUser = user.email.split('@')[1] === 'teamhealth.com';
  const showSimulationCard = isTeamHealthUser || userPlans.acls == 'best_value';
  const isSimulationCompleted = isMobile ? false : isACLS && simulationStatus == 'done';

  const exitButtonGrid = isACLS ? (isTeamHealthUser ? 12 : myLearningData?.order?.hasCME ? 12 : 6) : 6;

  // CHECK IF SIMULATION IS COMPLETED FOR ACLS COURSE
  const checkSimulationCompletion = () => {
    if (isACLS) {
      setSimulationStatus(() =>
        userPlans.acls != 'best_value' ? 'done' : simulationStatus
      );
    }
  };

  // FETCH LEARNING DATA OF CURRENT ACTIVE COURSE - E.G. ORDER, PROVIDER CARD & CME CLAIM STATUS
  const fetchCourseMyLearningData = async () => {
    try {
      const myLearningData = await myLearningService.getCourseMyLearningData(user.id, parseInt(activeCourse.id));
      setMyLearningData(myLearningData);
    } catch (error) {
      console.error('Error fetching My Learning Data: ', error);
      setMyLearningData({});
    }
  };

  useEffect(() => {
    checkSimulationCompletion();
    fetchCourseMyLearningData();
  }, []);

  // GENERATE A 2 HOUR TOKEN FOR QUIZ ATTEMPT AND SHUFFLE QUESTIONS
  useEffect(() => {
    authService.refreshToken('2h');
    if (shuffle) {
      setQuestions(shuffleQuestions(quiz.questions));
    } else {
      setQuestions(quiz.questions);
    }

    setQuestions(
      questions.map((question, index) => ({
        ...question,
        questionIndex: index + 1
      }))
    );
  }, []);

  // GO BACK TO REFERRER PAGE
  const handleBackLink = () => {
    navigate('/dashboard');
  };

  // SHUFFLE QUESTIONS FUNCTION
  // This function shuffles the questions array in place using the Fisher-Yates algorithm
  const shuffleQuestions = useCallback(questions => {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions;
  }, []);

  // VALIDATE QUIZ OBJECT STRUCTURE
  // This function checks if the quiz object has the required fields and correct data types
  const validateQuiz = quiz => {
    if (!quiz) {
      console.error('Quiz object is required.');
      return false;
    }

    const { questions } = quiz;

    if (!questions) {
      console.error("Field 'questions' is required.");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const {
        question,
        questionType,
        questionPic,
        answerSelectionType,
        answers,
        correctAnswer
      } = questions[i];
      let selectionType = answerSelectionType;
      if (!question) {
        console.error("Field 'question' is required.");
        return false;
      }

      if (!questionType) {
        console.error("Field 'questionType' is required.");
        return false;
      } else {
        if (questionType != 'text' && questionType != 'photo') {
          console.error(
            "The value of 'questionType' is either 'text' or 'photo'."
          );
          return false;
        }
      }

      if (!answers) {
        console.error("Field 'answers' is required.");
        return false;
      } else {
        if (!Array.isArray(answers)) {
          console.error("Field 'answers' has to be an Array");
          return false;
        }
      }

      if (!correctAnswer) {
        console.error("Field 'correctAnswer' is required.");
        return false;
      }

      if (!selectionType) {
        // Default single to avoid code breaking due to automatic version upgrade
        console.warn(
          'Field answerSelectionType should be defined since v0.3.0. Use single by default.'
        );
        selectionType = selectionType || 'single';
      }

      if (
        selectionType === 'single' &&
        !(typeof selectionType === 'string' || selectionType instanceof String)
      ) {
        console.error(
          'answerSelectionType is single but expecting String in the field correctAnswer'
        );
        return false;
      }
      if (selectionType === 'multiple' && !Array.isArray(correctAnswer)) {
        console.error(
          'answerSelectionType is multiple but expecting Array in the field correctAnswer'
        );
        return false;
      }
    }

    return true;
  };

  // SHOW QUIZ SCORE USING UNIQUE ID LINKED WITH ORDER AFTER COURSE COMPLETION
  const getCompletedQuizDetails = async uniqueID => {
    try {
      const response = await learningService.getCompletedQuizDetails(uniqueID);
      return response?.quizAttemptDetails?.percentage;
    } catch (error) {
      console.error('Error fetching completed quiz attempt details: ', error);
      // openSnackbar('Error fetching quiz attempt details', 'error');
    }
  };

  // CALCULATE PERCENTAGE OF QUIZ SCORE IF COURSE IS COMPLETED AND ORDER HAS A QUIZ ID
  const runPercentageCalculation = async () => {
    try {
      if (myLearningData.order && activeCourseProgress?.isCourseCompleted) {
        const newQuizScore = await getCompletedQuizDetails(
          myLearningData?.order?.quizID
        );
        setNewPercentage(newQuizScore);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    runPercentageCalculation();
  }, [myLearningData]);

  // COMMON PROPS FOR `QuizActionsCard` and `QuizCompletion` component
  const CardProps = {
    parent: 'QuizScreen',
    isTeamHealthUser: isTeamHealthUser,
    isACLS: isACLS,
    currentOrder: myLearningData.order,
    hash: myLearningData.order?.hash,
    isCMEValid: myLearningData.order?.hasCME,
    activeCourse: activeCourse,
    certificateID: myLearningData.providerCardData?.id,
    cmeID: myLearningData.cmeCertificateData?.id,
    providerCardPath: myLearningData.providerCardData?.path,
    cmePath: myLearningData.cmeCertificateData?.path,
    setEndQuiz: setEndQuiz,
    setStart: setStart,
    percentage: newPercentage
  };

  // PROPS FOR `QuizContent` component
  const quizContentProps = {
    questions: questions,
    uniqueID: uniqueID,
    quiz: quiz,
    endQuiz: endQuiz,
    setEndQuiz: setEndQuiz,
    setStart: setStart
  };

  return Object.keys(myLearningData).length > 0 ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      {/* Quiz Start Page */}
      {!start &&
        (myLearningData.providerCardData?.id ||
        myLearningData.cmeCertificateData?.id ||
        activeCourseProgress?.isCourseCompleted ? (
          <QuizCompletion {...CardProps} />
        ) : (
          <Grid container justifyContent="center" spacing={2} sx={{ my: 2 }}>
            <Grid size={12} sm={exitButtonGrid}>
              <ExitButton onClick={handleBackLink} />
            </Grid>
            <Grid size={12} />
            {isACLS ? (
              <>
                {showSimulationCard && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <QuizSimulationCard parent="QuizScreen" endQuiz={false} />
                  </Grid>
                )}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <QuizActionsCard {...CardProps} />
                </Grid>
              </>
            ) : (
              <Grid size={{ xs: 12, sm: 6 }}>
                <QuizActionsCard {...CardProps} />
              </Grid>
            )}
          </Grid>
        ))}

      {/* Quiz Content & Success Page */}
      {start && <QuizContent {...quizContentProps} />}
    </div>
  ) : null;
};

export default QuizScreen;
