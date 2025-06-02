import { useContext } from 'react';
import { LearningContext } from '../context/LearningContext';

//? REFER PR - https://github.com/Medtigo/medtigo-react/pull/1919
// HOOK USED TO ALERT USER WHILE NAVIGATING TO DIFFERNT PAGE/ TAB WHILE QUIZ IS ACTIVE
export const useBlockNavigation = () => {
  const { startQuiz, setStartQuiz, setAllowRedirection } = useContext(LearningContext);

  const blockNavigationWhenActiveQuiz = () => {
    // Check if the quiz is in progress
    let confirmNavigation = true;
    if (startQuiz) {
      confirmNavigation = window.confirm(
        'If you proceed, the quiz progress will be lost, and you will have to restart the quiz. Do you want to continue?'
      );
      if (confirmNavigation) {
        setAllowRedirection(true); // Allow redirection without triggering the beforeunload alert
        setStartQuiz(false);
      }
    }
    return confirmNavigation;
  };

  return { blockNavigationWhenActiveQuiz };
};
