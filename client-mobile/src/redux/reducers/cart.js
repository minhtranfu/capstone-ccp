import * as Actions from "../types";

const INITIAL_STATE = {
  loading: false,
  list: []
};

export default function cartReducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case Actions.GET_LIST_CART.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.GET_LIST_CART.SUCCESS: {
      return {
        ...state,
        loading: false,
        list: payload.data
      };
    }
    case Actions.ADD_ITEM_CART.SUCCESS: {
      return {
        ...state,
        list: [...state.list, payload.data]
      };
    }
    case Actions.UPDATE_ITEM_CART.SUCCESS: {
      return {
        ...state,
        list: state.list.map(item =>
          item.id === payload.id ? (item = payload.data.data) : item
        )
      };
    }
    case Actions.REMOVE_ITEM_CART.SUCCESS: {
      return {
        ...state,
        list: state.list.filter(item => item.id !== payload.id)
      };
    }
    case Actions.CART_CHECK_OUT.SUCCESS: {
      return {
        ...state,
        list: []
      };
    }
    default:
      return state;
  }
}
