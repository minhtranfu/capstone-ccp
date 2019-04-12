import { INITIAL_STATE } from '../../common/app-const';
import { authActionTypes } from '../_types';

const authentication = (state = INITIAL_STATE.authentication, action) => {
  switch (action.type) {
    case authActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        contractor: action.contractor
      };

    case authActionTypes.LOGIN_REQUEST:
      return {
        ...state,
        loggingIn: true,
      };

    case authActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        loggingIn: false,
        error: action.error
      };

    case authActionTypes.LOGOUT:
      return {
        ...INITIAL_STATE.authentication,
        authenticating: false
      };

    case authActionTypes.LOAD_USER_SUCCESS:
      return {
        ...state,
        authenticating: false,
        isAuthenticated: true,
        contractor: action.contractor
      };

    case authActionTypes.LOAD_USER_FAILURE:
      return {
        ...state,
        authenticating: false
      };

    case authActionTypes.LOGIN_MODAL_SHOW:
      return {
        ...state,
        isShowLoginModal: true
      }

    case authActionTypes.LOGIN_MODAL_HIDE:
      return {
        ...state,
        isShowLoginModal: false
      };

    case authActionTypes.LOGIN_MODAL_TOGGLE:
      return {
        ...state,
        isShowLoginModal: !state.isShowLoginModal
      };

    case authActionTypes.ADD_NOTIFICATIONS_COUNT:
      state.contractor.totalUnreadNotifications++;

      return {
        ...state,
        unreadNotificationIds: action.unreadNotificationIds,
        readNotificationIds: action.readNotificationIds
      };

    case authActionTypes.MIN_NOTIFICATIONS_COUNT:
      state.contractor.totalUnreadNotifications--;

      return {
        ...state,
        unreadNotificationIds: action.unreadNotificationIds,
        readNotificationIds: action.readNotificationIds
      };

    case authActionTypes.SET_NOTIFICATIONS_COUNT:
      state.contractor.totalUnreadNotifications = action.totalUnreadNotifications;

      return {
        ...state,
        unreadNotificationIds: action.unreadNotificationIds,
        readNotificationIds: action.readNotificationIds
      };

    default:
      return state;
  }
};

export default authentication;
