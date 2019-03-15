import * as Actions from "../types";

const initialState = {
  loading: false,
  info: {},
  constructionList: [],
  feedbackList: [],
  feedbackTypes: []
};

export default function contractorReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (action.type) {
    case Actions.GET_CONTRACTOR.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.GET_CONTRACTOR.SUCCESS: {
      return {
        ...state,
        loading: false,
        info: payload.data
      };
    }
    case Actions.GET_CONTRACTOR.ERROR: {
      return {
        ...state,
        loading: false
      };
    }
    case Actions.UPDATE_CONTRACTOR_DETAIL.SUCCESS: {
      return {
        ...state,
        info: payload.data
      };
    }
    case Actions.GET_CONSTRUCTION_LIST.SUCCESS: {
      return {
        ...state,
        constructionList: payload.data
      };
    }
    case Actions.CREATE_CONSTRUCTION.SUCCESS: {
      return {
        ...state,
        constructionList: [...state.constructionList, payload.data]
      };
    }
    case Actions.UPDATE_CONSTRUCTION.SUCCESS: {
      return {
        ...state,
        constructionList: state.constructionList.map(item =>
          item.id === payload.id ? (item = payload.data.data) : item
        )
      };
    }
    case Actions.DELETE_CONSTRUCTION.SUCCESS: {
      return {
        ...state,
        constructionList: state.constructionList.filter(
          item => item.id !== payload.id
        )
      };
    }
    case Actions.GET_LIST_FEEDBACK.SUCCESS: {
      return {
        ...state,
        feedbackList: payload.data
      };
    }
    case Actions.LIST_FEEDBACK_TYPES.SUCCESS: {
      return {
        ...state,
        feedbackType: payload.data
      };
    }
    case Actions.CREATE_NEW_FEEDBACK.SUCCESS: {
      return {
        ...state
      };
    }
    default:
      return state;
  }
}
