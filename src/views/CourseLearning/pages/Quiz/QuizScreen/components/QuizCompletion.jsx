import React, { useState, useContext } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import BackIcon from '@mui/icons-material/ChevronLeft';
import { useOpenSnackbar } from '../../../../../../hooks/useOpenSnackbar';
import { LearningContext } from '../../../../../../context/LearningContext';
import Confetti from 'react-dom-confetti';
import { useNavigate } from 'react-router-dom';
import { config } from '../data';
import {
  CompletionCard,
  CompletionLoadingScreen as LoadingScreen,
  APIErrorMessage
} from '../handlers';

const QuizCompletion = (props) => {
  const {
    currentOrder,
    hash,
    isCMEValid,
    activeCourse,
    certificateID,
    cmeID,
    providerCardPath,
    cmePath,
    loading,
    endQuiz,
    percentage,
    certificateGenerateError = ''
  } = props;

  const navigate = useNavigate();
  const openSnackbar = useOpenSnackbar();
  const { activeCourseProgress,simulationStatus } = useContext(LearningContext);

  let quizPassed = percentage >= 80;
  const [startConfetti, setStartConfetti] = useState(false); // start confetti when quiz passed
  const hasCME = currentOrder?.hasCME;
  const courseID = activeCourse.id;

  const showCMELoader = hasCME;

  const isOpioid = courseID === 11159;
  const isNIHSS = courseID === 192797;
  const isACLS = courseID === 4526;

  let isCourseCompleted = false;
  
  if(isACLS && simulationStatus!='done'){
    quizPassed = false;
  }
  
  // ONLY FOR OPIOID & NIHSS AFTER PASSING QUIZ AND USER HASNT CLAIMED CME WHILE RETURNING TO COURSE PAGE
  if ((isOpioid || isNIHSS) && !quizPassed) {
    isCourseCompleted = activeCourseProgress.isCourseCompleted;
  }

  // Back To Courses Button Click Logic
  const handleBackLink = () => {
    const backLink = localStorage.getItem('learning-path');
    if (backLink) {
      navigate(backLink);
    } else {
      navigate('/my-learning');
    }
  };

  // Redirect to CME Survey Form with hash & courseID as query params
  const handleClaimCME = () => {
    if (hasCME && hash) {
      navigate(`/learning/cme-survey?hash=${hash}&courseID=${courseID}`);
    } else {
      openSnackbar('Something went wrong! Please contact support', 'error');
    }
  };

  const downloadProviderCard = () => window.open(providerCardPath, '_blank');

  const downloadCME = () => window.open(cmePath, '_blank');

  const totalQuestionsCount = isOpioid ? 24 : isNIHSS ? 25 : 50;
  const passingQuestionsCount = isOpioid || isNIHSS ? 20 : 40;

  const quizTitle = quizPassed ? 'Congratulations' : 'Quiz Completed';

  return (
    <Grid container spacing={2} justifyContent="center" sx={{ py: 2 }}>
      <Grid item xs={10} sm={8}>
        <Grid container justifyContent="center" spacing={2}>
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

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                size="large"
                disabled={loading}
                onClick={handleBackLink}
                startIcon={<BackIcon />}
              >
                EXIT
              </Button>
            </Box>
          </Grid>

          {/* QUIZ STATUS SECTION - COURSE NAME, TITLE, GUIDE TEXT */}
          <Grid item xs={12}>
            {/* QUIZ TITLE */}
            <Typography
              variant="h4"
              align="center"
              style={{
                color: '#008000',
                paddingBottom: '10px',
                fontSize: '22px',
                fontWeight: 600
              }}
            >
              {quizTitle}
            </Typography>

            {/* QUIZ GUIDE TEXT- PASSING CRITERIA, PASS/ FAIL MESSAGE, RENEW MESSAGE */}
            {isCourseCompleted ? (
              <Typography paragraph align="center">
                You have already passed the Quiz.
              </Typography>
            ) : quizPassed ? (
              <Typography paragraph align="center">
                on completing the course with a score of{' '}
                <b>
                  {Math.round((percentage / 100) * totalQuestionsCount)}/
                  {totalQuestionsCount}
                </b>{' '}
                on the quiz!
              </Typography>
            ) : endQuiz ? (
              <Typography
                paragraph
                align="center"
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
            ) : null}
          </Grid>

          {/* BUTTONS SECTION - COMPLETE REQUIREMENT, RETAKE QUIZ, RENEW, DOWNLOAD PROVIDER CARD, CLAIM CME, CLAIMED CME */}
          {quizPassed || (isCourseCompleted && !cmeID) ? (
            loading ? (
              <LoadingScreen
                courseID={courseID}
                showCMELoader={showCMELoader}
              />
            ) : (
              <>
                {/* DOWNLOAD CERTIFICATE BUTTON  */}
                {!(isOpioid || isNIHSS) && (
                  <Grid item xs={12} sm={6}>
                    <CompletionCard
                      card="Provider Card"
                      onClick={downloadProviderCard}
                      disabled={!providerCardPath}
                    />
                  </Grid>
                )}

                {/* CLAIM CME BUTTON */}
                {isCMEValid && hash && !cmeID && (
                  <Grid item xs={12} sm={6}>
                    <CompletionCard
                      card="CME Certificate"
                      action="Claim"
                      onClick={handleClaimCME}
                      disabled={!(isOpioid || isNIHSS) && !providerCardPath}
                    />
                  </Grid>
                )}
              </>
            )
          ) : certificateID || cmeID ? (
            <>
              {loading ? (
                <LoadingScreen
                  courseID={courseID}
                  showCMELoader={showCMELoader}
                />
              ) : (
                <>
                  {/* DOWNLOAD CERTIFICATE BUTTON  */}
                  {!(isOpioid || isNIHSS) && (
                    <Grid item xs={12} sm={6}>
                      <CompletionCard
                        card="Provider Card"
                        onClick={downloadProviderCard}
                        disabled={!providerCardPath}
                      />
                    </Grid>
                  )}

                  {/* CLAIM CME BUTTON */}
                  {isCMEValid && hash && !cmeID ? (
                    <Grid item xs={12} sm={6}>
                      <CompletionCard
                        card="CME Certificate"
                        action="Claim"
                        onClick={handleClaimCME}
                        disabled={!(isOpioid || isNIHSS) && !providerCardPath}
                      />
                    </Grid>
                  ) : (
                    isCMEValid && (
                      <Grid item xs={12} sm={6}>
                        {/* DOWNLOAD CME BUTTON */}
                        <CompletionCard
                          card="CME Certificate"
                          onClick={downloadCME}
                          disabled={!cmePath}
                        />
                      </Grid>
                    )
                  )}
                </>
              )}
            </>
          ) : null}

          {/* DISPLAY API ERROR IF PROVIDER CARD GENERATION FAILS */}
          {certificateGenerateError && (
            <APIErrorMessage errorMessage={certificateGenerateError} />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default React.memo(QuizCompletion);
