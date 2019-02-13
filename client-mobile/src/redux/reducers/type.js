import * as Actions from "../types";

const INITIAL_STATE = {
  loading: false,
  listType: {},
  listGeneralEquipmentType: []
};

export default function typeReducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case Actions.GET_TYPE_SUCCESS: {
      return {
        ...state,
        listType: payload
      };
    }
    case Actions.GET_GENERAL_EQUIPMENT_TYPE_SUCCESS: {
      return {
        ...state,
        listGeneralEquipmentType: payload
      };
    }
    default:
      return state;
  }
}
