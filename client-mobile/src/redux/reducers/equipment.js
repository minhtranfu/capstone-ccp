import * as Actions from "../types";

const INITIAL_STATE = {
  loading: false,
  searchLoading: false,
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
    case Actions.ADD_EQUIPMENT.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.ADD_EQUIPMENT.SUCCESS: {
      return {
        ...state,
        loading: false,
        contractorEquipment: [...state.contractorEquipment, payload.data]
      };
    }
    case Actions.ADD_EQUIPMENT.ERROR: {
      return {
        ...state,
        loading: false
      };
    }
    case Actions.UPDATE_EQUIPMENT.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.UPDATE_EQUIPMENT.SUCCESS: {
      return {
        ...state,
        loading: false,
        contractorEquipment: state.contractorEquipment.map(item =>
          item.id === payload.id ? (item = payload.data.data) : item
        )
      };
    }
    case Actions.UPDATE_EQUIPMENT_STATUS.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.UPDATE_EQUIPMENT_STATUS.SUCCESS: {
      return {
        ...state,
        loaing: false,
        contractorEquipment: state.contractorEquipment.map(item =>
          item.id === payload.id ? (item = payload.data.data) : item
        )
      };
    }
    case Actions.REMOVE_EQUIPMENT.SUCCESS:
      return {
        ...state
      };
    case Actions.SEARCH_EQUIPMENT.REQUEST: {
      return {
        ...state,
        searchLoading: true
      };
    }
    case Actions.SEARCH_EQUIPMENT.SUCCESS:
      return {
        ...state,
        searchLoading: false,
        listSearch: payload.data
      };
    case Actions.SEARCH_EQUIPMENT.ERROR:
      return {
        ...state,
        searchLoading: false
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
