import * as Actions from "../types";
import StatusAction from "./status";
import axios from "axios";

export function getMaterialFeedback(contractorId) {
  return async dispatch => {
    try {
      dispatch({
        type: Actions.GET_MATERIAL_FEEDBACK.REQUEST
      });
      const res = await axios.get(
        `materialFeedbacks?limit=1&offset=0&orderBy=createdTime.desc&supplierId=${contractorId}`
      );
      dispatch({
        type: Actions.GET_MATERIAL_FEEDBACK.SUCCESS,
        payload: res
      });
    } catch (error) {
      dispatch({ type: Actions.GET_MATERIAL_FEEDBACK.ERROR });
    }
  };
}

export function getEquipmentFeedback(contractorId) {
  return async dispatch => {
    try {
      dispatch({
        type: Actions.GET_EQUIPMENT_FEEDBACK.REQUEST
      });
      const res = await axios.get(
        `equipmentFeedbacks?offset=0&orderBy=createdTime.desc&supplierId=${contractorId}`
      );
      dispatch({
        type: Actions.GET_EQUIPMENT_FEEDBACK.SUCCESS,
        payload: res
      });
    } catch (error) {
      dispatch({ type: Actions.GET_EQUIPMENT_FEEDBACK.ERROR });
    }
  };
}

export function getDebrisFeedback(contractorId) {
  return async dispatch => {
    try {
      dispatch({
        type: Actions.GET_DEBRIS_FEEDBACK.REQUEST
      });
      const res = await axios.get(
        `debrisFeedbacks?limit=1&offset=0&orderBy=createdTime.desc&supplierId=${contractorId}`
      );
      dispatch({
        type: Actions.GET_DEBRIS_FEEDBACK.SUCCESS,
        payload: res
      });
    } catch (error) {
      dispatch({ type: Actions.GET_DEBRIS_FEEDBACK.ERROR });
    }
  };
}
