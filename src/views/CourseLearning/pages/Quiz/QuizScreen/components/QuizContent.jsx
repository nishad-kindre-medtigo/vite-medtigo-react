import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LearningContext } from 'src/context/LearningContext';
import { useCertificatesContext } from 'src/context/CertificatesContext';
import { checkAnswer, formatQuestionText } from '../utils';
import { teamhealthPlans, courseDetails } from '../data';
import learningService from 'src/services/learningService';
import orderServices from 'src/services/orderServices';
import certificatesService from 'src/services/certificatesService';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import useBreakpoints from 'src/hooks/useBreakpoints';
import { Box, Button, Grid, Typography } from '@mui/material';
import { KeyboardArrowRightRounded as Right, KeyboardArrowLeftRounded as Left, ChevronLeft as BackIcon } from '@mui/icons-material';
import { QuizProgress, renderQuizAnswerIcon, renderSelectedAnswersResult, renderTags, QuizHint, AnswerCheck, QuizResultFilter, CourseFeedbackPopup, QuizHintAccordion, MultipleChoiceText, ExitButton } from '../handlers';
import QuizSimulationCard from './QuizSimulationCard';
import QuizActionsCard from './QuizActionsCard';
import QuizCompletion from './QuizCompletion';

/**
 * @component QuizContent
 * @description Component for rendering quiz questions and handling quiz completion
 *
 * @summary
 * Displays Quiz Questions and Answers, allows users to navigate through questions,
 * and handles quiz completion logic.
 * When the quiz is completed, it checks if the user passed or failed based on their score.
 * If the user passes, it generates a provider card and displays the QuizCompletion component.
 * If the user fails, it shows the QuizActionsCard with options to retake the quiz and review answers.
 *
 * @hierarchy
 * - Child of: QuizScreen
 * - Parent of: QuizActionsCard, QuizCompletion, QuizSimulationCard
 *
 * @flow
 * 1. User navigates through questions with "Back" and "Next" buttons
 * 2. User selects answers for each question
 * 3. On completion, the component checks the user's score
 * 4. If the user passes, it generates provider card and displays the QuizCompletion component
 * 5. If the user fails, it displays the QuizActionsCard with options to retake the quiz and review answers
 * 6. The component also handles quiz logs and user input tracking
 *
 * @behavior
 * - Success scenario:
 *   • Automatically generates provider card & calls provider card-order link API, quizID order link API
 *   • Displays mandatory Course Feedback Popup after passing quiz
 *   • Displays QuizCompletion with provider card, CME certificate, and course completion details
 *
 * - Failure scenario:
 *   • Shows QuizActionsCard with "Retake Quiz" option & quiz score
 *   • Shows Quiz Hints Section with Selected Option & Explanation text from LMS API
 *   • Clicking "Retake Quiz" redirects user back to Quiz Start Page
 *
 * @props {Array} questions - Array of question objects with text and answer options
 * @props {string} uniqueID - Unique id for quiz logs feature to track each quiz attempt
 * @props {Object} quiz - formatted LMS quiz data
 * @props {boolean} endQuiz - State indicating if quiz is completed
 * @props {Function} setStart - State setter function to control quiz initiation
 * @props {Function} setEndQuiz - State setter function for quiz completion status
 *
 * @impact
 * - Reduced user friction for provider card generation by automating the old three step process.
 * - Eliminated support issues related to manual provider card creation.
 * - Enhanced user satisfaction by streamlining the course and quiz flow.
 * - New Mail Notification for provider card generation errors.
 */

