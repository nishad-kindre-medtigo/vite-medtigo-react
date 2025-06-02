import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LearningContext } from '../../../../../../context/LearningContext';
import { useCertificatesContext } from '../../../../../../context/CertificatesContext';
import { checkAnswer, formatQuestionText } from '../utils';
import { teamhealthPlans, courseDetails } from '../data';
import learningService from '../../../../../../services/learningService';
import RenewOrderServices from '../../../../../../services/renewOrderService';
import orderServices from '../../../../../../services/orderServices';
import certificatesService from '../../../../../../services/certificatesService';
import { useOpenSnackbar } from '../../../../../../hooks/useOpenSnackbar';
import useBreakpoints from '../../../../../../hooks/useBreakpoints';
import { Box, Button, Grid, Typography } from '@mui/material';
import { KeyboardArrowRightRounded as Right, KeyboardArrowLeftRounded as Left, ChevronLeft as BackIcon } from '@mui/icons-material';
import { QuizProgress, renderQuizAnswerIcon, renderSelectedAnswersResult, renderTags, QuizHint, AnswerCheck, QuizResultFilter, CourseFeedbackPopup, QuizHintAccordion, MultipleChoiceText } from '../handlers';
import QuizSimulationCard from './QuizSimulationCard';
import QuizActionsCard from './QuizActionsCard';
import QuizCompletion from './QuizCompletion';

/**
 * @component QuizContent
 * @description Component for rendering quiz questions and handling quiz completion
 *
 * Displays interactive quiz questions for the currently active course and
 * shows appropriate QuizActionsCard upon completion with pass/fail outcomes.
 *
 * @hierarchy
 * - Child of: QuizScreen
 *
 * @flow
 * 1. User navigates through questions with "Back" and "Next" buttons
 * 2. Component activates when user clicks "Complete Requirement" on QuizActionsCard
 * 3. On completion, displays appropriate success or failure interface
 *
 * @behavior
 * - Success scenario:
 *   • Automatically generates provider card & calls provider card-order link API
 *   • Displays "Download Provider Card" and "Claim CME" on the QuizActionsCard based on course
 *
 * - Failure scenario:
 *   • Shows QuizActionsCard with "Retake Quiz" option
 *   • Shows Quiz Hints Section with Selected Option & Explanation text from LMS API
 *   • Clicking redirects user back to Quiz Start Page
 *
 * @props {Array} questions - Array of question objects with text and answer options
 * @props {string} uniqueID - Unique id for quiz logs feature to track each quiz attempt
 * @props {Object} quiz - formatted LMS quiz data
 * @props {boolean} endQuiz - State indicating if quiz is completed
 * @props {Function} setEndQuiz - State setter function for quiz completion status
 * @props {Function} setStart - Context State setter function to control quiz initiation
 *
 * @impact
 * - Reduced user friction for provider card generation by automating the old three step process.
 * - Eliminated support issues related to manual provider card creation.
 * - Enhanced user satisfaction by streamlining the course and quiz flow.
 */

