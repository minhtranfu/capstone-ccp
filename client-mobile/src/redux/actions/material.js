import * as Actions from "../types";
import axios from "axios";

export function searchMaterial(text) {
  return async dispatch => {
    const res = await axios.get(`materials?q=${text}&limit=10`);
    dispatch({
      type: Actions.SEARCH_MATERIAL.SUCCESS,
      payload: res
    });
  };
}

export function addNewMaterial(material) {
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
    const res = await axios.get("generalMaterialTypes");
    dispatch({
      type: Actions.GET_GENERAL_MATERIAL_TYPE.SUCCESS,
      payload: res
    });
  };
}

export function getMaterialType() {
  return async dispatch => {
    const res = await axios.get("materialTypes");
    dispatch({
      type: Actions.GET_MATERIAL_TYPE.SUCCESS,
      payload: res
    });
  };
}
