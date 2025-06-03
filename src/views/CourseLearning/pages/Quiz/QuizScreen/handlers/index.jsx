import React, { useState } from 'react';
import { Box, Button, Grid, LinearProgress, Typography, Collapse, IconButton, Divider } from '@mui/material';
import Correct from '@mui/icons-material/CheckCircle';
import Incorrect from '@mui/icons-material/Cancel';
import Disc from '@mui/icons-material/CircleOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import WarningIcon from '@mui/icons-material/WarningAmberRounded';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import CopyIcon from '@mui/icons-material/ContentCopy';
import EmailIcon from '@mui/icons-material/EmailRounded';
import AnswerDisc from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircle from '@mui/icons-material/RadioButtonChecked';
import Square from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBox from '@mui/icons-material/CheckBox';
import DownloadIcon from '@mui/icons-material/Download';
import CallMadeIcon from '@mui/icons-material/CallMade';
import BackIcon from '@mui/icons-material/KeyboardArrowLeft';
import QuizHint from './QuizHint';
import AnswerCheck from './AnswerCheck';
import QuizResultFilter from './QuizResultFilter';
import CourseFeedbackPopup from './CourseFeedbackPopup';
import { useOpenSnackbar } from '../../../../../../hooks/useOpenSnackbar';
import { Loader } from '../../../../../../ui/Progress';

// Progress Bar displaying number of questions answered and total number of questions in quiz
export const QuizProgress = ({ currentQuestionIndex, quiz }) => {
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div
      style={{
        textAlign: 'center',
        fontSize: '16px',
        fontWeight: '600',
        color: '#555',
        maxWidth: '300px',
        margin: '14px auto'
      }}
    >
      Question {currentQuestionIndex + 1} of {quiz.questions.length}
      <Box
        sx={{
          width: '100%',
          marginTop: '10px',
          marginBottom: '5px'
        }}
      >
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: '8px',
            borderRadius: '5px',
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              background: `linear-gradient(to right, #6a11cb, #2575fc)`
            }
          }}
        />
      </Box>
    </div>
  );
};

export const renderQuizAnswerIcon = (isMultiSelect, isAnswerSeleted) => {
  return isMultiSelect ? (
    isAnswerSeleted ? (
      <CheckBox fontSize="small" sx={{ color: '#2872C1' }} />
    ) : (
      <Square fontSize="small" sx={{ color: '#787878' }} />
    )
  ) : isAnswerSeleted ? (
    <CheckCircle fontSize="small" sx={{ color: '#2872C1' }} />
  ) : (
    <AnswerDisc fontSize="small" sx={{ color: '#787878' }} />
  );
};

// Old Quiz Answers Result Component
export const renderAnswerInResult = (question, userInputIndex) => {
  const { answers, correctAnswer, questionType } = question;
  let { answerSelectionType } = question;
  let answerBtnCorrectClassName;
  let answerBtnIncorrectClassName;

  // Default single to avoid code breaking due to automatic version upgrade
  answerSelectionType = answerSelectionType || 'single';

  return answers.map((answer, index) => {
    if (answerSelectionType === 'single') {
      // correctAnswer - is string
      answerBtnCorrectClassName =
        `${index + 1}` === correctAnswer ? 'correct' : '';
      answerBtnIncorrectClassName =
        `${userInputIndex}` !== correctAnswer &&
        `${index + 1}` === `${userInputIndex}`
          ? 'incorrect'
          : '';
    } else {
      // correctAnswer - is array of numbers
      answerBtnCorrectClassName = correctAnswer.includes(index + 1)
        ? 'correct'
        : '';
      answerBtnIncorrectClassName =
        !correctAnswer.includes(index + 1) && userInputIndex.includes(index + 1)
          ? 'incorrect'
          : '';
    }

    return (
      <div key={index}>
        <button
          className={
            'answerBtn btn ' +
            answerSelectionType +
            ' ' +
            answerBtnCorrectClassName +
            answerBtnIncorrectClassName
          }
        >
          {questionType === 'text' && <span>{answer}</span>}
          {questionType === 'photo' && <img src={answer} alt="image" />}
        </button>
      </div>
    );
  });
};

