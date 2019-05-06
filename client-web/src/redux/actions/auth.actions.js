import { authActionTypes } from 'Redux/_types';
import { appConsts } from 'Common/app-const';

import { askForPermissioToReceiveNotifications } from "../../push-notification";
import { userServices } from 'Services/domain/ccp';
import { getErrorMessage, setTokens } from 'Utils/common.utils';

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
  setUnreadNotificationsCount,
  setVerifyingImageItems,
  loadVerifyingImages,
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
      const user = await userServices.login(username, password);
      const { accessToken, refreshToken } = user.tokenWrapper;
      setTokens(accessToken, refreshToken);

      dispatch(loginSuccess(user.contractor));
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
    try {
      const token = localStorage.getItem(appConsts.NOTI_TOKEN);
      if (token) {
        await userServices.unsubcribeNotification(token);
      }
    } catch (error) {
      console.log(error);
    }

    localStorage.removeItem(appConsts.JWT_KEY);
    dispatch({ type: authActionTypes.LOGOUT });
  };
}

function loadUserFromToken() {
  return async dispatch => {
    const token = localStorage.getItem(appConsts.JWT_KEY);
    console.log('Current JWT token', token);
    if (!token || token === '') {//if there is no token, dont bother
      return;
    }

    try {
      const contractor = await userServices.getUserInfo();

      dispatch({
        type: authActionTypes.LOAD_USER_SUCCESS,
        contractor
      });

      askForPermissioToReceiveNotifications();
    } catch (error) {
      console.log('Error!', error);
      localStorage.removeItem(appConsts.JWT_KEY);
      dispatch({ type: authActionTypes.LOAD_USER_FAILURE });
    }
  };
}

function loginSuccess(contractor) {
  return {
    type: authActionTypes.LOGIN_SUCCESS,
    contractor
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

function setVerifyingImageItems(items) {
  return {
    type: authActionTypes.VERIFYING_IMAGES_SET,
    items
  }
}

function loadVerifyingImages(contractorId) {
  return async dispatch => {
    dispatch({
      type: authActionTypes.VERIFYING_IMAGES_REQUEST,
    });

    try {
      const items = await userServices.getVerifyingImages(contractorId);

      dispatch({
        type: authActionTypes.VERIFYING_IMAGES_SUCCESS,
        items,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      dispatch({
        type: authActionTypes.VERIFYING_IMAGES_FAILURE,
        errorMessage,
      });
    }
  };
}
