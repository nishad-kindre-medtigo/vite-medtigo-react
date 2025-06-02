import React, { useState, useContext } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import useBreakpoints from '../../../../../../hooks/useBreakpoints';
// import { useOpenSnackbar } from '../hooks/useOpenSnackbar';
import { LearningContext } from '../../../../../../context/LearningContext';
import Confetti from 'react-dom-confetti';
import { courseDetails, config } from '../data';
import ExplorePlansDialog from '../../../../../Acquisition/MyLearning/dialogs/ExplorePlansDialog';
import RetakeCourseDialog from '../../../../../Acquisition/MyLearning/dialogs/RetakeCourseDialog';
import { AutoProviderCardBox, APIErrorMessage } from '../handlers';
import CompleteIcon from '@mui/icons-material/CheckCircle';

/**
 * @component QuizActionsCard
 * @description Component for handling quiz actions such as starting, ending, or retaking the quiz.
 * 
 * Displays buttons and dynamic content based on the quiz state, such as "Start Quiz," "Retake Quiz," 
 * or post-quiz actions like downloading the provider card and claiming CME credits.
 * 
 * @hierarchy
 * - Child of: QuizScreen, QuizContent
 * 
 * @flow
 * 1. The user interacts with the component to start the quiz.
 * 2. On quiz completion, the component dynamically updates to display pass or fail actions.
 * 3. If the user revisits the course quiz page, the component defaults to displaying "Renew" & other options.
 * 
 * @behavior
 * - Before Provider Card Generation:
 *   • Displays "Complete Requirement" button.
 *   • Starts the Quiz & displays Quiz Content upon clicking button.
 * 
 * - After Quiz Pass:
 *   • Displays User Score & congratulations message with oconfetti burst.
 *   • Displays "Download Provider Card" & "Claim CME" buttons based on current course & plan.
 * 
 * - After Quiz Fail:
 *   • Displays User Score with passing criteria.
 *   • Displays "Retake Quiz" button.
 *   • Redirects to Complete Requirement Screen upon clicking button.
 * 
 * - Revisiting Quiz Page:
 *   • Displays button "Download Provider Card" with message conveying user to renew the course to regain access to quiz.
 *   • "Claim CME" or "Download Claimed CME" button displayed conditionally.
 *   • "Renew" button displayed opening the Explore Plans popup for courses other than Opioid & NIHSS.
 *   • For Teamhealth user similar Renew course popup is displayed.
 * 
 * @props {Object} currentOrder - Details of the current course order.
 * @props {string} hash - Hash value for individual order for cme claim purpose.
 * @props {boolean} isACLS - Indicates whether the course is ACLS.
 * @props {boolean} isCMEValid - Indicates if the CME is valid for the course.
 * @props {Object} activeCourse - Information about the currently active course.
 * @props {string} certificateID - ID of provider card which is currently generated or linked with order.
 * @props {string} cmeID - ID of cme certificate which is currently generated or linked with order.
 * @props {string} providerCardPath - Path for downloading the provider card.
 * @props {string} cmePath - Path for downloading the CME certificate.
 * @props {boolean} loading - State indicating if the component is in a loading state.
 * @props {Function} setEndQuiz - State setter function to update the quiz completion status.
 * @props {boolean} endQuiz - State indicating whether the quiz has ended.
 * @props {number} percentage - Score of Quiz.
 * @props {Function} setStart - State setter function to initiate the quiz.
 * @props {string} certificateGenerateError - Error message from failure of genreateCertificate API.
 */

