import React from 'react';
import { jwtDecode } from 'jwt-decode';
import axios,{PYTHON_SERVER} from 'src/utils/axios';
import { APP_URL } from 'src/settings';
import { Router } from 'react-router';
import { AUTH_URL } from 'src/settings';
import LearningService from './learningService';
import { isNotification } from 'src/actions/accountActions';

class AuthService {
  passwordValidationCheck = false;
  setAxiosInterceptors = ({ onLogout }) => {
    axios.interceptors.response.use(
      response => response,
      error => {
        if (
          error.response &&
          error.response.status === 401 &&
          !this.passwordValidationCheck
        ) {
          this.setSession(null);
          if (onLogout) {
            onLogout();
          }
        }
        return Promise.reject(
          error.response && error.response.data !== undefined
            ? error.response.data
            : error
        );
      }
    );
  };

  handleAuthentication() {
    const accessToken = this.getAccessToken();

    if (!accessToken) {
      return;
    }

    if (this.isValidToken(accessToken)) {
      this.setSession(accessToken);
    } else {
      this.setSession(null);
    }
  }

  defineTabID() {
    var iPageTabID = sessionStorage.getItem('tabID');
    // if it is the first time that this page is loaded
    if (iPageTabID == null) {
      var iLocalTabID = localStorage.getItem('tabID');
      // if tabID is not yet defined in localStorage it is initialized to 1
      // else tabId counter is increment by 1
      iPageTabID = iLocalTabID == null ? 1 : Number(iLocalTabID) + 1;
      // new computed value are saved in localStorage and in sessionStorage
      localStorage.setItem('tabID', iPageTabID);
      sessionStorage.setItem('tabID', iPageTabID);
    }
    return iPageTabID;
  }

  handleRestrictToOneTab() {
    if (this.defineTabID() == localStorage.getItem('tabID')) {
      return false;
    }
    return true;
  }

  updateUserProfile = user =>
    new Promise((resolve, reject) => {
      const formData = new FormData();
      for (let key in user) {
        formData.append(key, user[key]);
      }
      axios
        .put('/user/update', formData)
        .then(response => {
          if (response.data) {
            const res = response.data;
            if (
              res?.updatedUser.profilePicture &&
              res?.updatedUser.profilePicture.includes('files')
            ) {
              res.updatedUser.profilePicture =
                res.updatedUser.profilePicture + '?ms=' + new Date().getTime();
            }
            resolve(res);
          } else {
            reject(response.error);
          }
        })
        .catch(error => {
          reject(error.error);
        });
    });

  loginWithEmailAndPassword = (email, password) =>
    new Promise((resolve, reject) => {
      axios
        .post('/auth/userLogin', { email, password })
        .then(response => {
          if (response.data) {
            this.setSession(response.data.token);
            resolve(response.data.data);
          } else {
            reject(response.message);
          }
        })
        .catch(error => {
          reject(error.message);
        });
    });

  refreshToken = (duration="30m") =>
    new Promise((resolve, reject) => {
      axios
        .post('/auth/refresh', {duration})
        .then(response => {
          if (response.data) {
            this.setSession(response.data.token);
            resolve(response.data.data);
          } else {
            reject(response.message);
          }
        })
        .catch(error => {
          reject(error.message);
        });
    });

  generateToken = (duration="24h") =>
    new Promise((resolve, reject) => {
      axios
        .post('/auth/refresh', {duration})
        .then(response => {
          if (response.data) {
            resolve(response.data.token);
          } else {
            reject(response.message);
          }
        })
        .catch(error => {
          reject(error.message);
        });
    });

