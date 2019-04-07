import { INITIAL_STATE } from 'Common/app-const';
import { materialCartActionTypes } from "Redux/_types";


export default (state = INITIAL_STATE.materialCart, action) => {
  switch (action.type) {
    // Add new item
    case materialCartActionTypes.MATERIAL_CART_ITEM_ADD: {
      let items;
      let itemIds = [
        ...state.itemIds
      ];
      if (state.itemIds.includes(action.item.id)) {
        items = state.items.map(item => {
          if (item.id !== action.item.id) {
            return item;
          }

          item.quantity += action.item.quantity;

          return item;
        });
      } else {
        items = [
          ...state.items,
          action.item
        ];
        itemIds.push(action.item.id);
      }

      return {
        ...state,
        items,
        itemIds,
        count: state.count + action.item.quantity,
      };
    }

    // Remove one item by Id
    case materialCartActionTypes.MATERIAL_CART_ITEM_REMOVE: {
      let minusCount = 0;
      return {
        ...state,
        items: state.items.filter(item => {
          if (item.id === action.itemId) {
            minusCount = item.quantity;
          }

          return item.id !== action.itemId;
        }),
        itemIds: state.itemIds.filter(id => id !== action.item.id),
        count: state.count - minusCount,
      };
    }

    // Replace one item
    case materialCartActionTypes.MATERIAL_CART_ITEM_UPDATE: {
      let countChange = 0;
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id !== action.item.id) {
            return item;
          }
          countChange = item.quantity - action.item.quantity;

          return action.item;
        }),
        count: state.count + countChange,
      };
    }

    // Clear cart
    case materialCartActionTypes.MATERIAL_CART_CLEAR: {
      return INITIAL_STATE.materialCart
    }

    default: {
      return state;
    }
  }
};

function addItem(state, action) {
  
}
