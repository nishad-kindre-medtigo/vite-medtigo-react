import React, { useContext } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { useOpenSnackbar } from '../../../../../../hooks/useOpenSnackbar';
import { LearningContext } from '../../../../../../context/LearningContext';
import { useNavigate } from 'react-router-dom';
import { courseDetails } from '../data';
import {
  CompletionCard,
  CompletionLoadingScreen as LoadingScreen,
  APIErrorMessage,
  ExitButton
} from '../handlers';

/**
 * @component QuizCompletion
 * @description Handles the display of quiz completion actions and information.
 *
 * This component is responsible for showing the user their quiz results, providing options to download certificates, claim CME credits
 *
 * @hierarchy
 * - Child of: QuizScreen, QuizContent
 *
 * @flow
 * 1. Takes props from parent component to determine the current course and quiz status.
 * 2. Displays the quiz score and completion status.
 * 3. Provides buttons for downloading the provider card, claiming CME.
 * 4. Handles the logic for revisiting the quiz page, including displaying appropriate messages and buttons based on the user's progress and course requirements.
 * 5. Manages the loading state and error handling for certificate generation.
 *
 * @behavior
 * - After Quiz Pass:
 *   • Displays User Score & congratulations message with a confetti burst.
 *   • Displays "Download Provider Card" & "Claim CME" buttons based on current course & plan.
 *
 * - Revisiting Quiz Page:
 *   • Displays User's Score.
 *   • Displays button "Download Provider Card" with "Claim CME" or "Download Claimed CME" button displayed conditionally.
 *
 * @props {boolean} quizPassed - Pass/ Fail status of quiz.
 * @props {Object} currentOrder - Details of the current course order.
 * @props {string} hash - Hash value for individual order for cme claim purpose.
 * @props {boolean} isCMEValid - Indicates if the CME is valid for the course.
 * @props {string} certificateID - ID of provider card which is currently generated or linked with order.
 * @props {string} cmeID - ID of cme certificate which is currently generated or linked with order.
 * @props {string} providerCardPath - Path for downloading the provider card.
 * @props {string} cmePath - Path for downloading the CME certificate.
 * @props {boolean} loading - State indicating if the component is in a loading state.
 * @props {number} percentage - Score of Quiz.
 * @props {string} certificateGenerateError - Error message from failure of genreateCertificate API.
 */

const QuizCompletion = props => {
  const {
    parent,
    quizPassed,
    currentOrder,
    hash,
    isCMEValid,
    certificateID,
    cmeID,
    providerCardPath,
    cmePath,
    loading,
    percentage,
    certificateGenerateError = ''
  } = props;

  // console.log("parent: ", parent);

  const navigate = useNavigate();
  const openSnackbar = useOpenSnackbar();
  const { activeCourse, activeCourseProgress } = useContext(LearningContext);

  const hasCME = currentOrder?.hasCME;
  const courseID = activeCourse.id;

  // Check whether the user is revisiting this page using parent component for reference
  const isRevisit = parent === 'QuizScreen';

  const showCMELoader = hasCME;

  const isOpioid = courseID === 11159;
  const isNIHSS = courseID === 192797;
  const isACLS = courseID === 4526;

  const quizScoreGrid = hasCME
    ? isOpioid || isNIHSS
      ? 10
      : 12
    : 10;

  let isCourseCompleted = false;

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

  const goToDashboard = () => history.push('/dashboard');

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

  return (
    <Grid container spacing={2} justifyContent="center" sx={{ my: 2 }}>
      <Grid size={{ xs: 10, sm: 8 }}>
        <Grid container justifyContent="center" spacing={2}>
          {/* SHOW EXIT BUTTON ONLY WHEN QUIZ IS PASSED FOR FIRST TIME AND NOT ON REVISIT */}
          {parent === 'QuizContent' && (
            <Grid size={12}>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap-reverse'
                }}
              >
                <QuizScore courseID={courseID} percentage={percentage} />
                <ExitButton disabled={loading} onClick={handleBackLink} />
              </Box>
            </Grid>
          )}
          {/* COURSE COMPLETION TEXT */}
          {isRevisit ? (
            <Grid size={12}>
              <QuizScore courseID={courseID} percentage={percentage} />
              <Typography>
                to find renewal and tracking options,{' '}
                <span style={{ color: '#2872C1', fontWeight: 600 }}>
                  Click{' '}
                  <span
                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={goToDashboard}
                  >
                    Dashboard
                  </span>
                </span>
              </Typography>
            </Grid>
          ) : null}

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
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CompletionCard
                      card="Provider Card"
                      onClick={downloadProviderCard}
                      disabled={!providerCardPath}
                    />
                  </Grid>
                )}

                {/* CLAIM CME BUTTON */}
                {isCMEValid && hash && !cmeID && (
                  <Grid size={{ xs: 12, sm: 6 }}>
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
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CompletionCard
                        card="Provider Card"
                        onClick={downloadProviderCard}
                        disabled={!providerCardPath}
                      />
                    </Grid>
                  )}

                  {/* CLAIM CME BUTTON */}
                  {isCMEValid && hash && !cmeID ? (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CompletionCard
                        card="CME Certificate"
                        action="Claim"
                        onClick={handleClaimCME}
                        disabled={!(isOpioid || isNIHSS) && !providerCardPath}
                      />
                    </Grid>
                  ) : (
                    isCMEValid && (
                      <Grid size={{ xs: 12, sm: 6 }}>
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

const QuizScore = ({ courseID, percentage }) => {
  const isOpioid = courseID === 11159;
  const isNIHSS = courseID === 192797;
  const totalQuestionsCount = isOpioid ? 24 : isNIHSS ? 25 : 50;

  const courseShortName = courseDetails.find(course => course.id == courseID)
    ?.short_name;

  return (
    <Typography>
      {courseShortName} course completed{' '}
      {percentage ? (
        <>
          with a quiz score of{' '}
          <b>
            {Math.round((percentage / 100) * totalQuestionsCount)}/
            {totalQuestionsCount}.
          </b>
        </>
      ) : null}
    </Typography>
  );
};

export default React.memo(QuizCompletion);
