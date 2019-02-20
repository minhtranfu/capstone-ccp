import * as ACTIONS from "../types";

const initialState = {
  loading: false,
  info: {},
  constructionList: []
};

export default function contractorReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (action.type) {
    case ACTIONS.GET_CONTRACTOR_SUCCESS: {
      return {
        ...state,
        info: payload
      };
    }
    case ACTIONS.GET_CONSTRUCTION_SUCCESS: {
      return {
        ...state,
        constructionList: payload
      };
    }
    default:
      return state;
  }
}
