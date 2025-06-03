import React, { useState, useEffect, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid, Box, Button } from '@mui/material';
import BackIcon from '@mui/icons-material/KeyboardArrowLeft';
import authService from '../../../../../services/authService';
import myLearningService from '../../../../../services/myLearningService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LearningContext } from '../../../../../context/LearningContext';
import QuizContent from './components/QuizContent';
import QuizSimulationCard from './components/QuizSimulationCard';
import QuizActionsCard from './components/QuizActionsCard';
import QuizCompletion from './components/QuizCompletion';
import './styles.css';
import RenewOrderServices from '../../../../../services/renewOrderService';
import LearningService from '../../../../../services/learningService';
import { useCertificatesContext } from '../../../../../context/CertificatesContext';
import orderServices from '../../../../../services/orderServices';
import certificatesService from '../../../../../services/certificatesService';
import { useOpenSnackbar } from '../../../../../hooks/useOpenSnackbar';

/**
 * @component QuizScreen
 * @description Main component for the course Final Exam page
 *
 * Serves as the container for the Final Exam page within Course Learning Content.
 * Dynamically renders either Quiz Start, Quiz Questions, or Quiz End pages based
 * on the user's current course status via myLearning API.
 *
 * @hierarchy
 * - Parent to: QuizContent, QuizActionsCard
 *
 * @flow
 * 1. Initial State: Shows QuizActionCard with "Complete Requirement" option
 * 2. During Quiz: Presents QuizContent displaying question-answers with progress
 * 3. After Completion: Updates QuizActionCard with results and next steps
 *
 * @behavior
 * - Pre-Provider-Card-Generation:
 *   • Displays QuizActionCard with "Complete Requirement" button
 *   • Clicking initiates quiz attempt via QuizContent
 *   • System validates quiz responses upon submission
 *
 * - Post-Provider-Card-Generation:
 *   • The QuizActionCard provides options to download Provider Card and claim CME credits
 *
 * - Return visits:
 *   • Automatically shows all QuizActionCard options with Renew option
 *
 * @props {Object} quiz - formatted LMS quiz data
 * @props {string} uniqueID - Unique id for quiz logs feature to track each quiz attempt
 * @props {Object} activeCourse - Current course information
 */

