import axios from "axios";
import StatusAction from "./status";
import { AsyncStorage } from "react-native";
import * as Actions from "../types";

export function uploadImage(image) {
  return async dispatch => {
    try {
      dispatch({
        type: Actions.UPLOAD_IMAGE.REQUEST
      });
      const res = await axios.post(`equipmentImages`, image, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      dispatch({
        type: Actions.UPLOAD_IMAGE.SUCCESS,
        payload: res
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: Actions.UPLOAD_IMAGE.ERROR
      });
    }
  };
}

export function insertImage(equipmentId, imageId, imageList) {
  return async dispatch => {
    try {
      dispatch({
        type: Actions.INSERT_NEW_IMAGE.REQUEST
      });
      const res = await axios.post(
        `equipments/${equipmentId}/images/${imageId}`,
        imageList
      );
      dispatch({
        type: Actions.INSERT_NEW_IMAGE.SUCCESS,
        payload: res
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: Actions.INSERT_NEW_IMAGE.ERROR
      });
    }
  };
}
export function getImageById(equipmentId, imageId) {
  return async dispatch => {
    try {
      dispatch({
        type: Actions.GET_IMAGE_BY_ID.REQUEST
      });
      const res = await axios.get(
        `equipments/${equipmentId}/images/${imageId}`
      );
      dispatch({
        type: Actions.GET_IMAGE_BY_ID.SUCCESS,
        payload: res
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: Actions.GET_IMAGE_BY_ID.ERROR
      });
    }
  };
}
export function deleteImageById(equipmentId, imageId) {
  return async dispatch => {
    try {
      dispatch({
        type: Actions.DELETE_IMAGE.REQUEST
      });
      const res = await axios.delete(
        `equipments/${equipmentId}/images/${imageId}`
      );
      dispatch({
        type: Actions.DELETE_IMAGE.SUCCESS,
        payload: res
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: Actions.DELETE_IMAGE.ERROR
      });
    }
  };
}
