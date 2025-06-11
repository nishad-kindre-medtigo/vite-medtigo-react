import React, { useContext } from 'react';
import { Box, Button, Grid, Tooltip, Typography } from '@mui/material';
import useBreakpoints from 'src/hooks/useBreakpoints';
import { LearningContext } from 'src/context/LearningContext';
import { AutoProviderCardBox } from '../handlers';
import CompleteIcon from '@mui/icons-material/CheckCircle';

/**
 * @component QuizActionsCard
 * @description Component for handling quiz actions such as starting, failing, or retaking the quiz.
 *
 * Displays buttons and dynamic content based on the quiz state, such as "Complete" "Retake Quiz,"
 *
 * @hierarchy
 * - Child of: QuizScreen, QuizContent
 *
 * @flow
 * 1. The user interacts with the component to start the quiz.
 * 2. On quiz completion if user fails quiz, it displays the score and options to retake the quiz.
 *
 * @behavior
 * - Before Provider Card Generation:
 *   • Displays "Complete" button.
 *   • Starts the Quiz & displays Quiz Content upon clicking button.
 *
 * - After Quiz Fail:
 *   • Displays User Score with passing criteria.
 *   • Displays "Retake Quiz" button.
 *   • Redirects to Start Quiz Screen upon clicking button.
 *
 * @props {boolean} quizPassed - Pass/ Fail status of quiz.
 * @props {Object} currentOrder - Details of the current course order.
 * @props {string} certificateID - ID of provider card which is currently generated or linked with order.
 * @props {string} cmeID - ID of cme certificate which is currently generated or linked with order.
 * @props {Function} setEndQuiz - State setter function to update the quiz completion status.
 * @props {boolean} endQuiz - State indicating whether the quiz has ended.
 * @props {number} percentage - Score of Quiz.
 * @props {Function} setStart - State setter function to initiate the quiz.
 */

export const quizQuestions = {
  4526: { total: 50, pass: 40 },
  9985: { total: 50, pass: 40 }, 
  9238: { total: 50, pass: 40 },
  79132: { total: 50, pass: 40 },
  151904: { total: 50, pass: 40 },
  192797: { total: 25, pass: 20 }, 
  11159:  { total: 24, pass: 20 },
  130360:  { total: 27, pass: 22 }
}

