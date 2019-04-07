import { authActionTypes } from 'Redux/_types';
import { appConsts } from 'Common/app-const';

import ccpServices from 'Services/domain/ccp-api-service';
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
  minusNotificationsCount,
  setUnreadNotificationsCount
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
    dispatch({ type: authActionTypes.LOGIN_REQUEST });

    try {
      const user = await ccpServices.userServices.login(username, password);
      console.log(user);
      localStorage.setItem(appConsts.JWT_KEY, user.tokenWrapper.accessToken);

      dispatch(loginSuccess(user));
      askForPermissioToReceiveNotifications();

    } catch (error) {
      dispatch({
        type: authActionTypes.LOGIN_FAILURE,
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
    dispatch({ type: authActionTypes.LOGOUT });
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
        type: authActionTypes.LOAD_USER_SUCCESS,
        user: {
          contractor
        }
      });

      askForPermissioToReceiveNotifications();
    } catch (error) {
      console.log('Error!', error);
      localStorage.removeItem(appConsts.JWT_KEY);
      dispatch({ type: authActionTypes.LOAD_USER_FAILURE });
    }
  };
}

function loginSuccess(user) {
  return {
    type: authActionTypes.LOGIN_SUCCESS,
    user
  }
}

function showLoginModal() {
  return {
    type: authActionTypes.LOGIN_MODAL_SHOW
  };
}

function hideLoginModal() {
  return {
    type: authActionTypes.LOGIN_MODAL_HIDE
  };
}

function toggleLoginModal() {
  return {
    type: authActionTypes.LOGIN_MODAL_TOGGLE
  };
}

function minusNotificationsCount({ unreadNotificationIds, readNotificationIds }) {
  return {
    type: authActionTypes.MIN_NOTIFICATIONS_COUNT,
    unreadNotificationIds,
    readNotificationIds,
  }
}

function addNotificationsCount({ unreadNotificationIds, readNotificationIds }) {
  return {
    type: authActionTypes.ADD_NOTIFICATIONS_COUNT,
    unreadNotificationIds,
    readNotificationIds,
  }
}

function setUnreadNotificationsCount({ totalUnreadNotifications, readNotificationIds, unreadNotificationIds }) {
  return {
    type: authActionTypes.SET_NOTIFICATIONS_COUNT,
    totalUnreadNotifications,
    readNotificationIds,
    unreadNotificationIds
  }
}
