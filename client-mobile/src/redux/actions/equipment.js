import axios from "axios";
import StatusAction from "./status";
import * as Actions from "../types";
import { ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS } from "expo/build/IntentLauncherAndroid";

export function getEquipmentDetail(id) {
  return async dispatch => {
    const res = await axios.get(`equipments/${id}`);
    dispatch({
      type: Actions.GET_EQUIPMENT_DETAIL_SUCCESS,
      payload: res
    });
  };
}

export function getTransactionDetail(id) {
  return async dispatch => {
    const res = await axios.get(`transactions/${id}`);
    dispatch({
      type: Actions.GET_TRANSACTION_DETAIL_SUCCESS,
      payload: res
    });
  };
}

export function clearTransactionDetail() {
  return {
    type: Actions.CLEAR_TRANSACTION_DETAIL
  };
}

export function addEquipment(equipment) {
  return async dispatch => {
    try {
      const res = await axios.post(`equipments`, equipment);
    } catch (error) {
      console.log(error);
    }
    dispatch({
      type: Actions.ADD_EQUIPMENT
    });
  };
}

// export function addNewEquipment(data) {
//   return {
//     type: Actions.ADD_EQUIPMENT,
//     payload: data
//   };
// }

export function updateEquipment(id) {
  return async dispatch => {
    try {
      const res = await axios.put(`equipments`, equipment);
    } catch (error) {
      console.log(error);
    }
    dispatch({
      type: Actions.UPDATE_EQUIPMENT,
      payload: res
    });
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
    const res = await axios.get(`transactions/supplier/${id}`);
    dispatch({
      type: Actions.LIST_SUPPLIER_EQUIPMENT_SUCCESS,
      payload: res
    });
  };
}

export function listEquipmentByRequesterId(id) {
  return async dispatch => {
    const res = await axios.get(`transactions/requester/${id}`);
    dispatch({
      type: Actions.LIST_REQUESTER_EQUIPMENT_SUCCESS,
      payload: res
    });
  };
}

export function searchEquipment(address, long, lat, beginDate, endDate) {
  if (beginDate && endDate) {
    const url = `equipments?begin_date=${beginDate}&end_date=${endDate}&long=${long}&lad=${lat}&lquery=${address}`;
  } else {
    const url = `equipments?long=${long}&lad=${lat}&lquery=${address}`;
  }
  return async dispatch => {
    const res = await axios.get(url);
    dispatch({
      type: Actions.SEARCH_EQUIPMENT_SUCCESS,
      payload: res
    });
  };
}
