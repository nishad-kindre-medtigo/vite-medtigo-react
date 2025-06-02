import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import QuizHint from './QuizHint';

const FeedbackBox = ({ type, message }) => {
  const isCorrect = type === 'correct';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: isCorrect ? '#e8f5e9' : '#ffebee',
        borderLeft: `6px solid ${isCorrect ? '#388e3c' : '#d32f2f'}`,
        color: isCorrect ? '#388e3c' : '#d32f2f',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        marginTop: '12px'
      }}
    >
      {isCorrect ? (
        <CheckCircleIcon sx={{ color: '#388e3c' }} />
      ) : (
        <CancelIcon sx={{ color: '#d32f2f' }} />
      )}
      <Typography variant="body1">{message}</Typography>
    </Box>
  );
};

const AnswerCheck = ({ incorrectAnswer, correctAnswer, question }) => {
  return (
    <>
      {incorrectAnswer && (
        <FeedbackBox
          type="incorrect"
          message="Incorrect answer. Please try again."
        />
      )}
      {correctAnswer && (
        <>
          <FeedbackBox
            type="correct"
            message="You are correct! Click Next to continue."
          />
          {/* <QuizHint question={question} isResultPage={false} /> */}
        </>
      )}
    </>
  );
};

export default AnswerCheck;
