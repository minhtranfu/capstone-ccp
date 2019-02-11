import axios from "axios";
import * as Actions from "../types";
import { baseUrl } from "../baseUrl";

export function getEquipmentDetail(id) {
  return async dispatch => {
    const data = await axios.get(`equipments/${id}`);
    dispatch({
      type: Actions.GET_EQUIPMENT_DETAIL_SUCCESS,
      payload: data
    });
  };
}

export function getTransactionDetail(id) {
  return async dispatch => {
    const data = await axios.get(`transaction/${id}`);
    dispatch({
      type: Actions.GET_TRANSACTION_DETAIL_SUCCESS,
      payload: data
    });
  };
}

export function addNewEquipment(data) {
  return {
    type: Actions.ADD_EQUIPMENT,
    payload: data
  };
}

export function updateEquipment(id, status) {
  return {
    type: Actions.UPDATE_EQUIPMENT,
    payload: { id, status }
  };
}

export function removeEquipment(id) {
  return {
    type: Actions.REMOVE_EQUIPMENT,
    id
  };
}

export function listEquipmentBySupplierId(id) {
  return async dispatch => {
    const data = await axios.get(`transactions/supplier/${id}`);
    dispatch({
      type: Actions.LIST_SUPPLIER_EQUIPMENT_SUCCESS,
      payload: data
    });
  };
}

export function listEquipmentByRequesterId(id) {
  return async dispatch => {
    const data = await axios.get(`transactions/requester/${id}`);
    dispatch({
      type: Actions.LIST_REQUESTER_EQUIPMENT_SUCCESS,
      payload: data
    });
  };
}

export function searchEquipment(text, beginDate, endDate) {
  return async dispatch => {
    const res = await axios.get(
      `equipments?begin_date=${beginDate}&end_date=${endDate}&lquery=${text}`
    );
    dispatch({
      type: Actions.SEARCH_EQUIPMENT_SUCCESS,
      payload: res
    });
  };
}
