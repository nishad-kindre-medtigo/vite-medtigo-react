import { useState } from 'react';
import { useSelector } from 'react-redux';
import { MARKET_URL } from '../settings';
import authService from '../services/authService';

// Redirect to medtigo store based on course & selected plan
export const useBuyPlan = () => {
  const { user } = useSelector(state => state.account);
  const [isLoading, setIsLoading] = useState(false);

  const courseIds = {
    ACLS: {
      basic: {
        regular: 19987,
        addOn: 25320
      },
      standard: {
        regular: 1036,
        addOn: 25324
      },
      best_value: 19986,
    },
    BLS: {
      basic: {
        regular: 19982,
        addOn: 25318
      },
      standard: {
        regular: 1041,
        addOn: 25323
      },
      best_value: 19981,
    },
    PALS: {
      basic: {
        regular: 19985,
        addOn: 25322
      },
      standard: {
        regular: 1042,
        addOn: 25325
      },
      best_value: 19984,
    },
    "ASC CE": 17475,
    NRP: 17474,
    NIHSS: 77817,
    full_access: 5241
  };

  const getCoursesToken = async () => {
    try {
      const newToken = await authService.generateToken(); // create a new 24 hour token
      return newToken;
    } catch (error) {
      console.error('Error generating token:', error);
      return null;
    }
  };  

  const buyPlan = async(courseId = courseIds.full_access) => {
    setIsLoading(true);
    const newToken = await getCoursesToken();
    const url = `${MARKET_URL}cart?add-to-cart=${courseId}&t=${user.wp_token}&t1=${newToken}&utm_source=connect&utm_medium=PPC&utm_campaign=Connect_Customer`;
    window.location.href = url;
  };

  return { buyPlan, courseIds, isLoading, setIsLoading };
};
