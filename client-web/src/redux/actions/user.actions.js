import { userConstants } from '../_constants';
import { authConsts } from '../../common/app-const';

import ccpServices from '../../services/domain/ccp-api-service';
import { makeActionCreator } from './action-creators';

/**
 * Decide what to export here
 */
export const userActions = {
  login,
  logout,
  loadUserFromToken
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
    dispatch({ type: userConstants.LOGIN_REQUEST });

    try {
      const user = await ccpServices.userServices.login(username, password);
      console.log(user);
      localStorage.setItem(authConsts.JWT_KEY, user.tokenWrapper.accessToken);

      dispatch({
        type: userConstants.LOGIN_SUCCESS,
        user
      });

    } catch (error) {
      dispatch({
        type: userConstants.LOGIN_FAILURE,
        error
      });
    }
  };
};

function logout() {
  return dispatch => {
    localStorage.removeItem(authConsts.JWT_KEY);
    dispatch({ type: userConstants.LOGOUT });
  };
}

function loadUserFromToken() {
  return async dispatch => {
    let token = localStorage.getItem(authConsts.JWT_KEY);
    console.log('Current JWT token', token);
    if (!token || token === '') {//if there is no token, dont bother
      return;
    }

    try {
      const contractor = await ccpServices.userServices.getUserInfo();

      dispatch({
        type: userConstants.LOGIN_SUCCESS,
        user: {
          contractor
        }
      });
    } catch (error) {
      console.log('Error!', error);
      localStorage.removeItem(authConsts.JWT_KEY);
      dispatch({ type: userConstants.LOGOUT });
    }
  };
}