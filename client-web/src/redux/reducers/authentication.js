import { INITIAL_STATE } from '../../common/app-const';
import { authActionTypes } from '../_types';

const authentication = (state = INITIAL_STATE.authentication, action) => {
  switch (action.type) {
    case authActionTypes.LOGIN_SUCCESS:
      return {
        isAuthenticated: true,
        user: action.user
      };

    case authActionTypes.LOGIN_REQUEST:
      return {
        ...state,
        loggingIn: true,
        user: {}
      };

    case authActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        loggingIn: false,
        user: {},
        error: action.error
      };

    case authActionTypes.LOGOUT:
      return {};

    case authActionTypes.LOAD_USER_SUCCESS:
      return {
        isAuthenticated: true,
        user: action.user
      };

    case authActionTypes.LOAD_USER_FAILURE:
      return {};

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
      state.user.contractor.totalUnreadNotifications++;

      return {
        ...state
      };

    case authActionTypes.SET_NOTIFICATIONS_COUNT:
      state.user.contractor.totalUnreadNotifications = action.totalUnreadNotifications;

      return {
        ...state
      };

    case authActionTypes.MIN_NOTIFICATIONS_COUNT:
      state.user.contractor.totalUnreadNotifications--;

      return {
        ...state
      };

    default:
      return state;
  }
};

export default authentication;
