import axios from "axios";
import StatusAction from "./status";
import * as Actions from "../types";

export function listTransactionBySupplierId(id) {
  return async dispatch => {
    dispatch({
      type: Actions.LIST_SUPPLIER_TRANSACTION.REQUEST
    });
    const res = await axios.get(`transactions/supplier/${id}`);
    dispatch({
      type: Actions.LIST_SUPPLIER_TRANSACTION.SUCCESS,
      payload: res
    });
  };
}

export function listTransactionByRequesterId(id) {
  return async dispatch => {
    try {
      const res = await axios.get(`transactions/requester/${id}`);
      dispatch({
        type: Actions.LIST_REQUESTER_TRANSACTION.SUCCESS,
        payload: res
      });
    } catch {}
  };
}

export function sendTransactionRequest(transaction) {
  return async dispatch => {
    const res = await axios.post(`transactions`, transaction);
    dispatch({
      type: Actions.SEND_TRANSACTION_REQUEST.SUCCESS,
      payload: res
    });
    dispatch(StatusAction.success("Send success"));
  };
}

export function requestTransaction(id, transactionStatus) {
  return async dispatch => {
    dispatch({ type: Actions.REQUEST_TRANSACTION.REQUEST });
    const res = await axios.put(`transactions/${id}`, transactionStatus);
    dispatch({
      type: Actions.REQUEST_TRANSACTION.SUCCESS,
      payload: res
    });
  };
}

export function cancelTransaction(id) {
  return async dispatch => {
    const res = await axios.post(`transactions/${id}`);
    dispatch({
      type: Actions.CANCEL_TRANSACTION.SUCCESS,
      payload: { id }
    });
  };
}

// export function clearTransactionDetail() {
//   return {
//     type: Actions.CLEAR_TRANSACTION_DETAIL
//   };
// }

export function clearSupplierTransactionList() {
  return {
    type: Actions.CLEAR_SUPPLIER_TRANSACTION_SUCCESS
  };
}
