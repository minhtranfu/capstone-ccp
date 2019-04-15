import { materialCartActionTypes } from "Redux/_types";

export const materialCartActions = {
  addItem,
  removeItem,
  updateItem,
  clear,
};

/**
 * Add an item into cart
 * @param {materialObject} item Material object need to add into cart with quantity attribute
 */
function addItem(item) {
  return {
    type: materialCartActionTypes.MATERIAL_CART_ITEM_ADD,
    item
  };
}

/**
 * Remove an item from cart
 * @param {int} itemId Id of item will be removed from cart
 */
function removeItem(itemId) {
  return {
    type: materialCartActionTypes.MATERIAL_CART_ITEM_REMOVE,
    itemId
  };
}

/**
 * Replace current material with the new one
 * @param {materialObject} item New material object need to replace the current in cart
 */
function updateItem(item) {
  return {
    type: materialCartActionTypes.MATERIAL_CART_ITEM_UPDATE,
    item
  };
}

/**
 * Make cart empty
 */
function clear() {
  return {
    type: materialCartActionTypes.MATERIAL_CART_CLEAR
  }
}
