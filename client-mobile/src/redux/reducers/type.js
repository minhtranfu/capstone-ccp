import * as Actions from "../types";

const INITIAL_STATE = {
  loading: false,
  listGeneralEquipmentType: []
};

export default function typeReducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case Actions.GET_GENERAL_EQUIPMENT_TYPE.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.GET_GENERAL_EQUIPMENT_TYPE_SUCCESS: {
      return {
        ...state,
        loading: false,
        listGeneralEquipmentType: payload.data
      };
    }
    default:
      return state;
  }
}
