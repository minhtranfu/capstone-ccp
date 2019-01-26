import * as Actions from "../types";

const Initial_State = {
  loading: false,
  detail: {}
};

export default function equipmentReducer(state = Initial_State, action) {
  const { type, payload } = action;
  switch (type) {
    case Actions.EQUIPMENT_DETAIL_SUCCESS: {
      return {
        ...state,
        detail: payload
      };
    }
    default:
      return state;
  }
}