  forgotPassword = email =>
    new Promise((resolve, reject) => {
      axios
        .post('/user/forgot-password', { email })
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.error);
          }
        })
        .catch(error => {
          reject(error.error);
        });
    });

  changePassword = values =>
    new Promise((resolve, reject) => {
      axios
        .put('/user/update/user/password', values)
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.error);
          }
        })
        .catch(error => {
          reject(error.error);
        });
    });

  registerUser = (values, endpoint = '') =>
    new Promise((resolve, reject) => {
      delete values.policy;
      axios
        .post(`/auth/signup${endpoint ? '/' + endpoint : ''}`, values)
        .then(response => {
          if (response.data) {
            this.setSession(response.data.token);
            resolve(response.data.data);
          } else {
            reject(response.message);
          }
        })
        .catch(error => {
          reject(error.message);
        });
    });

    resendLoginLink = (values) =>
      new Promise((resolve, reject) => {
        delete values.policy;
        axios
          .post(`/auth/login-link`, values)
          .then(response => {
            if (response.data) {
              this.setSession(response.data.token);
              resolve(response.data.data);
            } else {
              reject(response.message);
            }
          })
          .catch(error => {
            reject(error.message);
          });
      });

  loginInWithToken = (isNotification) =>
    new Promise((resolve, reject) => {
      axios
        .get('/user')
        .then(response => {
          if (response.data.user) {
            if (
              window.location.pathname !== '/login' &&
              !response.data.user.wpUserID
            ) {
              if(isNotification){
                resolve("isNotification")
                return 
              }
              this.logout();
              return;
            }
            resolve(response.data.user);
          } else {
            if (response.data.code === 401) {
              if(isNotification){
                resolve("isNotification")
                return 
              }
              this.logout({sessionExpired: true});
            }
            reject(response.data.error);
          }
        })
        .catch(error => {
          if(isNotification){
            resolve("isNotification")
            return 
          }
          if (error.code === 401) {
            this.logout();
          }
          reject(error);
        });
    });

  logout = (logoutDetails) => {
    if(sessionStorage.getItem("onBoardingPage")){
      const encryptedEmail = sessionStorage.getItem("email")
      const route = sessionStorage.getItem("route")
      const platform = sessionStorage.getItem("platform")
      window.location.href =  `https://dev.medtigo.com/onBoardingResendEmail?email=${encodeURIComponent(encryptedEmail).replace(/%20/g, '+').replace(/\+/g, '%2B')}&route=${route}&platform=${platform}`
      sessionStorage.clear();
      return
    }
    LearningService.redirectToPlace("logged_out");
    const route = localStorage.getItem("data") 
    this.setSession(null);
    // ###############################################
    // Old logout temporay commented 
    // ##############################################
    
   
    // const currentUrl = window.location.pathname;
    const currentUrl = route ? route : window.location.pathname;

    // window.location.href = AUTH_URL + '?path=logout' +"&route="+currentUrl;
    setTimeout(() => {
    window.location.href = AUTH_URL + '?path=logout' +"&route="+currentUrl + `${logoutDetails && logoutDetails.sessionExpired ? '&sessionExpired=true' : ''}`;
    localStorage.removeItem("data")
    }, 1000);
    sessionStorage.clear();
  };
  
  
  
  logoutAndRedirectToSignUp = () => {
    this.setSession(null);
    window.location.href = AUTH_URL + 'register';
  };

  setSession = accessToken => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      PYTHON_SERVER.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      localStorage.removeItem('accessToken');
      // localStorage.removeItem('data');

      delete axios.defaults.headers.common.Authorization;
      delete PYTHON_SERVER.defaults.headers.common.Authorization;
    }
  };

  getAccessToken = () => localStorage.getItem('accessToken');

  isValidToken = async accessToken => {
    if (!accessToken) {
      return false;
    }
    try {
      const decoded = await jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (e) {
      console.log(e);
    }
  };

  validateResetToken = token =>
    new Promise((resolve, reject) => {
      axios
        .post('/user/validate-token', { resetToken: token })
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.error);
          }
        })
        .catch(error => {
          reject(error.error);
        });
    });

  resetPassword = res =>
    new Promise((resolve, reject) => {
      axios
        .post('/user/reset-user-password', res)
        .then(response => {
          if (response.data) {
            this.setSession(response.data.token);
            resolve(response.data.data);
          } else {
            reject(response.error);
          }
        })
        .catch(error => {
          reject(error.error);
        });
    });

  validateUserPassword = (email, password) =>
    new Promise((resolve, reject) => {
      this.passwordValidationCheck = true;
      axios
        .post('/auth/userLogin', { email, password })
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });

  deleteUser = () => {
    new Promise((resolve, reject) => {
      axios
        .delete('/user/')
        .then(response => {
          if (response.status === 200) {
            resolve(response);
          } else {
            reject(response);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  isAuthenticated = () => !!this.getAccessToken();
}

const authService = new AuthService();

export default authService;
