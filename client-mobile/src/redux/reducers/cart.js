import * as Actions from "../types";

const INITIAL_STATE = {
  loading: false,
  list: [],
  listMaterial: []
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
    case Actions.ADD_MATERIAL_ITEM_TO_CART.SUCCESS: {
      //check if data is exist in array
      if (state.listMaterial.find(item => item.id === payload.id)) {
        return {
          ...state,
          listMaterial: state.listMaterial.map(item =>
            item.id === payload.id ? { ...item, data: payload.data } : item
          )
        };
      } else {
        return {
          ...state,
          listMaterial: [
            ...state.listMaterial,
            { id: payload.id, data: payload }
          ]
        };
      }
    }
    case Actions.UPDATE_MATERIAL_ITEM_TO_CART.SUCCESS: {
      return {
        ...state
        // listMaterial: state.listMaterial.map(item =>
        //   item.id === payload.id ? (item = payload.data) : item
        // )
      };
    }
    case Actions.REMOVE_MATERIAL_ITEM_FROM_CART: {
      return {
        ...state,
        listMaterial: listMaterial.filter(item => item.id !== payload)
      };
    }
    case Actions.CLEAR_MATERIAL_CART.SUCCESS: {
      return {
        ...state,
        listMaterial: []
      };
    }
    default:
      return state;
  }
}
