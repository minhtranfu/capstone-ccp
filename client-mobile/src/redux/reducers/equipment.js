import * as Actions from "../types";

const INITIAL_STATE = {
  loading: false,
  detail: {},
  equipmentStatus: {},
  listSearch: [],
  listRequesterEquipment: [],
  contractorEquipment: []
};

export default function equipmentReducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case Actions.GET_EQUIPMENT_DETAIL_SUCCESS: {
      return {
        ...state,
        detail: payload
      };
    }
    case Actions.LIST_CONTRACTOR_EQUIPMENT_SUCCESS: {
      return {
        ...state,
        contractorEquipment: payload
      };
    }
    case Actions.LIST_REQUESTER_EQUIPMENT_SUCCESS: {
      return {
        ...state,
        listRequesterEquipment: payload
      };
    }
    case Actions.ADD_EQUIPMENT: {
      return {
        ...state,
        contractorEquipment: [...state.contractorEquipment, payload]
      };
    }
    case Actions.UPDATE_EQUIPMENT: {
      return {
        ...state,
        detail: payload
      };
    }
    case Actions.UPDATE_EQUIPMENT_STATUS_SUCCESS: {
      return {
        ...state,
        equipmentStatus: payload
      };
    }
    case Actions.REMOVE_EQUIPMENT:
      return {
        ...state,
        equipmentStatus: payload
      };
    case Actions.SEARCH_EQUIPMENT_SUCCESS:
      return {
        ...state,
        listSearch: payload
      };
    case Actions.CLEAR_SEARCH_RESULT:
      return {
        ...state,
        listSearch: []
      };
    case Actions.CLEAR_EQUIPMENT_DETAIL:
      return {
        ...state,
        detail: {}
      };
    default:
      return state;
  }
}
