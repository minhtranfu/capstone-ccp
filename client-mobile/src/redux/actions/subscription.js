import axios from "axios";
import {
  GET_SUBSCRIPTIONS,
  DELETE_SUBSCRIPTION,
  ADD_SUBSCRIPTIONS,
  EDIT_SUBSCRIPTION
} from "../types";

export function addSubscription(sub) {
  return async dispatch => {
    try {
      dispatch({ type: ADD_SUBSCRIPTIONS.REQUEST });
      const res = await axios.post("subscriptions", sub);
      dispatch({
        type: ADD_SUBSCRIPTIONS.SUCCESS,
        payload: res
      });
    } catch (err) {
      dispatch({
        type: ADD_SUBSCRIPTIONS.ERROR
      });
    }
  };
}

export function getSubscriptions() {
  return async dispatch => {
    try {
      dispatch({ type: GET_SUBSCRIPTIONS.REQUEST });
      const res = await axios.get("subscriptions");
      dispatch({
        type: GET_SUBSCRIPTIONS.SUCCESS,
        payload: res
      });
    } catch (err) {
      dispatch({
        type: GET_SUBSCRIPTIONS.ERROR
      });
    }
  };
}

export function editSubscription(id, subscription) {
  return async dispatch => {
    try {
      dispatch({ type: EDIT_SUBSCRIPTION.REQUEST });
      const res = await axios.put(`subscriptions/${id}`, subscription);
      dispatch({
        type: EDIT_SUBSCRIPTION.SUCCESS,
        payload: { id, data: res }
      });
    } catch (error) {
      dispatch({
        type: EDIT_SUBSCRIPTION.ERROR
      });
    }
  };
}

export function deleteSubscription(id) {
  return async dispatch => {
    try {
      const res = await axios.delete(`subscriptions/${id}`);
      console.log("ahihi res", res);
      dispatch({
        type: DELETE_SUBSCRIPTION.SUCCESS,
        payload: id
      });
    } catch (err) {
      console.log("err ne", err);
      dispatch({
        type: DELETE_SUBSCRIPTION.ERROR
      });
    }
  };
}
