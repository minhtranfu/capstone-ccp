import { INITIAL_STATE } from 'Common/app-const';
import { equipmentTypeCategoryActionTypes } from "Redux/_types";

// ====== Map action with action handler
const actionMapper = {
  [equipmentTypeCategoryActionTypes.EQUIPMENT_TYPE_CATEGORY_ALL_REQUEST]: startFetching,
  [equipmentTypeCategoryActionTypes.EQUIPMENT_TYPE_CATEGORY_ALL_FAILURE]: fetchingFailure,
  [equipmentTypeCategoryActionTypes.EQUIPMENT_TYPE_CATEGORY_ALL_SUCCESS]: fetchingSuccess,
};

// ====== Common reducer
export default (state = INITIAL_STATE.equipmentTypeCategory, action) => {
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
