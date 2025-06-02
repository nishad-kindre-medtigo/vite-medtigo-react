export const checkAnswer = (
  index,
  correctAnswer,
  answerSelectionType,
  question,
  addQuestionResponse,
  addNewButtons,
  {
    userInput,
    currentQuestionIndex,
    incorrect,
    correct,
    setButtons,
    setCorrectAnswer,
    setIncorrectAnswer,
    setCorrect,
    setIncorrect,
    setUserInput
  }
) => {
  const indexStr = `${index}`;
  const disabledAll = {
    0: { disabled: true },
    1: { disabled: true },
    2: { disabled: true },
    3: { disabled: true },
    4: { disabled: true },
    5: { disabled: true },
    6: { disabled: true },
    7: { disabled: true },
    8: { disabled: true },
    9: { disabled: true },
    10: { disabled: true },
    11: { disabled: true },
    12: { disabled: true }
  };

  // Clean question from correct answer array if already exists.
  correct.includes(currentQuestionIndex) &&
    setCorrect((correct) => correct.filter((c) => c !== currentQuestionIndex));
  // Clean question from incorrect answer array if already exists.
  incorrect.includes(currentQuestionIndex) &&
    setIncorrect((incorrect) =>
      incorrect.filter((c) => c !== currentQuestionIndex)
    );

  if (answerSelectionType === 'single') {
    if (userInput[currentQuestionIndex] === undefined) {
      userInput.push(index);
    } else {
      userInput[currentQuestionIndex] = index;
    }

    if (indexStr === correctAnswer) {
      setButtons((prevState) => {
        const newButtons = {
          ...prevState,
          ...disabledAll,
          [index - 1]: {
            className: 'selected'
          }
        };
        addNewButtons(question.questionID, newButtons);
        return newButtons;
      });

      setCorrectAnswer(true);
      addQuestionResponse(
        question.questionID,
        currentQuestionIndex + 1,
        true,
        index
      );
      setIncorrectAnswer(false);
      setCorrect((arr) => {
        const newArray = arr;
        newArray.push(currentQuestionIndex);
        return newArray;
      });
    } else {
      setButtons((prevState) => {
        const newButtons = Object.assign({}, prevState, {
          ...disabledAll,
          [index - 1]: {
            className: 'selected'
          }
        });
        addNewButtons(question.questionID, newButtons);
        return newButtons;
      });

      setIncorrectAnswer(true);
      setCorrectAnswer(false);
      addQuestionResponse(
        question.questionID,
        currentQuestionIndex + 1,
        false,
        index
      );
      setIncorrect((arr) => {
        const newArray = arr;
        newArray.push(currentQuestionIndex);
        return newArray;
      });
    }
  } else {
    if (userInput[currentQuestionIndex] === undefined) {
      userInput[currentQuestionIndex] = [];
    }

    if (userInput[currentQuestionIndex].includes(index)) {
      userInput[currentQuestionIndex] = userInput[currentQuestionIndex].filter(
        (e) => e !== index
      );
    } else {
      userInput[currentQuestionIndex].push(index);
    }

    const buttonsObj = {};
    for (let i = 0; i < userInput[currentQuestionIndex].length; i++) {
      const value = userInput[currentQuestionIndex][i];
      buttonsObj[value - 1] = { className: 'selected' };
    }
    setButtons(buttonsObj);
    addNewButtons(question.questionID, buttonsObj);
    addQuestionResponse(
      question.questionID,
      currentQuestionIndex + 1,
      true,
      Object.keys(buttonsObj)
    );

    let cnt = 0;
    for (let i = 0; i < correctAnswer.length; i++) {
      if (userInput[currentQuestionIndex].includes(correctAnswer[i])) {
        cnt++;
      }
    }

    if (
      cnt === correctAnswer.length &&
      userInput[currentQuestionIndex].length === correctAnswer.length
    ) {
      setCorrectAnswer(true);
      setIncorrectAnswer(false);
      setCorrect((arr) => {
        const newArray = arr;
        newArray.push(currentQuestionIndex);
        return newArray;
      });
    } else {
      setIncorrectAnswer(true);
      setCorrectAnswer(false);
      setIncorrect((arr) => {
        const newArray = arr;
        newArray.push(currentQuestionIndex);
        return newArray;
      });
    }
  }
};

export const formatQuestionText = (questionText) => {
  return `${
    questionText
      .replace(/<\/?strong>/g, '<span>') // Replace <strong> with <span>
      .replace(/\r?\n/g, '') // Remove newlines
      .replace(/\u00A0/g, ' ') // Replace &nbsp; with a regular space
      .replace(/<img /g, '<img style="display: block;" ') // Add display block to all img tags
  }`;
};
