import axios from "axios";
import StatusAction from "./status";
import * as Actions from "../types";
import { ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS } from "expo/build/IntentLauncherAndroid";

export function getEquipmentDetail(id) {
  return async dispatch => {
    const res = await axios.get(`equipments/${id}`);
    dispatch({
      type: Actions.GET_EQUIPMENT_DETAIL_SUCCESS,
      payload: res.data
    });
  };
}

export function getContractorEquipmentList(contractorId) {
  return async dispatch => {
    const res = await axios.get(`contractors/${contractorId}/equipments`);
    dispatch({
      type: Actions.LIST_CONTRACTOR_EQUIPMENT_SUCCESS,
      payload: res.data
    });
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
      type: Actions.ADD_EQUIPMENT,
      payload: res.data
    });
  };
}

export function updateEquipment(equipmentId, equipment) {
  return async dispatch => {
    try {
      const res = await axios.put(`equipments/${equipmentId}`, equipment);
      dispatch({
        type: Actions.UPDATE_EQUIPMENT,
        payload: res.data
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export function updateEquipmentStatus(equipmentId, status) {
  return async dispatch => {
    try {
      const res = await axios.put(`equipments/${equipmentId}/status`, status);
      dispatch({
        type: Actions.UPDATE_EQUIPMENT_STATUS_SUCCESS,
        payload: res.data
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export function removeEquipment(id) {
  return {
    type: Actions.REMOVE_EQUIPMENT,
    id
  };
}

export function listEquipmentByRequesterId(id) {
  return async dispatch => {
    try {
      const res = await axios.get(`transactions/requester/${id}`);
      dispatch({
        type: Actions.LIST_REQUESTER_EQUIPMENT_SUCCESS,
        payload: res
      });
    } catch {}
  };
}

export function searchEquipment(address, long, lat, beginDate, endDate) {
  const url =
    beginDate && endDate
      ? `equipments?begin_date=${beginDate}&end_date=${endDate}&long=${long}&lad=${lat}&lquery=${address}`
      : `equipments?long=${long}&lad=${lat}&lquery=${address}`;
  return async dispatch => {
    const res = await axios.get(url);
    dispatch({
      type: Actions.SEARCH_EQUIPMENT_SUCCESS,
      payload: res
    });
  };
}

export function clearSearchResult() {
  return {
    type: Actions.CLEAR_SEARCH_RESULT
  };
}

export function clearEquipmentDetail() {
  return {
    type: Actions.CLEAR_EQUIPMENT_DETAIL
  };
}
