import * as Actions from "../types";

const INITIAL_STATE = {
  loading: false,
  generalMaterialType: [],
  materialType: [],
  listMaterial: []
};

export default function materialReducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case Actions.GET_GENERAL_MATERIAL_TYPE.SUCCESS: {
      return {
        ...state,
        generalMaterialType: payload.data
      };
    }
    case Actions.GET_MATERIAL_TYPE: {
      return {
        ...state,
        materialType: payload.data
      };
    }
    case Actions.SEARCH_MATERIAL.SUCCESS: {
      return {
        ...state,
        listMaterial: payload.data
      };
    }
    case Actions.ADD_NEW_MATERIAL.SUCCESS: {
      return {
        ...state
      };
    }
    case Actions.UPDATE_MATERIAL_DETAIl.SUCCESS: {
      return {
        ...state
      };
    }
    default:
      return state;
  }
}