const QuizScreen = ({ quiz, uniqueID, shuffle = true }) => {
  const navigate = useNavigate();
  const openSnackbar = useOpenSnackbar();
  const [endQuiz, setEndQuiz] = useState(false);
  const [start, setStart] = useState(false);
  const [questions, setQuestions] = useState(quiz.questions);
  const { id: userID } = useSelector((state) => state.account.user);
  const [myLearningData, setMyLearningData] = useState({});
  const { activeCourse, startQuiz, simulationStatus, activeCourseProgress } = useContext(LearningContext);
  const isACLS = activeCourse.id === 4526;
  const { user } = useSelector((state) => state.account);
  const { setActiveCertificateData} = useCertificatesContext();
  const [generatedCertificateID, setGeneratedCertificateID] = useState(null); // if cme certificate id exists in current order benefits
  const [generatedCertificatePath, setGeneratedCertificatePath] = useState(null); // if cme certificate id exists in current order benefits
  const [certificateGenerateError, setCertificateGenerateError] = useState(null); // error message for provider card generation

  // FETCH LEARNING DATA OF CURRENT ACTIVE COURSE - E.G. ORDER, PROVIDER CARD & CME CLAIM STATUS
  const fetchCourseMyLearningData = async () => {
    try {
      const myLearningData = await myLearningService.getCourseMyLearningData(userID, parseInt(activeCourse.id));
      setMyLearningData(myLearningData);
    } catch (error) {
      console.error('Error fetching My Learning Data: ', error);
      setMyLearningData({});
    }
  };

  useEffect(() => {
    fetchCourseMyLearningData();
  }, []);

  useEffect(() => {
  }, [activeCourseProgress]);

  React.useEffect(() => {
    if(simulationStatus=='done' && activeCourseProgress.isQuizCompleted && activeCourseProgress.progressPercentage>=80){
      setEndQuiz(true);
      generateProviderCard()
    }
  },[simulationStatus])

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
  }, [startQuiz]);

  // GO BACK TO REFERRER PAGE
  const handleBackLink = () => {
    navigate('/dashboard');
  };

  const shuffleQuestions = useCallback((questions) => {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions;
  }, []);

  const validateQuiz = (quiz) => {
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

  if (!validateQuiz(quiz)) {
    return null;
  }


  const generateProviderCard = async () => {
    if(myLearningData.providerCardData?.id) return;
      const payload = {
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        npi_number: user.npi_number || '',
        designation_id: user.designation_id || null,
        specialty: user.specialty || null,
        program: user.program || null,
        course_id: activeCourse.id + ''
      };
      let orderID=myLearningData.order.orderID
      try {
        const Certificate_Order = await RenewOrderServices.isOrderItemWithValidHash(activeCourse.id);
        payload['product_type'] = Certificate_Order.product_type;
  
        try {
          const res2 = await RenewOrderServices.getCertificateRenewalData(
            activeCourse.id
          );
          if (res2) {
            payload['certificiate_uid'] = res2[res2.length - 1].Certificate_UID;
          }
        } catch (error) {
          console.error('Error fetching Certificiate Renewal date: ', error);
        }
  
        const response = await LearningService.generateCertificate(payload);
  
        // Add Provider Card ID in benefits section for current order ID
        if (response) {
          await certificatesService.sendProviderCardEmail({ courseID: activeCourse.id, provider_card_link: response.filePath})
  
          // console.log('This is current id: ', currentOrderID)
          setGeneratedCertificatePath(response.filePath);
          setGeneratedCertificateID(response.certificate_id);
          // fetchClinicalCertificates();
  
          // LINK PROVIDER CARD WITH ORDER
          await orderServices.addBenefit(orderID, 'provider_card', parseInt(response.certificate_id));
        }
        if (response) {
          openSnackbar('Provider card generated successfully!');
        }
        setActiveCertificateData({ ...response, id: response.certificate_id });
      } catch (error) {
        console.error(error.error);
        setCertificateGenerateError(error.error);
        openSnackbar('Error generating provider card!. Please Contact Support', 'error');
      }
    };

  // COMMON PROPS FOR ACLS QUIZ ACTION PAGE & OTHER COURSES
  const CardProps = {
    isACLS: isACLS,
    currentOrder: myLearningData.order,
    hash: myLearningData.order?.hash,
    isCMEValid: myLearningData.order?.hasCME,
    activeCourse: activeCourse,
    certificateID: myLearningData.providerCardData?.id || generatedCertificateID,
    cmeID: myLearningData.cmeCertificateData?.id,
    providerCardPath: myLearningData.providerCardData?.path || generatedCertificatePath,
    cmePath: myLearningData.cmeCertificateData?.path,
    setEndQuiz: setEndQuiz,
    setStart: setStart,
    endQuiz: activeCourseProgress.isQuizCompleted||false,
    quizPassed: activeCourseProgress.isQuizCompleted||false,
    percentage: activeCourseProgress.progressPercentage,
    certificateGenerateError: certificateGenerateError,
  };

  // PROPS FOR QUIZ CONTENT PAGE
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
        (((myLearningData.providerCardData?.id ||
        myLearningData.cmeCertificateData?.id ||
        myLearningData.progressSummary.isCourseCompleted) && ((isACLS && simulationStatus=='done') || !isACLS)) ? (
          <QuizCompletion {...CardProps} />
        ) : (
          <Grid container justifyContent="center" spacing={2} sx={{ my: 2 }}>
            <Grid size={{ xs: 12, sm: isACLS ? 12 : 7 }}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  size="large"
                  onClick={handleBackLink}
                  startIcon={<BackIcon />}
                >
                  EXIT
                </Button>
              </Box>
            </Grid>
            {isACLS ? (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <QuizActionsCard {...CardProps} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <QuizSimulationCard setEndQuiz={setEndQuiz} endQuiz={false} />
                </Grid>
              </>
            ) : (
              <Grid size={{ xs: 12, sm: 7 }}>
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

QuizScreen.propTypes = {
  quiz: PropTypes.object,
  uniqueID: PropTypes.string,
  activeCourse: PropTypes.object,
  shuffle: PropTypes.bool
};

export default QuizScreen;
