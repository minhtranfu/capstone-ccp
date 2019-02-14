import axios from "axios";
import * as Actions from "../types";

export function sendTransactionRequest(transaction) {
  return async dispatch => {
    const res = await axios.post(`transactions`, transaction);
    dispatch({
      type: Actions.SEND_TRANSACTION_REQUEST_SUCCESS,
      payload: res.status
    });
  };
}

export function approveTransaction(id, transaction) {
  return async dispatch => {
    const res = await axios.put(`transactions/${id}`, transaction);
    dispatch({
      type: Actions.APPROVE_TRANSACTION_SUCCESS,
      payload: res.status
    });
  };
}

export function denyTransaction(id) {
  return async dispatch => {
    const res = await axios.put(`transactions/${id}`);
    dispatch({
      type: Actions.DENY_TRANSACTION_SUCCESS,
      payload: res.status
    });
  };
}

export function cancelTransaction(id) {
  return async dispatch => {
    const res = await axios.post(`transactions/${id}`);
    dispatch({
      type: Actions.CANCEL_TRANSACTION_SUCCESS,
      payload: res.status
    });
  };
}