const QuizActionsCard = (props) => {
  const { quizPassed, currentOrder, hash, isCMEValid, activeCourse, certificateID, cmeID, providerCardPath, cmePath, loading, setEndQuiz, endQuiz, setStart, percentage, certificateGenerateError = '' } = props;

  const { setStartQuiz, activeCourseProgress: courseProgress,userPlans, simulationStatus, setSimulationStatus, } = useContext(LearningContext);
  const { isMobile } = useBreakpoints();
  
  const [startConfetti, setStartConfetti] = useState(false); // start confetti when quiz passed
  const isOrderTypeFullAccess = currentOrder?.order_type == "Full_Access";
  const courseID = activeCourse.id;

  const isOpioid = courseID === 11159;
  const isNIHSS = courseID === 192797;
  const isACLS = activeCourse.id === 4526;

  let isCourseCompleted = false;

  // ONLY FOR OPIOID & NIHSS AFTER PASSING QUIZ AND USER HASNT CLAIMED CME WHILE RETURNING TO COURSE PAGE
  if(isOpioid || isNIHSS && !quizPassed){
    isCourseCompleted = courseProgress.isCourseCompleted
  }

  const courseFullName = courseDetails.find(course => course.id == courseID)?.full_name; // Displayed at the top of card

  // Start Quiz or Retake Quiz 
  const handleAttemptQuiz = () => {
    if (!quizPassed && endQuiz) {
      window.location.reload();
    } else {
    setEndQuiz(false);
    setStart(true); // To Start Quiz by changing local state value
    setStartQuiz(true); // Set startQuiz Context value to true for disabling navigation
    }
  };
  
  const totalQuestionsCount = isOpioid ? 24 : isNIHSS ? 25 : 50;
  const passingQuestionsCount = (isOpioid || isNIHSS) ? 20 : 40;
  const passingCriteria = isOpioid ? "20 out of 24" : isNIHSS ? "20 out of 25" : "40 out of 50";

  const quizTitle = quizPassed
    ? 'Congratulations'
    : isCourseCompleted
      ? 'Quiz Completed'
      : endQuiz
        ? 'Try Again'
        : certificateID || cmeID
          ? 'Quiz Completed'
          : 'Take Quiz';

  const quizNote =
    isOpioid || isNIHSS
      ? cmeID
        ? 'Note: You can only claim CME credits once per order'
        : 'Note: You can claim CME by filling form'
        : (isACLS && userPlans.acls == 'best_value' && simulationStatus != 'done')
        ? 'Note: Need to Complete Simulation to get Provider Card'
        : certificateID
          ? 'Note: You can only generate provider card once per order'
          : providerCardPath
            ? 'Note: Your Provider Card has been generated'
            : 'Generating Provider Card...';

  // console.log("Debug Info:", { isCMEValid, hash, cmeID, CMECourse, activeCourse, certificateID, cmeLink });
      React.useEffect(() => {
      },[simulationStatus])
  return (
    <>
      <AutoProviderCardBox>
        {/* SHOW CONFETTI AFTER PASSING QUIZ */}
        {quizPassed && (
          <Confetti
            ref={() => {
              setStartConfetti(true);
            }}
            active={startConfetti}
            config={config}
          />
        )}

        {/* QUIZ STATUS SECTION - COURSE NAME, TITLE, GUIDE TEXT */}
        <div>
          {/* COURSE NAME */}
          <Typography style={{ fontWeight: 600, fontSize: '22px' }}>
            Quiz
          </Typography>

          <img
            style={{ padding: '20px 0px' }}
            width={isMobile ? 100 : 170}
            src="/images/lms/quiz_card.png"
          />

          <Box>
            {/* QUIZ TITLE */}
            <Typography
              variant="h4"
              style={{ color: '#008000', paddingBottom: '10px', fontSize: '22px', fontWeight: 600 }}
            >
              {quizTitle}
            </Typography>

            {/* QUIZ GUIDE TEXT- PASSING CRITERIA, PASS/ FAIL MESSAGE, RENEW MESSAGE */}
            {isCourseCompleted ? (
              <Typography paragraph>
                You have already passed the Quiz.
              </Typography>
            ) : quizPassed ? (
              <Typography paragraph>
                on completing the quiz with a score of <b>{Math.round((percentage / 100) * (totalQuestionsCount))} out of {totalQuestionsCount}</b> on the quiz!
              </Typography>
            ) : endQuiz ? (
              <Typography paragraph style={{ color: '#C52A34', fontSize: '16px' }}>
                You got <b>{Math.round((percentage / 100) * (totalQuestionsCount))}/{totalQuestionsCount}</b> answers correct.
                You must score at least {passingQuestionsCount} on the quiz to pass {(isOpioid || isNIHSS)  ? 'CME Certificate' : 'Provider Card'}.
              </Typography>
            ) : certificateID || cmeID ? (
              <Typography mb={2} style={{ fontSize: '16px', fontWeight: 600 }}>
                Note: Renew plan to unlock the quiz again.
              </Typography>
            ) : (
              <Typography paragraph>
                you are required to score at least <b>{passingCriteria}</b> on the quiz to earn your {(isOpioid || isNIHSS)  ? 'CME certificate' : 'provider card'}, testing your understanding of each module
              </Typography>
            )}
          </Box>
        </div>

        {/* QUIZ NOTE - PROVIDER CARD GENERATION STATUS, BENEFITS CLAIMED STATUS, CME NOT CLAIMED STATUS FOR OPIOID & NIHSS  */}
        {(quizPassed || isCourseCompleted) && (
          <Typography mb={2} style={{ fontSize: '16px', fontWeight: 600 }}>
            {quizNote}
          </Typography>
        )}

        {/* BUTTONS SECTION - COMPLETE REQUIREMENT, RETAKE QUIZ, RENEW, DOWNLOAD PROVIDER CARD, CLAIM CME, CLAIMED CME */}
        <Grid container spacing={2} justifyContent="center">
          {
            quizPassed?
            <Grid item sm={10} md={6}>
              <Button
              sx={{
                cursor: 'default',
                  pointerEvents: 'none', // Disables interactions like hover, click
                  '&:hover': {
                    backgroundColor: 'success.main' // Ensures no hover effect
                  }
                }}
                disableRipple
                color='success'
                disableElevation
                fullWidth
                variant="contained"
                // onClick={handleAttemptQuiz}
                endIcon={<CompleteIcon />}
              >
                Completed
              </Button>
            </Grid>
            :
          <Grid item sm={10} md={6}>
              <Button
                fullWidth
                disableElevation
                variant="contained"
                onClick={handleAttemptQuiz}
              >
                {!quizPassed && endQuiz ? 'Retake quiz' : 'Complete'}
              </Button>
            </Grid>
          }

          {/* DISPLAY API ERROR IF PROVIDER CARD GENERATION FAILS */}
          {certificateGenerateError && <APIErrorMessage errorMessage={certificateGenerateError} />}
        </Grid>
      </AutoProviderCardBox>

      {/* DIALOGS FOR RENEW PLAN */}
      {/* FOR REGULAR USER */}
      <ExplorePlansDialog fullAccess={isOrderTypeFullAccess}/>
      {/* FOR TEAMHEALTH USER */}
      <RetakeCourseDialog course_id={courseID} handleRefresh={() => window.location.reload()}/>
    </>
  );
};

export default React.memo(QuizActionsCard);
