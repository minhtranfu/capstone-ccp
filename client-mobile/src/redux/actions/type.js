import * as Actions from "../types";
import axios from "axios";

export function getGeneralEquipmentType() {
  return async dispatch => {
    dispatch({ type: Actions.GET_GENERAL_EQUIPMENT_TYPE.REQUEST });
    const res = await axios.get(`generalEquipmentTypes`);
    dispatch({
      type: Actions.GET_GENERAL_EQUIPMENT_TYPE.SUCCESS,
      payload: res
    });
  };
}
