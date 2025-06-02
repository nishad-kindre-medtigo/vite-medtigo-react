import axios from '../utils/axios';
import authService from '../services/authService';

export const LOGIN_REQUEST = '@account/login-request';
export const LOGIN_SUCCESS = '@account/login-success';
export const LOGIN_FAILURE = '@account/login-failure';
export const UPDATE_DOCTORID = '@account/UPDATE_DOCTORID';
export const SILENT_LOGIN = '@account/silent-login';
export const LOGOUT = '@account/logout';
export const UPDATE_PROFILE = '@account/update-profile';
export const UPDATE_PICTURE = '@account/update-picture';
export const isNotification = '@account/notification';

export function login(email, password, isMobile) {
  return async (dispatch) => {
    try {
      dispatch({type: LOGIN_REQUEST});
      const user = await authService.loginWithEmailAndPassword(email, password);
      const appendWPToken = user.wp_token ? '?t='+user.wp_token : '';
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          user
        }
      });
        // window.location.href = "https://medtigo.com/" + appendWPToken;
        // window.open("https://medtigo.com/" + appendWPToken,'')

    } catch (error) {
      dispatch({type: LOGIN_FAILURE});
      throw error;
    }
  };
}

export function setUserData(user) {
  return (dispatch) => dispatch({
    type: SILENT_LOGIN,
    payload: {
      user
    }
  });
}

export function updateUserData(response) {
  return (dispatch) => dispatch({
    type: UPDATE_DOCTORID,
    payload: {
      response
    }
  });
}

export function logout() {
  return async (dispatch) => {
    if (authService.getAccessToken() === "no_value") {
      authService.setSession("no_value");
      dispatch({type: LOGIN_FAILURE});
    } else {
      return async (dispatch) => {
        authService.logout();
        dispatch({
          type: LOGOUT
        });
      };
    }
  };
}

export function updateProfile(update) {
  return async (dispatch) => {
      const user = await authService.updateUserProfile(update);
      dispatch({
        type: UPDATE_PROFILE,
        payload: user
      });
  };
}

export function updateProfilePicture(file) {
  return dispatch => {
    dispatch({
      type: UPDATE_PICTURE,
      payload: file
    });
  }
}