// New Quiz Answers Result Component
export const renderSelectedAnswersResult = (question, userInputIndex) => {
  const areArraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;

    const sortedA = [...arr1].sort();
    const sortedB = [...arr2].sort();

    return sortedA.every((value, index) => value === sortedB[index]);
  };

  const { answers, correctAnswer, questionType } = question;
  let { answerSelectionType } = question;
  let isAnswerCorrect;
  let isAnswerIncorrect;

  // Default single to avoid code breaking due to automatic version upgrade
  answerSelectionType = answerSelectionType || 'single';

  return answers.map((answer, index) => {
    if (answerSelectionType === 'single') {
      // correctAnswer - is string
      isAnswerCorrect = `${index + 1}` === correctAnswer ? 'correct' : '';
      isAnswerIncorrect =
        `${userInputIndex}` !== correctAnswer &&
        `${index + 1}` === `${userInputIndex}`
          ? 'incorrect'
          : '';
    } else {
      // correctAnswer - is array of numbers
      isAnswerCorrect = correctAnswer.includes(index + 1) ? 'correct' : '';
      isAnswerIncorrect =
        !correctAnswer.includes(index + 1) && userInputIndex.includes(index + 1)
          ? 'incorrect'
          : '';

      if (!areArraysEqual(userInputIndex, correctAnswer)) {
        isAnswerIncorrect = userInputIndex.includes(index + 1) ? true : false;
      }
    }

    return (
      <Box
        key={index}
        sx={{
          py: 1,
          display: 'flex',
          alignItems: 'flex-start', // Aligns icon at the top when text wraps
          gap: '8px', // Space between icon and text
          textAlign: 'left'
        }}
      >
        {/* 
          Show Correct, Incorrect and Disc Icon befor ethe option text

          We have removed the Correct Icon which displays the correct option
          To show the icon add the following condition below

          isAnswerCorrect ? (
            <Correct
              fontSize="small"
              sx={{ color: '#008000', flexShrink: 0, mt: '3px' }}
            />
          ) :
          
         */}
        {isAnswerIncorrect ? (
          <Incorrect
            fontSize="small"
            sx={{ color: '#D35037', flexShrink: 0, mt: '3px' }}
          />
        ) : (
          <Disc
            fontSize="small"
            sx={{ color: '#808080', flexShrink: 0, mt: '3px' }}
          />
        )}

        {/* Wrap text/image inside Typography to maintain spacing */}
        <Typography variant="body1">
          {questionType === 'text' ? (
            answer
          ) : (
            <img src={answer} alt="answer" style={{ maxWidth: '100%' }} />
          )}
        </Typography>
      </Box>
    );
  });
};

// Display Tags for Quiz Question - Single/Multiple Selection
// Currently Removed from Quiz Result Page
export const renderTags = (answerSelectionType, numberOfSelection, segment) => {
  return (
    <div className="tag-container">
      {answerSelectionType === 'single' && (
        <span className="single selection-tag">Single Selection</span>
      )}
      {answerSelectionType === 'multiple' && (
        <span className="multiple selection-tag">Multiple Selection</span>
      )}
      <span className="number-of-selection">Pick {numberOfSelection}</span>
      {segment && <span className="selection-tag segment">{segment}</span>}
    </div>
  );
};

export const AutoProviderCardBox = ({ sx, children, ...props }) => {
  return (
    <Box textAlign="center" sx={{ height: '100%' }}>
      <Box
        mb={{ xs: 0, sm: 2 }}
        p={3}
        sx={{
          minHeight: { xs: 'auto', sm: '100%' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'rgba(0, 0, 0, 0.1) 2px 2px 40px',
          borderRadius: '5px',
          border: '2px solid rgb(224 224 224 / 48%)'
        }}
        {...props}
      >
        {children}
      </Box>
    </Box>
  );
};

export const CompletionCard = ({
  card,
  action = 'Download',
  onClick = () => {},
  disabled = false
}) => {
  const cardImg =
    card === 'Provider Card'
      ? 'download_provider_card.svg'
      : action === 'Claim'
      ? 'claim_cme.svg'
      : 'download_cme.svg';

  return (
    <Box
      sx={{
        border: '1px solid #E0E0E0',
        boxShadow: '0px 2px 11.6px 12px #00000008'
      }}
    >
      <Box
        sx={{
          width: '100%',
          py: 2,
          px: 4,
          borderBottom: '1px solid #E0E0E0',
          textAlign: 'center'
        }}
      >
        <Box
          component="img"
          src={`/images/lms/${cardImg}`}
          alt={`${action} ${card}`}
        />
      </Box>
      <Button
        fullWidth
        size="large"
        disabled={disabled}
        startIcon={
          !disabled &&
          (action === 'Download' ? <DownloadIcon /> : <CallMadeIcon />)
        }
        onClick={onClick}
        sx={{ my: 1 }}
      >
        {disabled ? "Loading..." : action === "Claim" ? "Claim CME" : card}
      </Button>
    </Box>
  );
};

export const CompletionLoadingScreen = ({ courseID, showCMELoader }) => {
  const showProviderCardLoader = [4526, 9985, 9238, 151904, 79132].includes(courseID);

  return (
    <>
      {showProviderCardLoader && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <CompletionCard card="Provider Card" disabled={true} />
        </Grid>
      )}
      {showCMELoader && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <CompletionCard card="CME Certificate" disabled={true} />
        </Grid>
      )}
    </>
  );
};

