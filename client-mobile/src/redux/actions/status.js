import * as ACTIONS from "../types";

async function loading(message) {
  return async dispatch => {
    dispatch({
      type: ACTIONS.STATUS_LOADING,
      payload: {
        message
      }
    });
  };
}

async function success(message) {
  return async dispatch => {
    dispatch({
      type: ACTIONS.STATUS_LOADING,
      payload: {
        message
      }
    });
  };
}

async function error(message) {
  return async dispatch => {
    dispatch({
      type: ACTIONS.STATUS_FAIL,
      payload: {
        message
      }
    });
  };
}

const actions = {
  loading,
  success,
  error
};

export default actions;
