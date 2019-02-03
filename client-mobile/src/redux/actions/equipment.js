import axios from "axios";
import * as Actions from "../types";
import { baseUrl } from "../baseUrl";

export function getEquipmentDetail(id) {
  return async dispatch => {
    const data = await axios.get(`${baseUrl}/equipments/${id}`);
    dispatch({
      type: Actions.EQUIPMENT_DETAIL_SUCCESS,
      payload: data
    });
  };
}

export function addNewEquipment(data) {
  console.log("actions", data);
  return {
    type: Actions.ADD_EQUIPMENT,
    payload: data
  };
}

export function updateEquipment(id, status) {
  console.log(status);
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