export const QuizHintAccordion = ({ children, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Box sx={{ borderRadius: 2, border: '1px solid #ccc', background: '#fff', my: 2 }}>
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          cursor: 'pointer',
          px: 2,
          py: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fff',
          borderRadius: 2
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
          Quiz Questions and Hints to Help You Find the Right Answer
        </Typography>
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Divider />
        <Box sx={{ px: 2, py: 2 }}>{children}</Box>
      </Collapse>
    </Box>
  );
};

export const MultipleChoiceText = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      flexDirection: { xs: 'column', sm: 'row' },
      backgroundColor: '#FFF4E5',
      color: '#A15B00',
      p: 1,
      borderRadius: 2,
      fontSize: '14px',
      fontWeight: 500,
      gap: 1
    }}
  >
    <WarningIcon sx={{ color: '#FF9800' }} />
    This is a multi-select question. It is mandatory to select every correct option.
  </Box>
);

export const ExitButton = ({ onClick, disabled, ...props }) => (
  <Box
    display="flex"
    justifyContent="flex-end"
    sx={{ ml: 'auto', cursor: disabled ? 'not-allowed' : 'pointer' }}
  >
    <Typography
      component="span"
      onClick={!disabled ? onClick : undefined}
      sx={{
        display: 'flex',
        alignItems: 'center',
        textTransform: 'none',
        textDecoration: disabled ? 'none' : 'underline',
        color: disabled ? 'text.disabled' : 'primary.main',
        fontSize: '20px',
        px: 0,
        opacity: disabled ? 0.5 : 1,
        '&:hover': {
          color: 'primary.light'
        }
      }}
      {...props}
    >
      <BackIcon fontSize="large" />
      Exit
    </Typography>
  </Box>
);

export const APIErrorMessage = ({ errorMessage }) => {
  const openSnackbar = useOpenSnackbar();

  const handleCopyClick = () => {
    navigator.clipboard.writeText(errorMessage);
    openSnackbar('Copied to clipboard');
  };

  return (
    <Grid size={12}>
      <Box
        role="alert"
        aria-live="assertive"
        sx={{
          backgroundColor: '#FDECEA',
          color: '#611A15',
          p: 2,
          borderRadius: 2,
          border: '1px solid #F5C6CB',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: 1.5,
            mb: 2
          }}
        >
          <ErrorIcon sx={{ color: '#D32F2F' }} />
          <Typography variant="h6" fontWeight="600">
            Certificate Generation Failed
          </Typography>
        </Box>

        <Typography variant="body2">
          We encountered an issue while generating your certificate. Our support
          team will help resolve this problem.
        </Typography>

        <Box
          sx={{
            mt: 2,
            backgroundColor: 'rgba(0,0,0,0.03)',
            borderRadius: 1,
            border: '1px solid rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.05)',
              px: 2,
              py: 1
            }}
          >
            <Typography variant="caption" fontWeight="500">
              Error Details
            </Typography>
            <Button
              startIcon={<CopyIcon fontSize="small" />}
              size="small"
              onClick={handleCopyClick}
              sx={{
                fontSize: '0.75rem',
                color: '#611A15',
                textTransform: 'none'
              }}
            >
              Copy to clipboard
            </Button>
          </Box>
          <Box
            sx={{
              p: 2,
              wordBreak: 'break-word',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              whiteSpace: 'pre-wrap',
              overflowX: 'auto',
              maxHeight: '150px'
            }}
          >
            {errorMessage}
          </Box>
        </Box>

        <Button
          sx={{ mt: 2 }}
          size="small"
          variant="contained"
          color="error"
          disableElevation
          startIcon={<EmailIcon />}
          onClick={() => (window.location.href = 'mailto:support@medtigo.com')}
        >
          Contact Support
        </Button>
      </Box>
    </Grid>
  );
};

export { QuizHint, AnswerCheck, QuizResultFilter, CourseFeedbackPopup };