const QuizActionsCard = props => {
  const {
    parent,
    quizPassed,
    isTeamHealthUser,
    currentOrder,
    certificateID,
    cmeID,
    setEndQuiz,
    endQuiz,
    setStart,
    percentage
  } = props;

  const {
    setStartQuiz,
    activeCourse,
    activeCourseProgress: courseProgress,
    simulationStatus
  } = useContext(LearningContext);
  const { isMobile } = useBreakpoints();

  const courseID = activeCourse.id;

  const hasCME = currentOrder?.hasCME;

  const isOpioid = courseID === 11159;
  const isNIHSS = courseID === 192797;
  const isACLS = activeCourse.id === 4526;

  const hasSimulationAccess = (isTeamHealthUser && isACLS) || (isACLS && hasCME);
  const disableStartQuiz = isMobile ? false : hasSimulationAccess && simulationStatus != 'done';

  let isCourseCompleted = false;

  // ONLY FOR OPIOID & NIHSS AFTER PASSING QUIZ AND USER HASNT CLAIMED CME WHILE RETURNING TO COURSE PAGE
  if (isOpioid || (isNIHSS && !quizPassed)) {
    isCourseCompleted = courseProgress.isCourseCompleted;
  }

  // Start Quiz or Retake Quiz
  const handleAttemptQuiz = () => {
    if (disableStartQuiz) {
      return;
    }
    if (!quizPassed && endQuiz) {
      window.location.reload();
    } else {
      setEndQuiz(false);
      setStart(true); // To Start Quiz by changing local state value
      setStartQuiz(true); // Set startQuiz Context value to true for disabling navigation
    }
  };

  const totalQuestionsCount = quizQuestions[courseID].total;
  const passingQuestionsCount = quizQuestions[courseID].pass;
  const passingCriteria = `${passingQuestionsCount} out of ${totalQuestionsCount}`

  const quizTitle = quizPassed
    ? 'Congratulations'
    : isCourseCompleted
    ? 'Quiz Completed'
    : endQuiz
    ? 'Try Again'
    : certificateID || cmeID
    ? 'Quiz Completed'
    : 'Take Quiz';

  // const quizNote =
  //   isOpioid || isNIHSS
  //     ? cmeID
  //       ? 'Note: You can only claim CME credits once per order'
  //       : 'Note: You can claim CME by filling form'
  //     : disableStartQuiz
  //     ? 'Note: Need to Complete Simulation to get Provider Card'
  //     : certificateID
  //     ? 'Note: You can only generate provider card once per order'
  //     : providerCardPath
  //     ? 'Note: Your Provider Card has been generated'
  //     : 'Generating Provider Card...';

  return (
    <>
      <AutoProviderCardBox>
        {/* QUIZ STATUS SECTION - COURSE NAME, TITLE, GUIDE TEXT */}
        <div>
          {/* COURSE NAME */}
          <Typography style={{ fontWeight: 400, fontSize: '24px' }}>
            {hasSimulationAccess ? 'Step 2' : 'Quiz'}
          </Typography>

          <img
            alt="Quiz Actions Card"
            style={{ padding: '20px 0px' }}
            width={isMobile ? 100 : 170}
            src="/images/lms/quiz_card.png"
          />

          <Box>
            {/* QUIZ TITLE */}
            <Typography
              variant="h4"
              style={{
                color: quizTitle === 'Take Quiz' ? '#000' : '#008000',
                paddingBottom: '10px',
                fontSize: '22px',
                fontWeight: 600
              }}
            >
              {quizTitle}
            </Typography>

            {/* QUIZ GUIDE TEXT- PASSING CRITERIA, PASS/ FAIL MESSAGE, RENEW MESSAGE */}
            {isCourseCompleted ? (
              <Typography>
                You have already passed the Quiz.
              </Typography>
            ) : quizPassed ? (
              <Typography>
                on completing the quiz with a score of{' '}
                <b>
                  {Math.round((percentage / 100) * totalQuestionsCount)} out of{' '}
                  {totalQuestionsCount}
                </b>{' '}
                on the quiz!
              </Typography>
            ) : endQuiz ? (
              <Typography
                style={{ color: '#C52A34', fontSize: '16px' }}
              >
                You got{' '}
                <b>
                  {Math.round((percentage / 100) * totalQuestionsCount)}/
                  {totalQuestionsCount}
                </b>{' '}
                answers correct. You must score at least {passingQuestionsCount}{' '}
                on the quiz to pass{' '}
                {isOpioid || isNIHSS ? 'CME Certificate' : 'Provider Card'}.
              </Typography>
            ) : certificateID || cmeID ? (
              <Typography mb={2} style={{ fontSize: '16px', fontWeight: 600 }}>
                Note: Renew plan to unlock the quiz again.
              </Typography>
            ) : (
              <Typography>
                you are required to score at least <b>{passingCriteria}</b> on
                the quiz to earn your{' '}
                {isOpioid || isNIHSS ? 'CME certificate' : 'provider card'},
                testing your understanding of each module
              </Typography>
            )}
          </Box>
        </div>

        {/* QUIZ NOTE - PROVIDER CARD GENERATION STATUS, BENEFITS CLAIMED STATUS, CME NOT CLAIMED STATUS FOR OPIOID & NIHSS  */}
        {/* {(quizPassed || isCourseCompleted) && (
          <Typography mb={2} style={{ fontSize: '16px', fontWeight: 600 }}>
            {quizNote}
          </Typography>
        )} */}

        {/* BUTTONS SECTION - COMPLETE REQUIREMENT, RETAKE QUIZ, RENEW, DOWNLOAD PROVIDER CARD, CLAIM CME, CLAIMED CME */}
        <Grid container spacing={2} justifyContent="center" sx={{ width: '100%' }}>
          <Grid size={6}>
            <Tooltip
              title={
                disableStartQuiz
                  ? 'Please attempt the simulation cases first'
                  : ''
              }
              arrow
            >
              <Button
                fullWidth
                disableElevation
                variant="contained"
                onClick={handleAttemptQuiz}
                // disabled={disableStartQuiz}
                sx={{
                  // background: disableStartQuiz ? 'lightgray' : 'primary.main',
                  // color: '#fff',
                  // '&:hover': {
                  //   background: disableStartQuiz
                  //     ? 'lightgray'
                  //     : 'primary.main'
                  // },
                  cursor: disableStartQuiz ? 'default' : 'pointer'
                }}
              >
                {!quizPassed && endQuiz ? 'Retake quiz' : 'Complete'}
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </AutoProviderCardBox>
    </>
  );
};

export default React.memo(QuizActionsCard);
