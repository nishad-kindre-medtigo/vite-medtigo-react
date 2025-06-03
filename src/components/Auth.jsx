import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import SplashScreen from './SplashScreen';
import { setUserData, logout } from '../actions/accountActions';
import authService from '../services/authService';
import OnboardingLicenseEmail from '../views/onboardingLicenseEmail';
import { CONNECT_URL } from '../settings';

function Auth({ children }) {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [showResendLoginPage, setShowResendLoginPage] = useState(false);
  const { user } = useSelector(state => state.account);

  const urlParams = new URLSearchParams(window.location.search);
  const urlToken = urlParams.get('admin_token');

  if(urlToken){
    localStorage.setItem('accessToken', urlToken);
  }

  useEffect(() => {
    if (window.location.href.includes('regenerate')) {
      setLoading(false);
      return;
    } else if (window.location.href.includes('onBoardingResendEmail')) {
      setLoading(false);
      return;
    } else if (window.location.href.includes('lead-confirmation')) {
      setLoading(false);
      return;
    } else if (window.location.href.includes('feedback')) {
      setLoading(false);
      return;
    } else if (window.location.href.includes('taskResponse')) {
      setLoading(false);
      return;
    } else if (window.location.href.includes('imageViewer')) {
      setLoading(false);
      return;
      // }else if(window.location.href.includes("unsubscribeMail")){
      //   setLoading(false)
      //   return
    } else if (window.location.href.includes('clerk-chat-consent')) {
      setLoading(false);
      return;
    }

    if (user && !isLoading) {
      const botData = document.createElement('script');
      botData.type = 'text/javascript';
      botData.innerHTML =
        '$zoho.salesiq.ready=function(){$zoho.salesiq.visitor.name("' +
        user.first_name +
        '");$zoho.salesiq.visitor.email("' +
        user.email +
        '");}';
      document.body.appendChild(botData);
      window.setTimeout(() => {
        document.querySelector('.zsiq_floatmain') &&
          document.querySelector('.zsiq_floatmain').classList.add('visible');
      }, 8000);
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (window.location.href.includes('regenerate')) {
      setLoading(false);
      return;
    } else if (window.location.href.includes('onBoardingResendEmail')) {
      setLoading(false);
      return;
    } else if (window.location.href.includes('lead-confirmation')) {
      setLoading(false);
      return;
    } else if (window.location.href.includes('feedback')) {
      setLoading(false);
      return;
    } else if (window.location.href.includes('taskResponse')) {
      setLoading(false);
      return;
    } else if (window.location.href.includes('imageViewer')) {
      setLoading(false);
      return;
      // }else if(window.location.href.includes("unsubscribeMail")){
      //   setLoading(false)
      //   return
    } else if (window.location.href.includes('clerk-chat-consent')) {
      setLoading(false);
      return;
    }
    //temporary fix for reset password
    if (window.location.href.includes('reset-password')) {
      const url = window.location.href;
      const parts = url.split('com');
      const result = parts[1];
      window.location.href = 'https://auth.medtigo.com' + result;
    }
    const initAuth = async () => {
      authService.setAxiosInterceptors({
        onLogout: () => dispatch(logout())
      });

      authService.handleAuthentication();

      let isNotification = false;

      if (
        localStorage.getItem('data') === '/state-licensing' &&
        sessionStorage.getItem('email') !== null &&
        sessionStorage.getItem('route') !== null &&
        sessionStorage.getItem('platform') !== null
      ) {
        isNotification = true;
      }

      if (authService.isAuthenticated()) {
        const user = await authService.loginInWithToken(isNotification);

        if (user === 'isNotification') {
          setLoading(false);

          sessionStorage.setItem('onBoardingPage', true);

          const encryptedEmail = sessionStorage.getItem('email');

          const route = sessionStorage.getItem('route');

          const platform = sessionStorage.getItem('platform');

          window.location.href = `${CONNECT_URL}/onBoardingResendEmail?email=${encodeURIComponent(
            encryptedEmail
          )
            .replace(/%20/g, '+')
            .replace(/\+/g, '%2B')}&route=${route}&platform=${platform}`;

          return;
        }
        await dispatch(setUserData(user));
      }

      setLoading(false);
    };

    initAuth();
  }, [dispatch]);

  if (showResendLoginPage) {
    return <OnboardingLicenseEmail />;
  }

  if (isLoading) {
    return <SplashScreen />;
  }

  return children;
}

Auth.propTypes = {
  children: PropTypes.any
};

export default Auth;
