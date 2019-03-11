import * as ACTIONS from "../types";

function loading(message) {
  return {
    type: ACTIONS.STATUS_LOADING,
    payload: {
      message
    }
  };
}

function success(message, time) {
  return {
    type: ACTIONS.STATUS_SUCCESS,
    payload: {
      message,
      time
    }
  };
}

function error(status, message, time) {
  console.log("actions message", message);
  return {
    type: ACTIONS.STATUS_ERROR,
    payload: {
      message,
      time,
      status
    }
  };
}

const actions = {
  loading,
  success,
  error
};

export default actions;
