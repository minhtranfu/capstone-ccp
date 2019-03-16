import * as Actions from "../types";
import axios from "axios";

export function allowPushNotification() {
  return dispatch => {
    dispatch({
      type: Actions.ALLOW_PUSH_NOTIFICATION.SUCCESS,
      payload: true
    });
  };
}

export function getAllNotification(pageNo) {
  return async dispatch => {
    const res = await axios.get(`notifications?limit=10&offset=0`);
    dispatch({
      type: Actions.GET_ALl_NOTIFICATION.SUCCESS,
      payload: res
    });
  };
}

export function postNoticationToken() {}

export function readNotification(notificationId, content) {
  return async dispatch => {
    const res = await axios.put(`notifications/${notificationId}`, content);
    dispatch({
      type: Actions.READ_NOTIFICATION.SUCCESS,
      payload: res
    });
  };
}

export function deleteNotication(notificationId) {
  return async dispatch => {
    const res = await axios.delete(`notifications/${notificationId}`);
    dispatch({
      type: Actions.DELETE_NOTIFICATION_MESSAGE.SUCCESS,
      payload: res
    });
  };
}

export function deleteNoticationToken(tokenId) {
  return async dispatch => {
    const res = await axios.delete(`notificationTokens/${tokenId}`);
    dispatch({
      type: Actions.DELETE_NOTIFICATION_TOKEN.SUCCESS,
      payload: res
    });
  };
}
