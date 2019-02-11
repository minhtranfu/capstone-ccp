import * as Actions from "../types";

export function addNewEquipment(data) {
  return {
    type: Actions.ADD_NEW_CART,
    payload: data
  };
}

export function updateCart(id, quantity) {
  return {
    type: Actions.UPDATE_CART,
    payload: { id, quantity }
  };
}

export function removeItemCart(id) {
  return {
    type: Actions.REMOVE_ITEM_CART,
    id
  };
}

export function removeCart() {
  return {
    type: Actions.REMOVE_CART
  };
}
