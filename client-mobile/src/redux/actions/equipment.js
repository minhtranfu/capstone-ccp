import axios from "axios";
import StatusAction from "./status";
import * as Actions from "../types";
import { ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS } from "expo/build/IntentLauncherAndroid";

// export function getEquipmentDetail(id) {
//   return async dispatch => {
//     const res = await axios.get(`equipments/${id}`);
//     dispatch({
//       type: Actions.GET_EQUIPMENT_DETAIL_SUCCESS,
//       payload: { data: res.data, id }
//     });
//   };
// }

export function getContractorEquipmentList(contractorId) {
  return async dispatch => {
    dispatch({ type: Actions.LIST_CONTRACTOR_EQUIPMENT.REQUEST });
    const res = await axios.get(`contractors/${contractorId}/equipments`);
    dispatch({
      type: Actions.LIST_CONTRACTOR_EQUIPMENT.SUCCESS,
      payload: res
    });
  };
}

export function addEquipment(equipment) {
  return async dispatch => {
    const res = await axios.post(`equipments`, equipment);
    dispatch({
      type: Actions.ADD_EQUIPMENT.SUCCESS,
      payload: res
    });
  };
}

export function updateEquipment(equipmentId, equipment) {
  return async dispatch => {
    const res = await axios.put(`equipments/${equipmentId}`, equipment);
    dispatch({
      type: Actions.UPDATE_EQUIPMENT.SUCCESS,
      payload: { data: res, id: equipmentId }
    });
  };
}

export function updateEquipmentStatus(equipmentId, status) {
  return async dispatch => {
    const res = await axios.put(`equipments/${equipmentId}/status`, status);
    dispatch({
      type: Actions.UPDATE_EQUIPMENT_STATUS.SUCCESS,
      payload: { data: res, id: equipmentId }
    });
  };
}

export function removeEquipment(id) {
  return {
    type: Actions.REMOVE_EQUIPMENT.SUCCESS,
    id
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
      type: Actions.SEARCH_EQUIPMENT.SUCCESS,
      payload: res
    });
  };
}

export function clearSearchResult() {
  return {
    type: Actions.CLEAR_SEARCH_RESULT.SUCCESS
  };
}
