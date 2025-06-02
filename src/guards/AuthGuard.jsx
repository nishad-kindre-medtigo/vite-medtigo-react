import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { AUTH_QA, AUTH_URL, MARKET_URL } from '../settings';
import SplashScreen from '../components/SplashScreen';

function AuthGuard({ children }) {
  const account = useSelector((state) => state.account);
  const urlParams = new URLSearchParams(window.location.search);
  const admin_token = urlParams.get('admin_token') || urlParams.get('t');
  const destination = window.location.pathname;
  const url= window.location.origin;
  if (!account.user) {
    if (url == "http://qa.medtigo.com") {
      window.location.href = AUTH_QA+ "?path=redirect&route=" + destination;
    } else if(url == `http://localhost:${window.location.port}`){
      window.location.href=`http://localhost:${window.location.port}/login`  
      return;
      }else {
      if (localStorage.getItem('reset')) {
        window.location.href = AUTH_URL + "login/?/settings";
      } else {
        window.location.href = AUTH_URL + "?path=redirect&route=" + destination;
      }
    }
    return <SplashScreen />
  }
  // Temporary commented code to access simualtion cases smoothly from courses
  // if (authService.handleRestrictToOneTab()) {
  //   document.querySelector('.zsiq_floatmain') && document.querySelector('.zsiq_floatmain').classList.remove('visible');
  //   return <MultiTabBlockPage/>
  // }

  if (destination === '/market-auto-login'){
    localStorage.removeItem('data')

    window.location.href =MARKET_URL + 'cart' + '?t=' + account.user.wp_token;

  }

  return children;
}

AuthGuard.propTypes = {
  children: PropTypes.any
};

export default AuthGuard;