const QuizContent = (props) => {
  const {questions, uniqueID, quiz, endQuiz, setStart, setEndQuiz} = props;

  // DEFAULT VALUES
  const navigate = useNavigate();
  const openSnackbar = useOpenSnackbar();
  const { isMobile } = useBreakpoints();
  const { user } = useSelector((state) => state.account);
  const { fetchClinicalCertificates} = useCertificatesContext();
  const { activeCourse, updateCourseProgress, fetchCourseProgress, startQuiz, setStartQuiz, userPlans, simulationStatus, setSimulationStatus, allowRedirectionRef } = useContext(LearningContext);
  const courseFullName = courseDetails.find((course) => course.id == activeCourse.id)?.full_name; // Displayed at the top of card
  const isACLS = activeCourse.id === 4526;
  const isTeamHealthUser = user.email.split('@')[1] === 'teamhealth.com';
  const showSimulationCard = (isTeamHealthUser && isACLS) || (isACLS && userPlans.acls == 'best_value');
  const showHintData = [4526, 9985, 9238].includes(activeCourse.id); // Hints shown only for ACLS, BLS & PALS
  const hasProviderCard = ![11159, 192797, 130360].includes(parseInt(activeCourse.id)); // To run generateProviderCard API

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

  const isLastQuestion = currentQuestionIndex + 1 === questions.length; // Check if current question is last question in quiz
  const exitButtonGrid = isACLS ? (isTeamHealthUser ? 12 : currentOrder?.hasCME ? 12 : 6) : 6;

  // Quiz Percentage Calculation
  let percentage = (correct.length / questions.length) * 100;

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

  // Place order for teamhealth user on Quiz Success
  const placeOrderForTeamHealthUser = async () => {
    // Prevent placing order for ECG
    if(activeCourse.id == 130360) return;

    const order_number = await orderServices.getRecentOrderNumber();
    const orderPlan = teamhealthPlans[activeCourse.id];
    await orderServices.addOrderFromMarket({
      items: [orderPlan],
      order_number: order_number,
      bill_amount: 0,
      order_status: 'processing',
      email: user.email
    });
  };

  // Fetch Current Order Details for a Course
  const fetchCurrentOrderDetails = async () => {
    let latestOrderID; // orderID used for add Benefits API
    try {
      const latestOrder = await orderServices.getCourseLatestOrder(activeCourse.id);
      console.log(latestOrder);
      if (latestOrder) {
        const { orderID, hash, hasCME, order_benefits } = latestOrder;
        latestOrderID = orderID;

        setCurrentOrder(latestOrder);

        // Store Hash & CME Validity for Claim CME Button
        setHash(hash);
        setisCMEValid(hasCME);

        // Store if provider card id exists for current order
        setCertificateID(order_benefits?.provider_card);

        // Store if cme certificate id exists for current order
        setCMEID(order_benefits?.cme_certificate);
      }
    } catch (error) {
      console.error('Error setting current order ID', error);
    }
    return latestOrderID;
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
  }, [startQuiz, hideAlert]); // Depend on `startQuiz` context value

  const runQuizComplete = async () => {
    try {
      setIsSubmitting(true);

      if (endQuiz && quizPassed && isTeamHealthUser) {
        await placeOrderForTeamHealthUser();
      }

      const orderID = await fetchCurrentOrderDetails();
      // console.log('currentOrderID: ', orderID);

      // Generate Provider card on quiz success only if certificate ID does not exist for current order
      if (endQuiz && !certificateID) {
        setStartQuiz(false);
        if (quizPassed) {
          // Mandatory Course Feedback Popup after passing quiz
          setOpenFeedbackPopup(true);

          // ADD QUIZ LESSON ENTRY IN USERPROGRESS TABLE
          updateCourseProgress('0000', activeCourse.id);

          // FETCH CONNECT COURSE PROGRESS TO UPDATE COURSE STEPPER - TO HIGHLIGHT LAST STEP
          fetchCourseProgress(user.id, activeCourse.id);
          
          // LINK QUIZ UNIQUE ID WITH ORDER
          orderServices.addOrderQuizIDLink(orderID, uniqueID);

          if (hasProviderCard) {
            await generateProviderCard(orderID);
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

  useEffect(()=>{
    setSimulationStatus(() => userPlans.acls != 'best_value' ? 'done' : isACLS && isMobile ? 'done': simulationStatus);
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
    return (
      <div className="questionBox">
        {
        (filteredQuestions ? filteredQuestions : questions).map(
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
                  <img src={question.questionPic} alt="question image" />
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
        )
        }
      </div>
    ) 
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
          {questionType === 'photo' && <img src={answer} alt="question image" />}
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
      course_id: activeCourse.id + '',
      orderID: orderID
    };

    try {
      let productType = 'basic';
      if([4526, 9985, 9238].includes(parseInt(activeCourse.id))){
        productType = currentOrder?.plan || 'basic';
      }
      payload['product_type'] = productType;

      const response = await learningService.generateCertificate(payload);

      // Add Provider Card ID in benefits section for current order ID
      if (response) {
        // console.log('This is current id: ', currentOrderID)
        setGeneratedCertificatePath(response.filePath);
        setGeneratedCertificateID(response.certificate_id);
        fetchClinicalCertificates();

        // Send Provider Card Mail to User
        await certificatesService.sendProviderCardEmail({ courseID: activeCourse.id, provider_card_link: response.filePath});

        // LINK PROVIDER CARD WITH ORDER
        await orderServices.addBenefit(orderID, 'provider_card', parseInt(response.certificate_id));
        openSnackbar('Provider card generated successfully!');
      }
    } catch (error) {
      console.error(error.error);
      setCertificateGenerateError(error.error);

      const payload = {
        courseID: activeCourse.id,
        uniqueID,
        errorMessage: error.error
      }
      await certificatesService.sendGenerateCertificateErrorMail(payload);
      openSnackbar('Error generating provider card!. Please Contact Support', 'error');
    }
  };

  const goToPreviousQuestion = () => backQuestion(currentQuestionIndex);

  const goToNextQuestion = () => {
    nextQuestion(currentQuestionIndex);
    addQuizLog(question);
  }

  const CardProps = {
    parent: 'QuizContent',
    isTeamHealthUser: isTeamHealthUser,
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
    return quizPassed ? (
      <>
        <QuizCompletion {...CardProps} />
        <CourseFeedbackPopup
          open={openFeedbackPopup}
          setOpen={setOpenFeedbackPopup}
          courseID={activeCourse.id}
          percentage={percentage}
        />
      </>
    ) : (
      <Grid container justifyContent="center" spacing={2} sx={{ my: 2 }}>
        <Grid size={12} sm={exitButtonGrid}>
          <ExitButton disabled={isSubmitting} onClick={handleBackLink} />
        </Grid>
        <Grid size={12}></Grid>
        {showSimulationCard ? (
          <Grid size={{ xs: 12, sm: 6 }}>
            <QuizSimulationCard parent="QuizContent" endQuiz={false} />
          </Grid>
        ) : null}
        <Grid size={{ xs: 12, sm: 6 }}>
          <QuizActionsCard {...CardProps} />
        </Grid>

        {/* DISPLAY QUIZ HINT ACCORDION ONLY FOR MOBILE VIEW  */}
        {isMobile && percentage < 80 && (
          <Grid size={12}>
            <QuizHintAccordion>
              {renderQuizResultQuestions(filteredValue)}
            </QuizHintAccordion>
          </Grid>
        )}

        {/* QUIZ HINT SECTION FOR LAPTOP VIEW  */}
        {!isMobile && percentage < 80 && (
          <Grid size={{ xs: 12, sm: isACLS ? 12 : 10 }}>
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
    );
  }

  // Return Quiz Question & Answers Page
  return (
    <Box ref={(ref) => setScrollEl(ref)} sx={quizBoxSx}>
      {/* Quiz Title */}
      <div>
        <Typography sx={{ fontSize: { xs: '18px', sm: '24px' }, mt: 2, fontWeight: 600}}>{courseFullName}</Typography>
        <QuizProgress
          currentQuestionIndex={currentQuestionIndex}
          quiz={quiz}
          endQuiz={endQuiz}
        />
      </div>

      {/* Quiz Question & Answers */}
      <div className="questionWrapperBody questionBox">
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
            {isLastQuestion ? 'SUBMIT' : 'NEXT'}
          </Button>
        </Box>
      </div>
    </Box>
  );
};

/**
 * Certificate Generation Schema
 * This schema validates the user inputs for generating a certificate.
 * Fields and their validation rules:
 * 
 * - first_name: 
 *   - Type: String
 *   - Constraints: Minimum 1 character, Maximum 50 characters
 *   - Required: Yes
 *   - Error Message: "Please enter a valid first name"
 * 
 * - last_name: 
 *   - Type: String
 *   - Constraints: Minimum 1 character, Maximum 50 characters
 *   - Required: Yes
 *   - Error Message: "Please enter a valid last name"
 * 
 * - course_id: 
 *   - Type: String
 *   - Required: Yes
 *   - Error Message: "Course ID is required"
 * 
 * - designation_id: 
 *   - Type: String
 *   - Constraints: Minimum 19 characters, Numeric only
 *   - Required: Yes
 *   - Error Message: "Provide a valid designation id"
 * 
 * - npi_number: 
 *   - Type: Any
 *   - Required: No (Optional)
 *   - Additional Notes: Can be empty or null
 * 
 * - specialty: 
 *   - Type: String
 *   - Required: No (Optional)
 *   - Additional Notes: Can be empty or null
 * 
 * - program: 
 *   - Type: String
 *   - Required: No (Optional)
 *   - Additional Notes: Can be empty or null
 * 
 * - certificiate_uid: 
 *   - Type: String
 *   - Required: No (Optional)
 *   - Additional Notes: Can be empty or null
 * 
 * - product_type: 
 *   - Type: String
 *   - Required: No (Optional)
 *   - Additional Notes: Can be empty or null
 */


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
