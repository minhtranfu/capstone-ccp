import * as Actions from "../types";

const INITIAL_STATE = {
  loading: false,
  listSearch: [],
  contractorEquipment: []
};

export default function equipmentReducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case Actions.LIST_CONTRACTOR_EQUIPMENT.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.LIST_CONTRACTOR_EQUIPMENT.SUCCESS: {
      return {
        ...state,
        loading: false,
        contractorEquipment: payload.data
      };
    }
    case Actions.ADD_EQUIPMENT.SUCCESS: {
      return {
        ...state,
        contractorEquipment: [...state.contractorEquipment, payload.data]
      };
    }
    case Actions.UPDATE_EQUIPMENT.SUCCESS: {
      return {
        ...state,
        contractorEquipment: state.contractorEquipment.map(item =>
          item.id === payload.id ? item === payload.data.data : item
        )
      };
    }
    case Actions.UPDATE_EQUIPMENT_STATUS.SUCCESS: {
      return {
        ...state,
        contractorEquipment: state.contractorEquipment.map(item =>
          item.id === payload.id ? item === payload.data.data : item
        )
      };
    }
    case Actions.REMOVE_EQUIPMENT.SUCCESS:
      return {
        ...state
      };
    case Actions.SEARCH_EQUIPMENT.SUCCESS:
      return {
        ...state,
        listSearch: payload.data
      };
    case Actions.CLEAR_SEARCH_RESULT.SUCCESS:
      return {
        ...state,
        listSearch: []
      };
    default:
      return state;
  }
}
