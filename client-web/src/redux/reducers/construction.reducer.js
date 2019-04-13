import { INITIAL_STATE } from 'Common/app-const';
import { constructionActionTypes } from "Redux/_types";

// ====== Map action with action handler
const actionMapper = {
  [constructionActionTypes.CONSTRUCTION_ALL_REQUEST]: startFetching,
  [constructionActionTypes.CONSTRUCTION_ALL_FAILURE]: fetchingFailure,
  [constructionActionTypes.CONSTRUCTION_ALL_SUCCESS]: fetchingSuccess,
};

// ====== Common reducer
export default (state = INITIAL_STATE.construction, action) => {
  if (actionMapper[action.type]) {
    const actionHandler = actionMapper[action.type];
    return actionHandler(state, action);
  }

  return state;
};

// ====== Action handlers

/**
 * 
 * @param {*} state 
 */
function startFetching(state) {
  return {
    ...state,
    isFetching: !state.isFetching,
  };
}

function fetchingFailure(state, action) {
  return {
    ...state,
    isFetching: false,
    errorMessage: action.errorMessage,
  };
}

function fetchingSuccess(state, action) {
  return {
    ...state,
    isFetching: false,
    errorMessage: undefined,
    items: action.items,
  };
}
