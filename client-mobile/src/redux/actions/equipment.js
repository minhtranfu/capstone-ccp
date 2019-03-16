import axios from "axios";
import StatusAction from "./status";
import { AsyncStorage } from "react-native";
import * as Actions from "../types";
import { ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS } from "expo/build/IntentLauncherAndroid";

export function getContractorEquipmentList(contractorId) {
  return async dispatch => {
    dispatch({ type: Actions.LIST_CONTRACTOR_EQUIPMENT.REQUEST });
    try {
      const res = await axios.get(`contractors/${contractorId}/equipments`);
      dispatch({
        type: Actions.LIST_CONTRACTOR_EQUIPMENT.SUCCESS,
        payload: res
      });
    } catch (error) {
      console.log(error);
      dispatch({ type: Actions.LIST_CONTRACTOR_EQUIPMENT.ERROR });
    }
  };
}

export function addEquipment(equipment) {
  console.log(equipment);
  return async dispatch => {
    try {
      dispatch({
        type: Actions.ADD_EQUIPMENT.REQUEST
      });
      const res = await axios.post(`equipments`, equipment);
      dispatch({
        type: Actions.ADD_EQUIPMENT.SUCCESS,
        payload: res
      });
    } catch (error) {
      dispatch({ type: Actions.ADD_EQUIPMENT.ERROR });
    }
  };
}

export function updateEquipment(equipmentId, equipment) {
  console.log("edit", JSON.stringify(equipment));
  return async dispatch => {
    dispatch({
      type: Actions.UPDATE_EQUIPMENT.REQUEST
    });
    const res = await axios.put(`equipments/${equipmentId}`, equipment);
    dispatch({
      type: Actions.UPDATE_EQUIPMENT.SUCCESS,
      payload: { data: res, id: equipmentId }
    });
  };
}

export function updateEquipmentStatus(transactionId, equipmentId, status) {
  return async dispatch => {
    dispatch({
      type: Actions.UPDATE_EQUIPMENT_STATUS.REQUEST
    });
    dispatch({
      type: Actions.UPDATE_TRANSACTION_EQUIPMENT_STATUS.REQUEST
    });
    const res = await axios.put(`equipments/${equipmentId}/status`, status);
    dispatch({
      type: Actions.UPDATE_EQUIPMENT_STATUS.SUCCESS,
      payload: { data: res, id: equipmentId }
    });
    dispatch({
      type: Actions.UPDATE_TRANSACTION_EQUIPMENT_STATUS.SUCCESS,
      payload: { data: res, transactionId: transactionId }
    });
  };
}

export function removeEquipment(id) {
  return {
    type: Actions.REMOVE_EQUIPMENT.SUCCESS,
    id
  };
}

export function searchEquipment(
  address,
  long,
  lat,
  beginDate,
  endDate,
  equipmentTypeId,
  pageNo
) {
  console.log("date action", beginDate, endDate);
  const page = pageNo > 0 ? pageNo : 0;
  let url = `equipments?begin_date=${beginDate}&end_date=${endDate}&long=${long}&lad=${lat}&lquery=${address}&equipmentTypeId=${equipmentTypeId}&offset=${page}&limit=100`;
  return async dispatch => {
    try {
      dispatch({
        type: Actions.SEARCH_EQUIPMENT.REQUEST
      });
      const res = await axios.get(url, {
        headers: {
          Authorization: undefined
        }
      });
      dispatch({
        type: Actions.SEARCH_EQUIPMENT.SUCCESS,
        payload: res
      });
    } catch (error) {
      dispatch({
        type: Actions.SEARCH_EQUIPMENT.ERROR
      });
    }
  };
}

export function searchFilterEquipment(
  address,
  long,
  lat,
  beginDate,
  endDate,
  pageNo
) {
  const page = pageNo > 0 ? pageNo : 0;
  let url = `equipments?begin_date=${beginDate}&end_date=${endDate}&long=${long}&lad=${lat}&lquery=${address}&offset=${page}&limit=100`;
  return async dispatch => {
    try {
      dispatch({
        type: Actions.SEARCH_EQUIPMENT.REQUEST
      });
      const res = await axios.get(url);
      dispatch({
        type: Actions.SEARCH_EQUIPMENT.SUCCESS,
        payload: res
      });
    } catch (error) {
      dispatch({
        type: Actions.SEARCH_EQUIPMENT.ERROR
      });
    }
  };
}

export function clearSearchResult() {
  return {
    type: Actions.CLEAR_SEARCH_RESULT.SUCCESS
  };
}
