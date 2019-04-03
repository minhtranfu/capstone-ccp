import { authConstants } from '../_constants';
import { appConsts } from '../../common/app-const';

import ccpServices from '../../services/domain/ccp-api-service';
import { makeActionCreator } from './action-creators';
import { askForPermissioToReceiveNotifications } from "../../push-notification";

/**
 * Decide what to export here
 */
export const authActions = {
  login,
  loginSuccess,
  logout,
  loadUserFromToken,
  showLoginModal,
  hideLoginModal,
  toggleLoginModal,
  addNotificationsCount,
  minusNotificationsCount
};

/**
 * Define actions below
 */

/**
 * 
 * @param {string} username 
 * @param {string} password 
 */
function login(username, password) {
  return async dispatch => {
    dispatch({ type: authConstants.LOGIN_REQUEST });

    try {
      const user = await ccpServices.userServices.login(username, password);
      console.log(user);
      localStorage.setItem(appConsts.JWT_KEY, user.tokenWrapper.accessToken);

      dispatch(loginSuccess(user));
      askForPermissioToReceiveNotifications();

    } catch (error) {
      dispatch({
        type: authConstants.LOGIN_FAILURE,
        error
      });
    }
  };
};

function logout() {
  return async dispatch => {
    // unsubcribe notification
    const token = localStorage.getItem(appConsts.NOTI_TOKEN);
    if (token) {
      await ccpServices.userServices.unsubcribeNotification(token);
    }

    localStorage.removeItem(appConsts.JWT_KEY);
    dispatch({ type: authConstants.LOGOUT });
  };
}

function loadUserFromToken() {
  return async dispatch => {
    let token = localStorage.getItem(appConsts.JWT_KEY);
    console.log('Current JWT token', token);
    if (!token || token === '') {//if there is no token, dont bother
      return;
    }

    try {
      const contractor = await ccpServices.userServices.getUserInfo();

      dispatch({
        type: authConstants.LOAD_USER_SUCCESS,
        user: {
          contractor
        }
      });

      askForPermissioToReceiveNotifications();
    } catch (error) {
      console.log('Error!', error);
      localStorage.removeItem(appConsts.JWT_KEY);
      dispatch({ type: authConstants.LOAD_USER_FAILURE });
    }
  };
}

function loginSuccess(user) {
  return {
    type: authConstants.LOGIN_SUCCESS,
    user
  }
}

function showLoginModal() {
  return {
    type: authConstants.LOGIN_MODAL_SHOW
  };
}

function hideLoginModal() {
  return {
    type: authConstants.LOGIN_MODAL_HIDE
  };
}

function toggleLoginModal() {
  return {
    type: authConstants.LOGIN_MODAL_TOGGLE
  };
}

function minusNotificationsCount() {
  return {
    type: authConstants.MIN_NOTIFICATIONS_COUNT
  }
}

function addNotificationsCount() {
  return {
    type: authConstants.ADD_NOTIFICATIONS_COUNT
  }
}
