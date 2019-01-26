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
