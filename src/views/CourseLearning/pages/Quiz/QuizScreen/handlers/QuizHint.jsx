import React from 'react';

//? REFER PR - https://github.com/Medtigo/medtigo-react/pull/1882
// This function updates links in the provided HTML content to open in a new tab and adds styles.
function formatQuizHintText(htmlContent) {
  return htmlContent
    .replace(
      /<a\s+(?![^>]*\btarget=)[^>]*href="([^"]*)"[^>]*>/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #2872C1;">'
    ) // Open links in a new tab and style them
    .replace(/<li>/g, '<li style="margin-left: 24px;">') // Add left margin to <li> tags
    .replace(/<ul>/g, '<ul style="margin-left: 24px;">') // Add left margin to <ul> tags
    .replace(/<iframe/g, '<iframe style="display: none;"'); // Hide the div with id="sub-frame-error"
}

// QuizHint component displays a hint or explanation based on the question and answer classes.
// It displays the hint message from LMS API
const QuizHint = ({ question }) => {
  let explanation = question.correctMessage || '';

  const htmlContent = formatQuizHintText(explanation);

  return (
    <div
      style={{
        textAlign: 'left',
        maxWidth: '100%' // Prevents overflow
      }}
    >
      <div
        style={{
          fontWeight: 700,
          marginTop: '12px',
          fontSize: '16px' // Readable size for mobile
        }}
      >
        Hint:
      </div>
      <div
        style={{
          fontWeight: 400,
          overflowWrap: 'break-word', // Prevents text overflow
          letterSpacing: '0.25px' // Improves readability
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
};

export default QuizHint;
