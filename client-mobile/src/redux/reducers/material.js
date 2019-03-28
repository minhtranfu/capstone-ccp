import * as Actions from "../types";

const INITIAL_STATE = {
  loading: false,
  generalMaterialType: [],
  materialType: [],
  listSearch: [],
  materialList: []
};

export default function materialReducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case Actions.GET_GENERAL_MATERIAL_TYPE.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.GET_GENERAL_MATERIAL_TYPE.SUCCESS: {
      return {
        ...state,
        loading: false,
        generalMaterialType: payload.data
      };
    }
    case Actions.GET_MATERIAL_TYPE.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.GET_MATERIAL_TYPE.SUCCESS: {
      return {
        ...state,
        loading: false,
        materialType: payload.data
      };
    }
    case Actions.SEARCH_MATERIAL.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.SEARCH_MATERIAL.SUCCESS: {
      return {
        ...state,
        loading: false,
        listSearch: payload.data
      };
    }
    case Actions.SEARCH_MATERIAL.ERROR: {
      return {
        ...state,
        loading: false
      };
    }
    case Actions.ADD_NEW_MATERIAL.SUCCESS: {
      return {
        ...state,
        materialList: [...state.materialList, payload.data]
      };
    }
    case Actions.UPDATE_MATERIAL_DETAIl.SUCCESS: {
      return {
        ...state
      };
    }
    case Actions.GET_MATERIAL_LIST_BY_CONTRACTOR.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.GET_MATERIAL_LIST_BY_CONTRACTOR.SUCCESS: {
      return {
        ...state,
        loading: false,
        materialList: payload.data
      };
    }
    default:
      return state;
  }
}
