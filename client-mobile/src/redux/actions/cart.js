import * as Actions from "../types";
import axios from "axios";

export function getCartList(contractorId) {
  return async dispatch => {
    dispatch({
      type: Actions.GET_LIST_CART.REQUEST
    });
    const res = await axios.get(`contractors/${contractorId}/cart`);
    dispatch({
      type: Actions.GET_LIST_CART.SUCCESS,
      payload: res
    });
  };
}

export function addItemToCart(contractorId, equipment) {
  return async dispatch => {
    const res = await axios.post(`contractors/${contractorId}/cart`, equipment);
    dispatch({
      type: Actions.ADD_ITEM_CART.SUCCESS,
      payload: res
    });
  };
}

export function updateCartItem(contractorId, cartItemId, equipment) {
  return async dispatch => {
    const res = await axios.put(
      `contractors/${contractorId}/cart/${cartItemId}`,
      equipment
    );
    dispatch({
      type: Actions.UPDATE_ITEM_CART.SUCCESS,
      payload: { data: res, id: cartItemId }
    });
  };
}

export function removeItemCart(contractorId, cartItemId) {
  return async dispatch => {
    const res = await axios.delete(
      `contractors/${contractorId}/cart/${cartItemId}`
    );
    dispatch({
      type: Actions.REMOVE_ITEM_CART.SUCCESS,
      payload: { data: res, id: cartItemId }
    });
  };
}

export function cartCheckout(contractorId) {
  return async dispatch => {
    const res = await axios.post(`contractors/${contractorId}/cart/send`);
    dispatch({
      type: Actions.CART_CHECK_OUT.SUCCESS,
      payload: res
    });
  };
}

export function addMaterialItemToCart(data) {
  return {
    type: Actions.ADD_MATERIAL_ITEM.SUCCESS,
    payload: data
  };
}

export function updateMaterialItemToCart(id, data) {
  return {
    type: Actions.UPDATE_MATERIAL_ITEM_TO_CART.SUCCESS,
    payload: { data, id }
  };
}

export function removeMaterialItemFromCart(id) {
  return {
    type: Actions.REMOVE_MATERIAL_ITEM_TO_CART.SUCCESS,
    payload: id
  };
}

export function clearMaterialCart() {
  return {
    type: Actions.CLEAR_MATERIAL_CART.SUCCESS
  };
}
