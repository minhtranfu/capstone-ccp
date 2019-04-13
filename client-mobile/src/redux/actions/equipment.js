import axios from "axios";
import StatusAction from "./status";
import { AsyncStorage } from "react-native";
import * as Actions from "../types";
import { ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS } from "expo/build/IntentLauncherAndroid";

export function getContractorEquipmentList(contractorId) {
  return async dispatch => {
    dispatch({ type: Actions.LIST_CONTRACTOR_EQUIPMENT.REQUEST });
    try {
      const res = await axios.get(`equipments/supplier`);
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
      dispatch(StatusAction.success("Add success"));
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

export function searchEquipment(equipment, offset) {
  const params = Object.keys(equipment).map(
    value => `${value}=${equipment[value]}`
  );
  const queryString = params.join("&");
  let url = `equipments?${queryString}&offset=${offset}&limit=10`;
  console.log(url);
  return async dispatch => {
    try {
      if (offset < 10) {
        dispatch({
          type: Actions.SEARCH_EQUIPMENT.REQUEST
        });
      }
      const res = await axios.get(url);
      dispatch({
        type: Actions.SEARCH_EQUIPMENT.SUCCESS,
        payload: res,
        offset: offset
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

export function sendEquipmentFeedback(feedback) {
  return async dispatch => {
    try {
      dispatch({
        type: Actions.SEND_EQUIPMENT_FEEDBACK.REQUEST
      });
      const res = await axios.post(`equipmentFeedbacks`, feedback);
      dispatch({
        type: Actions.SEND_EQUIPMENT_FEEDBACK.SUCCESS,
        payload: res
      });
    } catch (error) {
      dispatch({
        type: Actions.SEND_EQUIPMENT_FEEDBACK.ERROR
      });
    }
  };
}

export function getEquipmentImage(equipmentId) {
  return async dispatch => {
    try {
      dispatch({
        type: Actions.GET_EQUIPMENT_IMAGES_LIST.REQUEST
      });
      const res = await axios.get(`equipments/${equipmentId}/images`);
      dispatch({
        type: Actions.GET_EQUIPMENT_IMAGES_LIST.SUCCESS,
        payload: res
      });
    } catch (error) {
      dispatch({
        type: Actions.GET_EQUIPMENT_IMAGES_LIST.ERROR
      });
    }
  };
}

// export function uploadImage(image) {
//   return axios.post('subscriptions', image)
// }

export function insertImageToEquipmentList(equipmentId, imageId) {
  return async dispatch => {
    try {
      dispatch({
        type: Actions.INSERT_NEW_EQUIPMENT_IMAGE.REQUEST
      });
      const res = await axios.post(`equipments/${equipmentId}/images`, imageId);
      dispatch({
        type: Actions.INSERT_NEW_EQUIPMENT_IMAGE.SUCCESS,
        payload: res
      });
    } catch (error) {
      dispatch({
        type: Actions.INSERT_NEW_EQUIPMENT_IMAGE.ERROR
      });
    }
  };
}

export function deleteEquipmentImage(equipmentId, imageId) {
  return async dispatch => {
    try {
      dispatch({
        type: Actions.DELETE_EQUIPMENT_IMAGE.REQUEST
      });
      const res = await axios.delete(
        `equipments/${equipmentId}/images/${imageId}`
      );
      dispatch({
        type: Actions.DELETE_EQUIPMENT_IMAGE.SUCCESS,
        payload: { id: imageId }
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: Actions.DELETE_EQUIPMENT_IMAGE.ERROR
      });
    }
  };
}

export function resetEquipmentImage() {
  return dispatch => {
    dispatch({
      type: Actions.RESET_EQUIPMENT_IMAGE
    });
  };
}
