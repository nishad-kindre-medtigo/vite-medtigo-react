export const courseLessonTypes = (
  title,
  course_type,
  prop_language,
  courseId
) => {
  let formattedType = '';
  let language = prop_language;
  switch (true) {
    case /tip/i.test(title):
      formattedType = 'Tip';
      break;
    case /module/i.test(title) || course_type === 'cme':
      formattedType = 'Unit';
      formattedType =
        courseId == 4526 && language && language == 'Arabic'
          ? 'الوحدة '
          : 'Unit';
      break;
    case /career path/i.test(title):
      formattedType = 'Career Path';
      break;
    default:
      formattedType = 'Unit';
      formattedType =
        courseId == 4526 && language && language == 'Arabic'
          ? 'الوحدة '
          : 'Unit';
      break;
  }
  return formattedType;
};

export const formatQuizContent = activeQuiz => {
  const questions = activeQuiz
    ? activeQuiz.map((singleQuiz, index) => {
        const answers = singleQuiz['_answerData'].map(
          answer => answer['_answer']
        );
        const correctAnswerIndex = singleQuiz['_answerData'].filter(
          (quiz, index) => {
            quiz['_index'] = index + 1;
            return quiz['_correct'];
          }
        );

        return {
          question: singleQuiz['_question'] || 'Text',
          questionID: singleQuiz['question_id'],
          questionType: 'text',
          correctMessage: singleQuiz['_correctMsg'],
          incorrectMessage:
            singleQuiz['_incorrectMsg'] || singleQuiz['_correctMsg'],
          answerSelectionType:
            correctAnswerIndex.length > 1 ? 'multiple' : 'single',
          correctAnswer:
            correctAnswerIndex.length > 1
              ? correctAnswerIndex.map(a => a._index)
              : (correctAnswerIndex.length
                  ? correctAnswerIndex[0]._index.toString()
                  : '0') || '0',
          answers
        };
      })
    : [];

  const quizzesData = {
    quizTitle: '',
    quizSynopsis:
      'The quizzes consists of questions carefully designed to help you self-assess your comprehension of the information presented on the topics covered in the module.',
    questions
  };

  return quizzesData;
};

// CUSTOM COURSE COLORS
export const courseColors = {
  4526: '#b7001a',
  9985: '#0181b9',
  9238: '#4c21be',
  79132: '#029191',
  151904: '#0072ff',
  192797: '#DF5338',
  11159: '#0072ff'
}