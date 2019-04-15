import * as Actions from "../types";
import axios from "axios";

export function searchMaterial(text, id, offset) {
  return async dispatch => {
    try {
      if (offset <= 0) {
        dispatch({
          type: Actions.SEARCH_MATERIAL.REQUEST
        });
      }
      const url = `materials?q=${text}&limit=10&orderBy=createdTime.desc&materialTypeId=${id}&offset=${offset}`;
      const res = await axios.get(url);
      dispatch({
        type: Actions.SEARCH_MATERIAL.SUCCESS,
        payload: res,
        offset: offset
      });
    } catch (error) {
      dispatch({
        type: Actions.SEARCH_MATERIAL.ERROR
      });
    }
  };
}

export function addNewMaterial(material) {
  console.log(material);
  return async dispatch => {
    const res = await axios.post(`materials`, material);
    dispatch({
      type: Actions.ADD_NEW_MATERIAL.SUCCESS,
      payload: res
    });
  };
}

export function editMaterial(materialId, material) {
  return async dispatch => {
    const res = await axios.put(`materials/${materialId}`, material);
    dispatch({
      type: Actions.UPDATE_MATERIAL_DETAIl.SUCCESS,
      payload: { data: res, id: materialId }
    });
  };
}

export function getGeneralMaterialType() {
  return async dispatch => {
    dispatch({
      type: Actions.GET_GENERAL_MATERIAL_TYPE.REQUEST
    });
    const res = await axios.get("generalMaterialTypes");
    dispatch({
      type: Actions.GET_GENERAL_MATERIAL_TYPE.SUCCESS,
      payload: res
    });
  };
}

export function getMaterialType() {
  return async dispatch => {
    dispatch({
      type: Actions.GET_MATERIAL_TYPE.REQUEST
    });
    const res = await axios.get("materialTypes");
    dispatch({
      type: Actions.GET_MATERIAL_TYPE.SUCCESS,
      payload: res
    });
  };
}

export function getMaterialListFromContractor(contractorId) {
  return async dispatch => {
    dispatch({
      type: Actions.GET_MATERIAL_LIST_BY_CONTRACTOR.REQUEST
    });
    const res = await axios.get(`materials/supplier`);
    dispatch({
      type: Actions.GET_MATERIAL_LIST_BY_CONTRACTOR.SUCCESS,
      payload: res
    });
  };
}

export function sendMaterialFeedback(feedback) {
  return async dispatch => {
    try {
      dispatch({
        type: Actions.SEND_MATERIAL_FEEDBACK.REQUEST
      });
      const res = await axios.post(`materialFeedbacks`, feedback);
      dispatch({
        type: Actions.SEND_MATERIAL_FEEDBACK.SUCCESS,
        payload: res
      });
    } catch (error) {
      dispatch({
        type: Actions.SEND_MATERIAL_FEEDBACK.ERROR
      });
    }
  };
}
