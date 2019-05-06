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

export function readAllNotification() {
  return axios.post("notifications/readAll");
}

// export function readAllNotification() {
//   return async dispatch => {
//     try {
//       dispatch({
//         type: Actions.READ_ALL_NOTIFICATION.REQUEST,
//         payload: res
//       });
//       const res = await axios.post(`notifications/readAll`);
//       dispatch({
//         type: Actions.READ_ALL_NOTIFICATION.SUCCESS,
//         payload: res
//       });
//     } catch (error) {
//       dispatch({
//         type: Actions.READ_ALL_NOTIFICATION.ERROR
//       });
//     }
//   };
// }

export function getAllNotification(offset) {
  return async dispatch => {
    if (offset <= 0) {
      dispatch({
        type: Actions.GET_ALL_NOTIFICATION.REQUEST
      });
    }
    const res = await axios.get(`notifications?limit=10&offset=${offset}`);
    dispatch({
      type: Actions.GET_ALL_NOTIFICATION.SUCCESS,
      payload: res,
      offset: offset
    });
  };
}

export function postNoticationToken() {}

export function readNotification(notificationId, content) {
  return async dispatch => {
    dispatch({
      type: Actions.READ_NOTIFICATION.REQUEST
    });
    const res = await axios.put(`notifications/${notificationId}`, content);
    dispatch({
      type: Actions.READ_NOTIFICATION.SUCCESS,
      payload: { data: res, id: notificationId }
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

export function countNotification() {
  return dispatch => {
    dispatch({
      type: Actions.COUNT_NOTIFICATION
    });
  };
}

export function countTotalNotification() {
  return dispatch => {
    dispatch({
      type: Actions.COUNT_TOTAL_NOTIFICATION
    });
  };
}
