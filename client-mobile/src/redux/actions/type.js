import * as Actions from "../types";
import axios from "axios";

export function getGeneralEquipmentType() {
  return async dispatch => {
    const res = await axios.get(`generalEquipmentTypes`);
    dispatch({
      type: Actions.GET_GENERAL_EQUIPMENT_TYPE_SUCCESS,
      payload: res
    });
  };
}

export function getEquipmentType(generalTypeId) {
  return async dispatch => {
    const res = await axios.get(`generalEquipmentTypes/${generalTypeId}`);
    dispatch({
      type: Actions.GET_TYPE_SUCCESS,
      payload: res
    });
  };
}
