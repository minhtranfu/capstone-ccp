import * as Actions from "../types";

const INITIAL_STATE = {
  loading: false,
  detail: {},
  list: [],
  listSearch: [],
  listRequesterEquipment: []
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

    case Actions.LIST_REQUESTER_EQUIPMENT_SUCCESS: {
      return {
        ...state,
        listRequesterEquipment: payload
      };
    }
    case Actions.ADD_EQUIPMENT: {
      return {
        ...state
      };
    }
    case Actions.UPDATE_EQUIPMENT: {
      console.log(payload.status);
      return {
        ...state,
        list: state.list.map(item => {
          if (item.id === payload.id)
            return Object.assign({}, item, { status: payload.status });
          return item;
        })
      };
    }
    case Actions.REMOVE_EQUIPMENT:
      return {
        ...state,
        list: state.list.filter(x => x.id !== action.id)
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

    default:
      return state;
  }
}
