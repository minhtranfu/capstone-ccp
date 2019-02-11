import * as Actions from "../types";

const INITIAL_STATE = {
  loading: false,
  list: []
};

export default function cartReducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case Actions.ADD_NEW_CART: {
      return {
        ...state,
        list: [...state.list, ...payload]
      };
    }
    case Actions.UPDATE_CART: {
      return {
        ...state,
        list: state.list.map(item => {
          if (item.id === payload.id)
            return Object.assign({}, item, { quantity: payload.quantity });
          return item;
        })
      };
    }
    case Actions.REMOVE_ITEM_EQUIPMENT:
      return {
        ...state,
        list: state.list.filter(x => x.id !== action.id)
      };
    case Actions.REMOVE_EQUIPMENT:
      return {
        ...state,
        list: []
      };
    default:
      return state;
  }
}