const QuizContent = (props) => {
  const {questions, uniqueID, quiz, endQuiz, setStart, setEndQuiz} = props;

  // DEFAULT VALUES
  const navigate = useNavigate();
  const openSnackbar = useOpenSnackbar();
  const { isMobile } = useBreakpoints();
  const { user } = useSelector((state) => state.account);
  const { setActiveCertificateData, fetchClinicalCertificates, oldFullAccessOrder} = useCertificatesContext();
  const { activeCourseProgress, activeCourse, updateCourseProgress, fetchCourseProgress, startQuiz, setStartQuiz, userPlans, simulationStatus, setSimulationStatus, allowRedirectionRef } = useContext(LearningContext);
  const courseFullName = courseDetails.find((course) => course.id == activeCourse.id)?.full_name; // Displayed at the top of card
  const isACLS = activeCourse.id === 4526;

  // QUIZ ATTEMPT DATA STATE VALUES
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [question, setQuestion] = useState(questions[currentQuestionIndex]); // Store current question object from questions array
  const [selectedOption, setSelectedOption] = useState(null); // Store Selected Option for Question
  const [userInput, setUserInput] = useState([]); // Store User Selected Option/s in an Array
  const [answerSelectionTypeState, setAnswerSelectionType] = useState(undefined); // Store "single" or "multiple" type for the question
  const [incorrectAnswer, setIncorrectAnswer] = useState(false); // Is Answer InCorrect
  const [correctAnswer, setCorrectAnswer] = useState(false); // Is Answer Correct
  const [correct, setCorrect] = useState([]); // Store Array of Correct Answers
  const [incorrect, setIncorrect] = useState([]); // Store Array of Incorrect Answers
  const [buttons, setButtons] = useState({}); // Store button options indexes in a object with className: 'selected' for selected ones & disabled: true for disabled ones 
  const [newButtons, setNewButtons] = useState({}); // Track Each Question's Selected Button/s
  const [quizResponses, setQuizResponses] = useState({}); // Track Selected Option, is Option Correct, Question Number by User for each Question in Quiz
  
  // QUIZ UTILS STATE VALUES
  const [scrollEl, setScrollEl] = useState(); // Scroll to top after each question
  const [hideAlert, setHideAlert] = useState(false); // State to refresh page when clicked back from first question

  // QUIZ RESULT STATE VALUES
  const [isSubmitting, setIsSubmitting] = useState(false); // For Generate Certificate Drawer
  const [filteredValue, setFilteredValue] = useState('incorrect'); // Default to show incorrect answers in review questions
  const [currentOrder, setCurrentOrder] = useState(null); // Store current order for a course
  const [certificateID, setCertificateID] = useState(null); // If provider card id exists in current order benefits
  const [cmeID, setCMEID] = useState(null); // if cme certificate id exists in current order benefits
  const [generatedCertificateID, setGeneratedCertificateID] = useState(null); // if cme certificate id exists in current order benefits
  const [generatedCertificatePath, setGeneratedCertificatePath] = useState(null); // if cme certificate id exists in current order benefits
  const [hash, setHash] = useState(null); // hash value used for claim CME
  const [isCMEValid, setisCMEValid] = useState(null); // hash value used for claim CME
  const [certificateGenerateError, setCertificateGenerateError] = useState(null); // error message for provider card generation
  const [openFeedbackPopup, setOpenFeedbackPopup] = useState(false); // open course feedback popup after passing quiz
  
  // Quiz Percentage Calculation
  let percentage = activeCourseProgress.progressPercentage || (correct.length / questions.length) * 100;

  //! Quiz Hack - Uncomment this useEffect to enable quiz bypass
  // percentage = 90;
  // useEffect(() => {
  //   setEndQuiz(true);
  // }, []);

  let quizPassed = percentage >= 80;

  // add Question Response in quizResponses State
  const addQuestionResponse = (questionID, qNo, isCorrect, option) => {
    setQuizResponses((prevAttempts) => ({
      ...prevAttempts,
      [questionID]: { qNo, isCorrect, option }
    }));
  };

  // Store Buttons Selected as per User Attempt for each Question
  const addNewButtons = (questionID, newButtons) => {
    setNewButtons((prevAttempts) => ({
      ...prevAttempts,
      [questionID]: newButtons
    }));
  };

  // Back To Courses Button Click Logic
  const handleBackLink = () => {
    const backLink = localStorage.getItem('learning-path');
    if (backLink) {
      navigate(backLink);
    } else {
      navigate('/my-learning');
    }
  };

  // Store Current Order for Normal User & Place order for teamhealth user on Quiz Success
  // Store hash & isCMEValid for Claim CME Button
  // Store provider_card & cme_certificate ID is present in order_benefits
  const fetchOrderData = async () => {
    const isTeamHealthUser = user.email.split('@')[1] === 'teamhealth.com';
    let orderID; // orderID used for add Benefits API
    try {
      if (endQuiz && quizPassed && isTeamHealthUser) {
        const order_number = await orderServices.getRecentOrderNumber();
        const orderPlan = teamhealthPlans[activeCourse.id];
        const orderData = await orderServices.addOrderFromMarket({
          items: [orderPlan],
          order_number: order_number,
          bill_amount: 0,
          order_status: 'processing',
          email: user.email
        });

        // Store id of new order placed
        orderID = orderData.orders[0].id;

        // Validate the order access status
        const certificateOrder = await RenewOrderServices.isOrderItemWithValidHash(activeCourse.id);
        // console.log('certificateOrder: ', certificateOrder)

        // Set hash and related states
        setHash(certificateOrder.hash);
        setisCMEValid(certificateOrder.isCMEValid);
      } else {
        // Validate the order access status
        const certificateOrder = await RenewOrderServices.isOrderItemWithValidHash(activeCourse.id);
        // console.log('certificateOrder: ', certificateOrder)
        
        setHash(oldFullAccessOrder.hash || certificateOrder.hash);
        setisCMEValid(
          oldFullAccessOrder.isCMEValid || certificateOrder.isCMEValid
        );
      }

      const isOpioid = activeCourse.id == 11159;
      if (isOpioid) {
        setisCMEValid(true);
      }

      const allOrders = await orderServices.getOrderItemsDetailsForCourses(
        user.email
      );
      let currentOrder;
      if (user.email.includes('teamhealth')) {
        currentOrder = allOrders.find((order) => order.orderID == orderID);
      } else {
        currentOrder = allOrders
          .reverse()
          .find((order) => order.courseID == activeCourse.id);
      }

      // To Use Order information in Quiz Cards
      setCurrentOrder(currentOrder);

      // Store id of existing order for normal user
      if (!user.email.includes('teamhealth')) {
        orderID = currentOrder.orderID;
      }

      // Store if provider card id exists for current order
      if (currentOrder?.order_benefits?.provider_card) {
        setCertificateID(currentOrder.order_benefits.provider_card);
      }

      // Store if cme certificate id exists for current order
      if (currentOrder?.order_benefits?.cme_certificate) {
        setCMEID(currentOrder.order_benefits.cme_certificate);
      }
    } catch (error) {
      console.error('Error setting current order ID', error);
    }
    return orderID;
  };

  // Go to Next/ Previous Question using Keyboard Arrow Keys
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      backQuestion(currentQuestionIndex);
    } else if (event.key === 'ArrowRight') {
      if (quizResponses[question.questionID]?.option) {
        nextQuestion(currentQuestionIndex);
        addQuizLog(question);
      }
    }
  };

  // Attach the `onKeyDown` handler to the document
  document.onkeydown = handleKeyDown;

  useEffect(() => {
    if (scrollEl) {
      scrollEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scrollEl]);

  useEffect(() => {
    setQuestion(questions[currentQuestionIndex]);
  }, [currentQuestionIndex]);
  
  useEffect(() => {
  }, [simulationStatus,activeCourseProgress]);

  useEffect(() => {
    if (scrollEl) {
      scrollEl.scrollIntoView({ behavior: 'smooth' });
    }
    let { answerSelectionType } = question;
    // Default single to avoid code breaking due to automatic version upgrade
    setAnswerSelectionType(answerSelectionType || 'single');
  }, [question, currentQuestionIndex]);

  // Handle 'beforeunload' for page refresh or close
  const handleBeforeUnload = (e) => {
    if (!endQuiz && !allowRedirectionRef.current) {
      e.preventDefault();
      e.returnValue = ''; // Trigger the browser's generic confirmation dialog
    }
  };

  // Handle back button logic
  const handleBackButtonEvent = (e) => {
    if (
      window.confirm(
        'If you go back, your progress will be lost. Are you sure you want to go back?'
      )
    ) {
      const backLink = localStorage.getItem('learning-path');
      if (backLink) {
        navigate(backLink);
      } else {
        navigate('/my-learning');
      }
    }
  };

  // Add and remove event listeners based on the quiz state
  useEffect(() => {
    // Add 'beforeunload' listener
    const beforeUnloadListener = (e) => handleBeforeUnload(e);
    const popstateListener = (e) => handleBackButtonEvent(e);

    if (startQuiz && !hideAlert) {
      window.addEventListener('beforeunload', beforeUnloadListener);
    }

    // Add the popstate event listener for back button
    window.addEventListener('popstate', popstateListener);

    // Cleanup both listeners on unmount
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadListener);
      window.removeEventListener('popstate', popstateListener);
    };
  }, [startQuiz, hideAlert]); // Depend on `endQuiz`

  const runQuizComplete = async () => {
    try {
      setIsSubmitting(true);

      const orderID = await fetchOrderData();
      // console.log('currentOrderID: ', orderID);

      // Generate Provider card on quiz success only if certificate ID does not exist for current order
      if (endQuiz && !certificateID) {
        setStartQuiz(false);
        if (quizPassed) {
          await updateCourseProgress('0000', activeCourse.id);

          // FETCH CONNECT COURSE PROGRESS TO UPDATE COURSE STEPPER - TO HIGHLIGHT LAST STEP
          await fetchCourseProgress(user.id, activeCourse.id);
          
          // LINK QUIZ UNIQUE ID WITH ORDER
          await orderServices.addOrderQuizIDLink(orderID, uniqueID);

          const hasProviderCard = ![11159, 192797].includes(parseInt(activeCourse.id));
          if (hasProviderCard) {
            // Mandatory Course Feedback Popup after passing quiz for provider card courses
            setOpenFeedbackPopup(true);
            if (isACLS) {
              if ((simulationStatus=='done' || userPlans.acls == 'basic' || userPlans.acls == 'standard')) {
                await generateProviderCard(orderID);
              }
            } else await generateProviderCard(orderID); // Ensure this is awaited if it's async
          }
        }
      }
    } catch (error) {
      console.error('Error in runQuizComplete:', error);
      // Optionally, show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  // Run Generate Certificate When Quiz Passed
  useEffect(() => {
    const handleQuizCompletion = async () => {
      await runQuizComplete(); // Await if it's async
    };
  
    handleQuizCompletion();
  }, [endQuiz, simulationStatus]);

  useEffect(() => {
  }, [isSubmitting, generatedCertificatePath]); 

  useEffect(()=>{
    setSimulationStatus(() => userPlans.acls != 'best_value' ? 'done' : simulationStatus);

  },[userPlans])

  // Go to Next Question
  const nextQuestion = (currentQuestionIndex) => {
    setIncorrectAnswer(false);
    setCorrectAnswer(false);
    setButtons({});

    if (currentQuestionIndex + 1 === questions.length) {
      setEndQuiz(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Go Back to Previous Question
  const backQuestion = (currentQuestionIndex) => {
    if (currentQuestionIndex === 0) {
      if (
        window.confirm(
          'Clicking back button will take you back to the Start Quiz page. Your progress will be lost. Are you sure you want to go back?'
        )
      ) {
        setHideAlert(true);
        setTimeout(() => window.location.reload(), 500);
      }
      return;
    }
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  // Return true or false for quiz question option by comparing it to the correctAnswer variable in the question object
  const getAnswerCorrectStatus = (correctAnswer, isMultiSelect, optionIndex) => {
    let isAnswerCorrect = false;

    // For Multi-Select questions check existence of option in correctAnswer array
    if(isMultiSelect){
      isAnswerCorrect = correctAnswer.includes(optionIndex);
    } else {
      isAnswerCorrect = `${optionIndex}` === correctAnswer;
    }

    return isAnswerCorrect
  }

  // Display Review Questions Component with Quiz Question & correct answer
  // This "filteredValue" displays All/ Correct / Incorrect Questions whihc can be changed by a select dropdown
  const renderQuizResultQuestions = (filteredValue) => {
    let filteredQuestions;
    let filteredUserInput;

    if (filteredValue !== 'all') {
      if (filteredValue === 'correct') {
        filteredQuestions = questions.filter(
          (question, index) => correct.indexOf(index) !== -1
        );
        filteredUserInput = userInput.filter(
          (input, index) => correct.indexOf(index) !== -1
        );
      } else {
        filteredQuestions = questions.filter(
          (question, index) => incorrect.indexOf(index) !== -1
        );
        filteredUserInput = userInput.filter(
          (input, index) => incorrect.indexOf(index) !== -1
        );
      }
    }
    return (filteredQuestions ? filteredQuestions : questions).map(
      (question, index) => {
        const userInputIndex = filteredUserInput
          ? filteredUserInput[index]
          : userInput[index];

        // Default single to avoid code breaking due to automatic version upgrade
        let answerSelectionType = question.answerSelectionType || 'single';

        // This will display hint for only those questions where the selected option is incorrect
        // Change the filteredValue to "all" to display all responses - currently set as "incorrect"
        return (
          <div key={index + 1}>
            <h3
              className="question-text"
              dangerouslySetInnerHTML={{
                __html: formatQuestionText(question.question),
              }}
            />
            {question && question.questionPic && (
              <img src={question.questionPic} alt="image" />
            )}
            {question &&
              renderTags(
                answerSelectionType,
                question.correctAnswer.length,
                question.segment
              )}
            <Box sx={{ border: '1px solid #C8C8C8', p: 3, borderRadius: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  textAlign: 'left'
                }}
              >
                Options:{' '}
              </div>
              <div className="result-answer">
                {renderSelectedAnswersResult(question, userInputIndex)}
              </div>
              {answerSelectionType === 'multiple' && <MultipleChoiceText />}
              <QuizHint question={question}/>
            </Box>
          </div>
        );
      }
    );
  };

  // Display Quiz Question Answers/ Options
  const renderAnswers = (question, buttons, newButtons) => {
    const { answers, correctAnswer, questionType } = question;
    let { answerSelectionType } = question; // single or multiple

    const onClickAnswer = async (index) => {
      checkAnswer(
        index + 1,
        correctAnswer,
        answerSelectionType,
        question,
        addQuestionResponse,
        addNewButtons,
        {
          userInput, // Selected Option/s by User in an Array
          currentQuestionIndex, // Index of Current Question Start from 0
          incorrect, // Array Containing Index of Questions Answered Incorrectly
          correct, // Array Containing Index of Questions Answered Correctly
          setButtons,
          setCorrectAnswer, // Set Correct Answer State for Current Question
          setIncorrectAnswer, // Set Incorrect Answer State for Current Question
          setCorrect, // Set Array of Correct Answers
          setIncorrect, // Set Array of Incorrect Answers
          setUserInput, // Set User Selected Option/s in an Array
        }
      );
      setSelectedOption(index + 1); // Store Selected Option for Question

      // console.log('Question:', question);
      // console.log('User Input:', userInput);
      // console.log('Current Question Index:', currentQuestionIndex);
      // console.log('Is Answer Correct:', !incorrectAnswer);
      // console.log('Incorrect Answers:', incorrect);
      // console.log('Correct Answers:', correct);
      // console.log('Selected Option:', index + 1);
    };

    // console.log('Current Buttons: ', newButtons[question.questionID]);

    // Get Selected Buttons for Current Question if exists else use default buttons state for question
    const currentButtons = newButtons[question.questionID] || buttons;

    // Default single to avoid code breaking due to automatic version upgrade
    answerSelectionType = answerSelectionType || 'single';
    const isMultiSelect = answerSelectionType !== 'single';

    return answers.map((answer, index) => {

      //! ONLY FOR DEVELOPMENT & TESTING PURPOSE - DONT USE THIS FOR PROD
      //? THIS HIGHLIGHTS QUIZ QUESTION OPTIONS AS GREEN/ RED BASED ON ITS STATUS
      const isAnswerCorrect = getAnswerCorrectStatus(correctAnswer, isMultiSelect, index + 1);
      const isAnswerSeleted = currentButtons[index]?.className === 'selected' || false;

      return (
        <button
          key={index}
          className={`${currentButtons[index]?.className} answerBtn btn ${answerSelectionType} ${isAnswerCorrect}`}
          onClick={() => onClickAnswer(index)}
        >
          {renderQuizAnswerIcon(isMultiSelect, isAnswerSeleted)}
          {questionType === 'text' && <span>{answer}</span>}
          {questionType === 'photo' && <img src={answer} alt="image" />}
        </button>
      );
    });
  };

  // Store Individual Quiz Question & Answer Log in QuizLogs Table
  const addQuizLog = async (question) => {
    const isAnswerCorrect = !incorrectAnswer;
    const quizLog = {
      uniqueID: uniqueID,
      userID: user.id,
      courseID: activeCourse.id,
      questionID: question.questionID,
      selectedOption: selectedOption,
      correct: isAnswerCorrect
    };

    await learningService.addQuizLog(quizLog);
  };

  // Certificate Generate API call
  const generateProviderCard = async (orderID) => {
    const payload = {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      npi_number: user.npi_number || '',
      designation_id: user.designation_id || null,
      specialty: user.specialty || null,
      program: user.program || null,
      course_id: activeCourse.id + ''
    };

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

      const response = await learningService.generateCertificate(payload);

      // Add Provider Card ID in benefits section for current order ID
      if (response) {
        await certificatesService.sendProviderCardEmail({ courseID: activeCourse.id, provider_card_link: response.filePath})

        // console.log('This is current id: ', currentOrderID)
        setGeneratedCertificatePath(response.filePath);
        setGeneratedCertificateID(response.certificate_id);
        fetchClinicalCertificates();

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

  const goToPreviousQuestion = () => backQuestion(currentQuestionIndex);

  const goToNextQuestion = () => {
    nextQuestion(currentQuestionIndex);
    addQuizLog(question);
  }

  const CardProps = {
    quizPassed: quizPassed,
    isACLS: isACLS,
    currentOrder: currentOrder,
    hash: hash,
    isCMEValid: isCMEValid,
    generatedCertificateID: generatedCertificateID,
    activeCourse: activeCourse,
    certificateID: certificateID,
    cmeID: cmeID,
    providerCardPath: generatedCertificatePath,
    loading: isSubmitting,
    setEndQuiz: setEndQuiz,
    endQuiz: true,
    percentage: percentage,
    setStart: setStart,
    certificateGenerateError: certificateGenerateError,
  };

  // Return Quiz Complete Page
  if (endQuiz) {
    return (quizPassed && ((isACLS && simulationStatus=='done') || !isACLS)) ? (
      <>
        <QuizCompletion {...CardProps} />
        <CourseFeedbackPopup open={openFeedbackPopup} setOpen={setOpenFeedbackPopup} />
      </>
    ) : (
      <div>
        <Grid
          container
          justifyContent="center"
          columnSpacing={2}
          rowSpacing={0.5}
        >
          <Grid item xs={12} sx={isACLS ? 12 : 7}>
             <Box display="flex" justifyContent="flex-end">
               <Button
                 size="large"
                 disabled={isSubmitting}
                 onClick={handleBackLink}
                 startIcon={<BackIcon />}
               >
                 EXIT
               </Button>
             </Box>
            </Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={12} sm={isACLS ? 6 : 7}>
            <QuizActionsCard {...CardProps} />
          </Grid>

          {/* DISPLAY QUIZ HINT ACCORDION ONLY FOR MOBILE VIEW  */}
          {isMobile && percentage < 80 && (
            <Grid item xs={12}>
              <QuizHintAccordion>
                {renderQuizResultQuestions(filteredValue)}
              </QuizHintAccordion>
            </Grid>
          )}
          {isACLS && (
            <Grid item xs={12} sm={6}>
              <QuizSimulationCard
                setEndQuiz={setEndQuiz}
                endQuiz={false}
                setStart={setStart}
              />
            </Grid>
          )}
          {/* QUIZ HINT SECTION FOR LAPTOP VIEW  */}
          {!isMobile && percentage < 80 && (
            <Grid item xs={12} sm={isACLS ? 12 : 10}>
              <Typography
                sx={{
                  fontWeight: 600,
                  my: 2,
                  fontSize: '22px',
                  textAlign: 'left'
                }}
              >
                Quiz Questions and Hints to Help You Find the Right Answer.
              </Typography>

              {/* ONLY FOR DEVELOPMENT & TESTING PURPOSE - DONT USE THIS FOR PROD */}
              {/* UNCOMMENT THIS LINE TO DISPLAY SELECT FIELD WHICH FILTERS CORRECT/ INCORRECT ANSWER RESPONSES */}
              {/* <QuizResultFilter filteredValue={filteredValue} setFilteredValue={setFilteredValue} /> */}

              {renderQuizResultQuestions(filteredValue)}
            </Grid>
          )}
        </Grid>
      </div>
    );
  }

  // Return Quiz Question & Answers Page
  return (
    <Box ref={(ref) => setScrollEl(ref)} sx={quizBoxSx}>
      {/* Quiz Title */}
      <div>
        <Typography sx={{ fontSize: { xs: '18px', sm: '24px' }, mt: 1, fontWeight: 600}}>{courseFullName}</Typography>
        <QuizProgress
          currentQuestionIndex={currentQuestionIndex}
          quiz={quiz}
          endQuiz={endQuiz}
        />
      </div>

      {/* Quiz Question & Answers */}
      <div className="questionWrapperBody">
        <h3 style={{ textAlign: 'left', fontSize: '17px' }}>
          Q{currentQuestionIndex + 1}:&nbsp;
          {question && (
            <span
              dangerouslySetInnerHTML={{
                __html: formatQuestionText(question.question),
              }}
            />
          )}
        </h3>
        {question && question.questionPic && (
          <img src={question.questionPic} alt="image" />
        )}
        {question &&
          renderTags(
            answerSelectionTypeState,
            question.correctAnswer.length,
            question.segment
          )}
        {question && renderAnswers(question, buttons, newButtons)}

        {/* ONLY FOR DEVELOPMENT & TESTING PURPOSE - DONT USE THIS FOR PROD */}
        {/* UNCOMMENT THIS LINE TO DISPLAY INSTANT CORRECT/INCORRECT STATUS OF SELECTED OPTION FOR A QUZI QUESTION */}
        {/* {question && <AnswerCheck incorrectAnswer={incorrectAnswer} correctAnswer={correctAnswer} question={question} />} */}

        <Box sx={questionNavigationSx}>
          <Button
            variant="outlined"
            onClick={goToPreviousQuestion}
            startIcon={<Left />}
          >
            BACK
          </Button>
          <Button
            variant="contained"
            onClick={goToNextQuestion}
            disabled={!quizResponses[question.questionID]?.option} // Disable Next Button if User has not selected any option for current question
            endIcon={<Right />}
          >
            NEXT
          </Button>
        </Box>
      </div>
    </Box>
  );
};

const quizBoxSx = {
  display: 'flex',
  width: { xs: '95%', sm: '80%'},
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center'
};

const questionNavigationSx = {
  mt: 2,
  mb: 1,
  display: 'flex',
  gap: '12px',
  justifyContent: 'flex-end',
  width: '100%',
}

export default QuizContent;
